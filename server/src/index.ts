import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import cors from 'cors';
import express, {Express, Request, Response } from 'express';
import {sign} from 'jsonwebtoken';
import {jwtAuth, payload} from "./middleware/jwt-auth";
import {rateLimiter} from "./middleware/rate-limiter";
import "reflect-metadata";

import settings from "./../settings";

AppDataSource.initialize().then(async () => {
    const app: Express = express();

    app.use(jwtAuth);
    app.use(rateLimiter);
    app.use(cors());

    app.get('/api/user/auth', async function (req: Request, res: Response) {
        const user = new User();
        user.name = 'Some user name';
        await AppDataSource.manager.save(user);
        return res.json({
            token: sign(
                {
                    user_id: user.id,
                    exp: Math.floor(Date.now() / 1000) + (86400 * 365), // Год жизни
                },
                settings.jwt_secret
            )
        });
    });

    app.get('/api/user/state', async function (req: Request, res: Response) {
        const user = await AppDataSource.getRepository(User).findOneBy({
            id: payload.user_id,
        });
        return res.json(user.state);
    });

    app.put('/api/user/state', async function (req: Request, res: Response) {
        const user = await AppDataSource.getRepository(User).findOneBy({
            id: payload.user_id,
        });

        return res.json(user.state);
    });

    app.listen(settings.port, () => {
        console.log(`Example app listening on port ${settings.port}`)
    });

}).catch(error => console.log(error))
