import * as Bluebird from "bluebird";
import { BaseRepository } from "./base.repository";
import { OrderDto } from "./sql/models";
import { OrderModel, CollectionWrap } from "../models";
import * as Schema from "../data/sql/schema";

export class OrderRepository extends BaseRepository<OrderDto, OrderModel> {
    constructor() {
        super(OrderDto, OrderModel, {
            fromDto: OrderModel.fromDto,
            toDto: OrderModel.toDto,
        });
    }
    public query(searchParams: any = {}, offset?: number, limit?: number, isOrder?: boolean): any {
        limit = limit || null;
        offset = offset || null;

        let userId = searchParams.userId;
        let orderBy = searchParams.orderBy || Schema.ORDERS_TABLE_SCHEMA.FIELDS.CREATED_DATE;
        let orderType = searchParams.orderType || "ASC";

        return (q): void => {
            q.where(Schema.ORDERS_TABLE_SCHEMA.FIELDS.IS_DELETED, false);
            if (userId != null) {
                q.where(Schema.ORDERS_TABLE_SCHEMA.FIELDS.USER_ID, userId);
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
    public search(searchParams: any = {}, offset: number, limit: number, related = [], filters = []): Bluebird<CollectionWrap<OrderModel>> {
        return this.countAndQuery(this.query(searchParams), this.query(searchParams, offset, limit, true), related, filters);
    }
}
export default OrderRepository;
