import * as Bluebird from "bluebird";
import { BaseRepository } from "./base.repository";
import { UserDto } from "./sql/models";
import { UserModel, CollectionWrap } from "../models";
import * as Schema from "./sql/schema";

export class UserRepository extends BaseRepository<UserDto, UserModel> {
    constructor() {
        super(UserDto, UserModel, {
            fromDto: UserModel.fromDto,
            toDto: UserModel.toDto,
        });
    }
    public findByUserName(userName: string): Bluebird<UserModel> {
        return this.findOneByQuery(q => {
            q.where(Schema.USERS_TABLE_SCHEMA.FIELDS.USER_NAME, userName);
        });
    }
    public query(searchParams: any = {}, offset?: number, limit?: number, isOrder?: boolean): any {
        limit = limit || null;
        offset = offset || null;

        let roleId = searchParams.roleId || null;
        let key = searchParams.key || null;
        let orderBy = searchParams.orderBy || Schema.USERS_TABLE_SCHEMA.FIELDS.UPDATED_DATE;
        let orderType = searchParams.orderType || "ASC";

        return (q): void => {
            q.where(Schema.USERS_TABLE_SCHEMA.FIELDS.IS_DELETED, false);
            if (roleId != null) {
                q.where(Schema.USERS_TABLE_SCHEMA.FIELDS.ROLE_ID, roleId);
            }
            if (key != null) {
                q.where(q1 => {
                    q1.where(Schema.USERS_TABLE_SCHEMA.FIELDS.USER_NAME, "ILIKE", `%${key}%`);
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
    public search(searchParams: any = {}, offset: number, limit: number, related = [], filters = []): Bluebird<CollectionWrap<UserModel>> {
        return this.countAndQuery(this.query(searchParams), this.query(searchParams, offset, limit, true), related, filters);
    }
}
export default UserRepository;
