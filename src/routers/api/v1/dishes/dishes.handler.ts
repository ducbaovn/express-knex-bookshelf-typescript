import * as Bluebird from "bluebird";
import * as express from "express";
import { HttpStatus } from "../../../../libs";
import { HEADERS } from "../../../../libs/constants";
import { DishRepository } from "../../../../data";
import { DishService } from "../../../../interactors";

export class DishHandler {
    public static create(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return Bluebird.resolve()
        .then(() => {
            let description = req.body.description;
            let images = req.body.images;
            let price = req.body.price;
            let cookingMinutes = req.body.cookingMinutes;
            return DishService.create(description, images, price, cookingMinutes);
        })
        .then(object => {
            res.status(HttpStatus.OK);
            res.json(object);
        })
        .catch(next);
    }

    public static detail(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return DishRepository.findOne(req.params.id)
        .then(object => {
            res.status(HttpStatus.OK);
            res.json(object);
        })
        .catch(next);
    }

    public static update(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let description = req.body.description || null;
        let images = req.body.images || null;
        let price = req.body.price;
        let cookingMinutes = req.body.cookingMinutes;
        return DishService.update(req.params.id, description, images, price, cookingMinutes)
        .tap(dish => {
            res.status(HttpStatus.OK);
            res.json(dish);
        })
        .catch(next);
    }

    public static delete(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return Bluebird.resolve()
        .then(() => {
            return DishRepository.deleteLogic(req.params.id);
        })
        .then(() => {
            res.status(HttpStatus.OK);
            res.end();
        })
        .catch(next);
    }

    public static list(req: express.Request, res: express.Response, next: express.NextFunction) {
        let offset = parseInt(req.query.offset, 10) || null;
        let limit = parseInt(req.query.limit, 10) || null;
        let queryParams = req.query || null;
        return DishRepository.search(queryParams, offset, limit)
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

export default DishHandler;

