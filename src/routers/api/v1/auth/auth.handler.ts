import * as express from "express";
import * as Bluebird from "bluebird";
import { HttpStatus } from "../../../../libs";
import { UserService, SessionService } from "../../../../interactors";

export class AuthHandler {

    public static register(req: express.Request, res: express.Response, next: express.NextFunction): Bluebird<void> {
        let userName = req.body.userName;
        let password = req.body.password;
        return UserService.create(userName, password)
        .then(user => SessionService.create(user))
        .then(session => {
            res.status(HttpStatus.OK);
            res.json(session);
        })
        .catch(next);
    }

    public static login(req: express.Request, res: express.Response, next: express.NextFunction): Bluebird<void> {
        let userName = req.body.userName;
        let password = req.body.password;
        return SessionService.login(userName, password)
        .then(session => {
            res.status(HttpStatus.OK);
            res.json(session);
        })
        .catch(next);
    }

    public static refreshToken(req: express.Request, res: express.Response, next: express.NextFunction): Bluebird<void> {
        let refreshToken = req.body.refreshToken;
        return SessionService.refreshToken(refreshToken)
        .then(session => {
            res.status(HttpStatus.OK);
            res.json(session);
        })
        .catch(next);
    }
}

export default AuthHandler;

