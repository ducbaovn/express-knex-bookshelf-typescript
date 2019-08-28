import * as Bluebird from "bluebird";
import { BaseRepository } from "./base.repository";
import { OrderDishDto } from "./sql/models";
import { OrderDishModel } from "../models";
import * as Schema from "./sql/schema";

export class OrderDishRepository extends BaseRepository<OrderDishDto, OrderDishModel> {
    constructor() {
        super(OrderDishDto, OrderDishModel, {
            fromDto: OrderDishModel.fromDto,
            toDto: OrderDishModel.toDto,
        });
    }

    public deleteByOrderId(orderId: string): Bluebird<void> {
        return Bluebird.resolve()
        .tap(() => {
            let deleteLogic = {};
            deleteLogic[Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.IS_DELETED] = true;
            return this.updateByQuery(q => {
                q.where(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.ORDER_ID, orderId);
            }, deleteLogic);
        });
    }
}
export default OrderDishRepository;
