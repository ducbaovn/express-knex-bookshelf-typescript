import * as Bluebird from "bluebird";
import Redis from "../data/redis/redis";
import { BaseService } from "./base.service";
import { OrderDishModel, OrderDishQueue, ExceptionModel } from "../models";
import { OrderDishRepository } from "../data";
import { ErrorCode, HttpStatus, Utils } from "../libs";
import { ORDER_DISH_STATUS } from "../libs/constants";

export class OrderDishService extends BaseService<OrderDishModel, typeof OrderDishRepository > {
    constructor() {
        super(OrderDishRepository);
    }

    public create(orderDish: OrderDishModel): Bluebird<OrderDishModel> {
        let orderDishQueue = new OrderDishQueue();
        return OrderDishRepository.insert(orderDish)
        .tap(item => orderDishQueue.enqueue(item.id));
    }

    public deleteByOrderId(orderId: string): Bluebird<void> {
        return OrderDishRepository.deleteByOrderId(orderId);
    }

    public update(id: string, status?: string): Bluebird<OrderDishModel> {
        return Bluebird.resolve(new OrderDishModel())
        .tap(orderDish => {
            orderDish.id = id;
            orderDish.status = status || null;
            if (!orderDish.id) {
                throw new ExceptionModel(
                    ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                    ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                    false,
                    HttpStatus.BAD_REQUEST
                );
            }
            return OrderDishRepository.update(orderDish);
        });
    }

    public dequeue(): Bluebird<OrderDishModel> {
        return Bluebird.resolve(new OrderDishQueue())
        .then(queue => {
            let item: OrderDishModel;
            return Bluebird.resolve(item)
            .then(item => {
                return Utils.PromiseLoopWithCatch(() => {
                    return !!item;
                }, () => {
                    return queue.dequeue()
                    .then(orderDishId => {
                        if (!orderDishId) {
                            throw new ExceptionModel(
                                ErrorCode.RESOURCE.ORDER_DISH_QUEUE_EMPTY.CODE,
                                ErrorCode.RESOURCE.ORDER_DISH_QUEUE_EMPTY.MESSAGE,
                                false,
                                HttpStatus.BAD_REQUEST
                            );
                        }
                        return OrderDishRepository.findOne(orderDishId, ["dish"]);
                    })
                    .then(orderDish => {
                        item = orderDish;
                    });
                })
                .then(() => item);
            });
        });
    }

    public getTotalQueueTime(): Bluebird<number> {
        let params = {
            status: [ORDER_DISH_STATUS.NEW]
        };
        return OrderDishRepository.findByQuery(OrderDishRepository.query(params), ["dish"])
        .then(items => {
            let totalTime = 0;
            items.forEach(item => {
                totalTime += item.quantity * item.dish.cookingMinutes;
            });
            return totalTime;
        });
    }
}

export default OrderDishService;
