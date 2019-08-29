import * as Bluebird from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseModel, UserModel } from "./";
import { OrderDto, UserDto } from "../data/sql/models";
import { OrderDishModel } from "./order_dish.model";
import { DishService, OrderDishService } from "../interactors";

export class OrderModel extends BaseModel {
    public userId: string;
    public totalAmount: number;
    public notes: string;
    public estimatedServedMinutes: number;

    public user: UserModel;
    public items: OrderDishModel[] = [];

    public static fromDto(dto: OrderDto, filters: string[] = []): OrderModel {
        let model: OrderModel = null;
        if (dto != null) {
            model = new OrderModel();
            model.id = BaseModel.getString(dto.get(Schema.ORDERS_TABLE_SCHEMA.FIELDS.ID));
            model.isEnable = BaseModel.getBoolean(dto.get(Schema.ORDERS_TABLE_SCHEMA.FIELDS.IS_ENABLE));
            model.isDeleted = BaseModel.getBoolean(dto.get(Schema.ORDERS_TABLE_SCHEMA.FIELDS.IS_DELETED));
            model.createdDate = BaseModel.getDate(dto.get(Schema.ORDERS_TABLE_SCHEMA.FIELDS.CREATED_DATE));
            model.updatedDate = BaseModel.getDate(dto.get(Schema.ORDERS_TABLE_SCHEMA.FIELDS.UPDATED_DATE));
            model.userId = BaseModel.getString(dto.get(Schema.ORDERS_TABLE_SCHEMA.FIELDS.USER_ID));
            model.totalAmount = BaseModel.getNumber(dto.get(Schema.ORDERS_TABLE_SCHEMA.FIELDS.TOTAL_AMOUNT));
            model.estimatedServedMinutes = BaseModel.getNumber(dto.get(Schema.ORDERS_TABLE_SCHEMA.FIELDS.ESTIMATED_MINUTES));
            model.notes = BaseModel.getString(dto.get(Schema.ORDERS_TABLE_SCHEMA.FIELDS.NOTES));

            let userDto: UserDto = dto.related("user") as UserDto;
            if (userDto != null && userDto.id != null) {
                let userModel = UserModel.fromDto(userDto, filters);
                if (userModel != null) {
                    model.user = userModel;
                }
            }
        }
        OrderModel.filter(model, filters);
        return model;
    }

    public static toDto(model: OrderModel): any {
        let dto = {};
        if (model.id != null) {
            dto[Schema.ORDERS_TABLE_SCHEMA.FIELDS.ID] = model.id;
        }
        if (model.isDeleted != null) {
            dto[Schema.ORDERS_TABLE_SCHEMA.FIELDS.IS_DELETED] = model.isDeleted;
        }
        if (model.isEnable != null) {
            dto[Schema.ORDERS_TABLE_SCHEMA.FIELDS.IS_ENABLE] = model.isEnable;
        }
        if (model.userId != null) {
            dto[Schema.ORDERS_TABLE_SCHEMA.FIELDS.USER_ID] = model.userId;
        }
        if (model.totalAmount != null) {
            dto[Schema.ORDERS_TABLE_SCHEMA.FIELDS.TOTAL_AMOUNT] = model.totalAmount;
        }
        if (model.estimatedServedMinutes != null) {
            dto[Schema.ORDERS_TABLE_SCHEMA.FIELDS.ESTIMATED_MINUTES] = model.estimatedServedMinutes;
        }
        if (model.notes != null) {
            dto[Schema.ORDERS_TABLE_SCHEMA.FIELDS.NOTES] = model.notes;
        }
        return dto;
    }

    public setTotalAmountAndEstimatedMinutes(): Bluebird<void> {
        return Bluebird.resolve()
        .tap(() => {
            this.totalAmount = 0;
            this.estimatedServedMinutes = 0;
            return Bluebird.each(this.items, item => {
                return DishService.findOne(item.dishId)
                .then(object => {
                    item.totalAmount = object.price * item.quantity;
                    this.totalAmount += item.totalAmount;
                    this.estimatedServedMinutes += object.cookingMinutes * item.quantity;
                });
            })
            .then(() => OrderDishService.getTotalQueueTime())
            .then(queueMinutes => this.estimatedServedMinutes += queueMinutes);
        });
    }
}
