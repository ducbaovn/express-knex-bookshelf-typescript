import * as Bluebird from "bluebird";
import { BaseService } from "./base.service";
import { OrderModel, OrderDishModel } from "../models";
import { OrderRepository } from "../data";
import { OrderDishService } from ".";

export class OrderService extends BaseService<OrderModel, typeof OrderRepository > {
    constructor() {
        super(OrderRepository);
    }

    public create(items: any[], userId: string, notes?: string): Bluebird<OrderModel> {
        return Bluebird.resolve(new OrderModel())
        .tap(order => {
            order.notes = notes;
            order.userId = userId;
            items.forEach(item => {
                let orderDish = new OrderDishModel();
                orderDish.dishId = item.dishId;
                orderDish.quantity = item.quantity;
                orderDish.validate();
                order.items.push(orderDish);
            });
            return order.setTotalAmountAndEstimatedMinutes();
        })
        .tap(order => OrderRepository.insert(order))
        .tap(order => {
            return Bluebird.each(order.items, item => {
                item.orderId = order.id;
                return OrderDishService.create(item);
            });
        });
    }

    public delete(id: string): Bluebird<void> {
        return OrderDishService.deleteByOrderId(id)
        .tap(() => OrderRepository.deleteLogic(id));
    }
}

export default OrderService;
