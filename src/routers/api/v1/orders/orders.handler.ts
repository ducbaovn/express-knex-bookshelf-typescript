import * as Bluebird from "bluebird";
import * as express from "express";
import { HttpStatus, ErrorCode } from "../../../../libs";
import { HEADERS, ROLE } from "../../../../libs/constants";
import { OrderRepository } from "../../../../data";
import { OrderService } from "../../../../interactors";
import { SessionModel, ExceptionModel } from "../../../../models";

export class OrderHandler {
    public static create(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let session: SessionModel = res.locals.session;
        return Bluebird.resolve()
        .then(() => {
            let items = req.body.items;
            let notes = req.body.notes;
            let userId = session.userId;
            return OrderService.create(items, userId, notes);
        })
        .then(object => {
            res.status(HttpStatus.OK);
            res.json(object);
        })
        .catch(next);
    }

    public static detail(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let session: SessionModel = res.locals.session;
        return OrderRepository.findOne(req.params.id, ["orderDishes.dish"])
        .then(object => {
            if (!object) {
                res.status(HttpStatus.NO_CONTENT);
                return res.end();
            }
            if (session.roleId === ROLE.USER && session.userId !== object.userId) {
                throw new ExceptionModel(
                    ErrorCode.RESOURCE.INVALID_ACCESS.CODE,
                    ErrorCode.RESOURCE.INVALID_ACCESS.MESSAGE,
                    false,
                    HttpStatus.FORBIDDEN
                );
            }
            res.status(HttpStatus.OK);
            res.json(object);
        })
        .catch(next);
    }

    public static delete(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return Bluebird.resolve()
        .then(() => OrderService.delete(req.params.id))
        .then(() => {
            res.status(HttpStatus.OK);
            res.end();
        })
        .catch(next);
    }

    public static list(req: express.Request, res: express.Response, next: express.NextFunction) {
        let session: SessionModel = res.locals.session;
        let offset = parseInt(req.query.offset, 10) || null;
        let limit = parseInt(req.query.limit, 10) || null;
        let queryParams = req.query || null;
        if (session.roleId === ROLE.USER) {
            queryParams.userId = session.userId;
        }
        return OrderRepository.search(queryParams, offset, limit)
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

export default OrderHandler;

