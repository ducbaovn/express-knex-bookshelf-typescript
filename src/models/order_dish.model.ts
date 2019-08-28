import * as Schema from "../data/sql/schema";
import { BaseModel, DishModel, ExceptionModel } from "./";
import { OrderDishDto, DishDto } from "../data/sql/models";
import { ErrorCode, HttpStatus } from "../libs";

export class OrderDishModel extends BaseModel {
    public orderId: string;
    public dishId: string;
    public quantity: number;
    public totalAmount: number;
    public status: string;
    public servedBy: string;

    public dish: DishModel;

    public static fromDto(dto: OrderDishDto, filters: string[] = []): OrderDishModel {
        let model: OrderDishModel = null;
        if (dto != null) {
            model = new OrderDishModel();
            model.id = BaseModel.getString(dto.get(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.ID));
            model.isEnable = BaseModel.getBoolean(dto.get(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.IS_ENABLE));
            model.isDeleted = BaseModel.getBoolean(dto.get(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.IS_DELETED));
            model.createdDate = BaseModel.getDate(dto.get(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.CREATED_DATE));
            model.updatedDate = BaseModel.getDate(dto.get(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.UPDATED_DATE));
            model.orderId = BaseModel.getString(dto.get(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.ORDER_ID));
            model.dishId = BaseModel.getString(dto.get(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.DISH_ID));
            model.quantity = BaseModel.getNumber(dto.get(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.QUANTITY));
            model.totalAmount = BaseModel.getNumber(dto.get(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.TOTAL_AMOUNT));
            model.status = BaseModel.getString(dto.get(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.STATUS));
            model.servedBy = BaseModel.getString(dto.get(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.SERVED_BY));

            let dishDto: DishDto = dto.related("dish") as DishDto;
            if (dishDto != null && dishDto.id != null) {
                let dishModel = DishModel.fromDto(dishDto, filters);
                if (dishModel != null) {
                    model.dish = dishModel;
                }
            }
        }
        OrderDishModel.filter(model, filters);
        return model;
    }

    public static toDto(model: OrderDishModel): any {
        let dto = {};
        if (model.id != null) {
            dto[Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.ID] = model.id;
        }
        if (model.isDeleted != null) {
            dto[Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.IS_DELETED] = model.isDeleted;
        }
        if (model.isEnable != null) {
            dto[Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.IS_ENABLE] = model.isEnable;
        }
        if (model.orderId != null) {
            dto[Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.ORDER_ID] = model.orderId;
        }
        if (model.dishId != null) {
            dto[Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.DISH_ID] = model.dishId;
        }
        if (model.quantity != null) {
            dto[Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.QUANTITY] = model.quantity;
        }
        if (model.totalAmount != null) {
            dto[Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.TOTAL_AMOUNT] = model.totalAmount;
        }
        if (model.status != null) {
            dto[Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.STATUS] = model.status;
        }
        if (model.servedBy != null) {
            dto[Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.SERVED_BY] = model.servedBy;
        }
        return dto;
    }
    public validate() {
        if (!this.dishId || !this.quantity) {
            throw new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST
            );
        }
    }
}
