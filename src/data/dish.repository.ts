import * as Bluebird from "bluebird";
import { BaseRepository } from "./base.repository";
import { DishDto } from "./sql/models";
import { DishModel, CollectionWrap } from "../models";
import * as Schema from "./sql/schema";

export class DishRepository extends BaseRepository<DishDto, DishModel> {
    constructor() {
        super(DishDto, DishModel, {
            fromDto: DishModel.fromDto,
            toDto: DishModel.toDto,
        });
    }
    public query(searchParams: any = {}, offset?: number, limit?: number, isOrder?: boolean): any {
        limit = limit || null;
        offset = offset || null;

        let key = searchParams.key || null;
        let orderBy = searchParams.orderBy || Schema.DISHES_TABLE_SCHEMA.FIELDS.UPDATED_DATE;
        let orderType = searchParams.orderType || "ASC";

        return (q): void => {
            q.where(Schema.DISHES_TABLE_SCHEMA.FIELDS.IS_DELETED, false);
            if (key != null) {
                q.where(q1 => {
                    q1.where(Schema.DISHES_TABLE_SCHEMA.FIELDS.DESCRIPTION, "ILIKE", `%${key}%`);
                });
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
    public search(searchParams: any = {}, offset: number, limit: number, related = [], filters = []): Bluebird<CollectionWrap<DishModel>> {
        return this.countAndQuery(this.query(searchParams), this.query(searchParams, offset, limit, true), related, filters);
    }
}
export default DishRepository;
