import * as Bluebird from "bluebird";
import * as express from "express";
import { HttpStatus } from "../../../../libs";
import { HEADERS } from "../../../../libs/constants";
import { UserRepository } from "../../../../data";
import { UserService, SessionService } from "../../../../interactors";

export class UserHandler {
    public static create(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return Bluebird.resolve()
        .then(() => {
            let userName = req.body.userName;
            let password = req.body.password;
            return UserService.create(userName, password);
        })
        .then(object => {
            res.status(HttpStatus.OK);
            res.json(object);
        })
        .catch(next);
    }

    public static detail(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return UserRepository.findOne(req.params.id)
        .then(object => {
            res.status(HttpStatus.OK);
            res.json(object);
        })
        .catch(next);
    }

    public static update(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let userName = req.body.userName || null;
        let password = req.body.password || null;
        let roleId = req.body.roleId || null;
        return UserService.update(req.params.id, userName, password, roleId)
        .tap(user => {
            if (user.password != null || user.roleId != null) {
                return SessionService.revokeTokenByUser(user.id);
            }
        })
        .tap(user => {
            res.status(HttpStatus.OK);
            res.json(user);
        })
        .catch(next);
    }

    public static delete(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return UserRepository.deleteLogic(req.params.id)
        .then(() => {
            SessionService.revokeTokenByUser(req.params.id);
            res.status(HttpStatus.OK);
            res.end();
        })
        .catch(next);
    }

    public static list(req: express.Request, res: express.Response, next: express.NextFunction) {
        let offset = parseInt(req.query.offset, 10) || null;
        let limit = parseInt(req.query.limit, 10) || null;
        let queryParams = req.query || null;
        return UserRepository.search(queryParams, offset, limit)
        .tap(result => {
            res.header(HEADERS.TOTAL, result.total.toString(10));
            if (offset != null) {
                res.header(HEADERS.OFFSET, offset.toString(10));
            }
            if (limit != null) {
                res.header(HEADERS.LIMIT, limit.toString(10));
            }
            res.status(HttpStatus.OK);
            res.json(result.data);
        })
        .catch(next);
    }
}

export default UserHandler;

