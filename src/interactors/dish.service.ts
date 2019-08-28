import * as Bluebird from "bluebird";
import { BaseService } from "./base.service";
import { DishModel, ExceptionModel } from "../models";
import { DishRepository } from "../data";
import { ErrorCode, HttpStatus, Utils } from "../libs";
import { ROLE } from "../libs/constants";

export class DishService extends BaseService<DishModel, typeof DishRepository > {
    constructor() {
        super(DishRepository);
    }

    public create(description: string, images: string[], price: number, cookingMinutes: number): Bluebird<DishModel> {
        return Bluebird.resolve(new DishModel())
        .then(dish => {
            dish.description = description;
            dish.images = images;
            dish.price = price;
            dish.cookingMinutes = cookingMinutes;
            dish.validate();
            return DishRepository.insert(dish);
        });
    }

    public update(id: string, description?: string, images?: string[], price?: number, cookingMinutes?: number): Bluebird<DishModel> {
        return Bluebird.resolve(new DishModel())
        .tap(dish => {
            dish.id = id;
            if (description) {
                dish.description = description;
            }
            if (images) {
                dish.images = images;
            }
            if (price != null) {
                dish.price = price;
            }
            if (cookingMinutes != null) {
                dish.cookingMinutes = cookingMinutes;
            }
            return DishRepository.update(dish);
        });
    }
}

export default DishService;
