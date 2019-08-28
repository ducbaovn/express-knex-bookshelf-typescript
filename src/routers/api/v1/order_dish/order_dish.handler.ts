import * as Bluebird from "bluebird";
import * as express from "express";
import { HttpStatus } from "../../../../libs";
import { OrderDishRepository } from "../../../../data";
import { OrderDishService } from "../../../../interactors";
import { SessionModel } from "../../../../models";

export class OrderDishHandler {
    public static udpateStatus(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return Bluebird.resolve()
        .then(() => {
            let id = req.body.id;
            let status = req.body.status;
            return OrderDishService.update(id, status);
        })
        .then(object => {
            res.status(HttpStatus.OK);
            res.json(object);
        })
        .catch(next);
    }

    public static dequeue(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let session: SessionModel = res.locals.session;
        return OrderDishService.dequeue()
        .then(object => {
            object.servedBy = session.userId;
            OrderDishRepository.update(object);
            res.status(HttpStatus.OK);
            res.json(object);
        })
        .catch(next);
    }
}

export default OrderDishHandler;

