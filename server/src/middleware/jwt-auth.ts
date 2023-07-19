import {JwtPayload, verify} from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import settings from "../../settings";

export let payload: JwtPayload | undefined;

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
    if(req.url === '/api/user/auth' || req.method === 'OPTIONS') {
        return next();
    }

    const token = req.headers.authorization;
    if (!token) {
        return res
            .status(401)
            .json({
                code: 1,
                message: 'Token not found in headers'
            });
    }
    const token_parts = token.split(' ');
    if(token_parts.length !== 2) {
        return res
            .status(401)
            .json({
                code: 2,
                message: 'Incorrect authorization header format'
            });
    }

    verify(token_parts[1], settings.jwt_secret, function (err, decoded: JwtPayload) {
        payload = decoded;
        if (err) {
            return res
                .status(401)
                .json({
                    code: 3,
                    message: 'Incorrect token'
                });
        }
        return next();
    });
}