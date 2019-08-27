import * as Bluebird from "bluebird";
import * as express from "express";
import { HttpStatus } from "../../../../libs";
import { UserModel, SessionModel } from "../../../../models";
import { HEADERS } from "../../../../libs/constants";
import { UserRepository } from "../../../../data";

export class UserHandler {
    public static create(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return Bluebird.resolve()
        .then(() => {
            let userName = req.body.userName;
            let password = req.body.password;
            return UserModel.create(userName, password);
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
        return UserModel.update(req.params.id)
        .tap(user => {
            if (user.password != null || user.roleId) {
                return SessionModel.revokeTokenByUser(user.id);
            }
        })
        .tap(user => {
            res.status(HttpStatus.OK);
            res.json(user);
        })
        .catch(err => {
            next(err);
        });
    }

    public static delete(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return UserRepository.deleteLogic(req.params.id)
        .then(() => {
            SessionModel.revokeTokenByUser(req.params.id);
            res.status(HttpStatus.OK);
            res.end();
        })
        .catch(err => {
            next(err);
        });
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
        .catch(err => {
            next(err);
        });
    }
}

export default UserHandler;

