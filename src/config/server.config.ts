import {Application, json, NextFunction, Request, Response, urlencoded} from "express";
import {BaseException, InternalServerException} from "./exception.config";
import cors from 'cors';
import {container} from "./inversify.config";
import passport from "passport";
import {AccessTokenStrategy} from "../middelware/strategy/access-token.strategy";

export async function serverConfig(app: Application) {
    //TODO: refactoring
    const allowedOrigins = ['http://localhost:3000'];

    const options: cors.CorsOptions = {
        origin: allowedOrigins
    };

    app.use(cors(options));
    app.use(urlencoded({
        extended: true,
    }));
    app.use(json());

    app.use(passport.initialize());
    const accessTokenStrategy = container.get(AccessTokenStrategy);
    accessTokenStrategy.init();
}


export function serverErrorConfig(app: Application) {
    app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
        if (err && err instanceof BaseException) {
            return res.status(err.statusCode).json(err);
        }

        if (err) {
            return res.status(500).json(new InternalServerException(err.message));
        }

        next();
    });
}
