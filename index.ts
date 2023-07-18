import express, {Express, Request, Response } from 'express';
import {sign} from 'jsonwebtoken';
import {jwtAuth} from "./middlewares/jwt-auth";
import {rateLimiter} from "./middlewares/rate-limiter";
import "reflect-metadata";

import settings from "./settings";

const app: Express = express();

app.use(jwtAuth);
app.use(rateLimiter);

app.get('/api/user/auth', function (req: Request, res: Response) {
    return res.json({
        token: sign(
            {
                foo: 'bar',
                exp: Math.floor(Date.now() / 1000) + (86400 * 365), // Год жизни
            },
            settings.jwt_secret
        )
    });
});

app.put('/api/user/state', function (req: Request, res: Response) {
    return res.json({
        'clicks_count': -123
    });
});


app.listen(settings.port, () => {
    console.log(`Example app listening on port ${settings.port}`)
});