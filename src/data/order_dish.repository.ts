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
    public query(searchParams: any = {}, offset?: number, limit?: number, isOrder?: boolean): any {
        limit = limit || null;
        offset = offset || null;

        let status = searchParams.status;
        let orderBy = searchParams.orderBy || Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.CREATED_DATE;
        let orderType = searchParams.orderType || "ASC";

        return (q): void => {
            q.where(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.IS_DELETED, false);
            if (status != null) {
                q.whereIn(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.STATUS, status);
            }
            if (offset != null) {
                q.offset(offset);
            }
            if (limit != null) {
                q.limit(limit);
            }
            if (isOrder != null) {
                q.orderBy(orderBy, orderType);
            }
        };
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
