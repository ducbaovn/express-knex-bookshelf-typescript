import { Dto } from "./connection";
import * as UUID from "uuid";
import * as Schema from "./schema";

export class BaseDto<T> extends Dto.Model<any> {

    public static knex() {
        return Dto.knex;
    }

    private static generateUuid(model: any): void {
        if (model.isNew()) {
            model.set(model.idAttribute, UUID.v4());
        }
    }

    constructor(attributes?: any, isNew?: boolean) {
        super(attributes);
        if (isNew != null) {
            this.isNew = () => {
                return isNew;
            };
        }
    }

    // noinspection JSMethodCanBeStatic
    get idAttribute(): string {
        return "id";
    }

    get isDelete(): string {
        return "is_deleted";
    }

    get hasTimestamps(): string[] {
        return ["created_date", "updated_date"];
    }

    public initialize(): void {
        this.on("saving", BaseDto.generateUuid);
    }
}

export class UserDto extends BaseDto<UserDto> {
    get tableName(): string {
        return Schema.USERS_TABLE_SCHEMA.TABLE_NAME;
    }

    public role(): any {
        return this.belongsTo(RoleDto, Schema.USERS_TABLE_SCHEMA.FIELDS.ROLE_ID);
    }
}

export class RoleDto extends BaseDto<RoleDto> {
    get tableName(): string {
        return Schema.ROLES_TABLE_SCHEMA.TABLE_NAME;
    }
}

export class SessionDto extends BaseDto<SessionDto> {
    get tableName(): string {
        return Schema.SESSIONS_TABLE_SCHEMA.TABLE_NAME;
    }

    public user(): any {
        return this.belongsTo(UserDto, Schema.SESSIONS_TABLE_SCHEMA.FIELDS.USER_ID);
    }
}

export class DishDto extends BaseDto<DishDto> {
    get tableName(): string {
        return Schema.DISHES_TABLE_SCHEMA.TABLE_NAME;
    }
}

export class OrderDto extends BaseDto<OrderDto> {
    get tableName(): string {
        return Schema.ORDERS_TABLE_SCHEMA.TABLE_NAME;
    }

    public user(): any {
        return this.belongsTo(UserDto, Schema.ORDERS_TABLE_SCHEMA.FIELDS.USER_ID);
    }

    public orderDishes(): any {
        return this.hasMany(OrderDishDto, Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.ORDER_ID);
    }
}

export class OrderDishDto extends BaseDto<OrderDishDto> {
    get tableName(): string {
        return Schema.ORDER_DISH_TABLE_SCHEMA.TABLE_NAME;
    }

    public order(): any {
        return this.belongsTo(OrderDto, Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.ORDER_ID);
    }

    public dish(): any {
        return this.belongsTo(DishDto, Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.DISH_ID);
    }
}