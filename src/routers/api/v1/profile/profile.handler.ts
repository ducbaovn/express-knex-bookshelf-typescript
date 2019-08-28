import * as Bluebird from "bluebird";
import * as express from "express";
import { HttpStatus } from "../../../../libs";
import { UserService, SessionService } from "../../../../interactors";
import { SessionModel } from "../../../../models";

export class ProfileHandler {
    public static detail(req: express.Request, res: express.Response, next: express.NextFunction): any {
        try {
            let session: SessionModel = res.locals.session;
            let user = session.user;
            res.status(HttpStatus.OK);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    public static update(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return Bluebird.resolve()
        .then(() => {
            let session: SessionModel = res.locals.session;
            let userId = session.userId;
            let userName = req.body.userName || null;
            let password = req.body.password || null;
            return UserService.update(userId, userName, password);
        })
        .tap(user => {
            if (user.password != null) {
                return SessionService.revokeTokenByUser(user.id);
            }
        })
        .tap(user => {
            res.status(HttpStatus.OK);
            res.json(user);
        })
        .catch(next);
    }
}

export default ProfileHandler;

