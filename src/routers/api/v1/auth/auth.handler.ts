import * as express from "express";
import * as Bluebird from "bluebird";
import { SessionModel, UserModel } from "../../../../models";
import { HttpStatus } from "../../../../libs";

export class AuthHandler {

    public static register(req: express.Request, res: express.Response, next: express.NextFunction): Bluebird<void> {
        let userName = req.body.userName;
        let password = req.body.password;
        return UserModel.create(userName, password)
        .then(user => SessionModel.create(user))
        .then(session => {
            res.status(HttpStatus.OK);
            res.json(session);
        })
        .catch(next);
    }

    public static login(req: express.Request, res: express.Response, next: express.NextFunction): Bluebird<void> {
        let userName = req.body.userName;
        let password = req.body.password;
        return SessionModel.login(userName, password)
        .then(session => {
            res.status(HttpStatus.OK);
            res.json(session);
        })
        .catch(next);
    }

    public static refreshToken(req: express.Request, res: express.Response, next: express.NextFunction): Bluebird<void> {
        let refreshToken = req.body.refreshToken;
        return SessionModel.refreshToken(refreshToken)
        .then(session => {
            res.status(HttpStatus.OK);
            res.json(session);
        })
        .catch(next);
    }
}

export default AuthHandler;

