import * as Bluebird from "bluebird";
import { BaseService } from "./base.service";
import { OrderDishModel, OrderDishQueue, ExceptionModel } from "../models";
import { OrderDishRepository } from "../data";
import { ErrorCode, HttpStatus } from "../libs";

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
        .then(queue => queue.dequeue())
        .then(orderDishId => OrderDishRepository.findOne(orderDishId, ["dish"]));
    }
}

export default OrderDishService;
