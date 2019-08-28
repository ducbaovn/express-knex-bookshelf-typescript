import * as Schema from "../data/sql/schema";
import { BaseModel, ExceptionModel } from "./";
import { DishDto } from "../data/sql/models";
import { ErrorCode, HttpStatus } from "../libs";

export class DishModel extends BaseModel {
    public description: string;
    public images: string[];
    public price: number;
    public cookingMinutes: number;

    public static fromDto(dto: DishDto, filters: string[] = []): DishModel {
        let model: DishModel = null;
        if (dto != null) {
            model = new DishModel();
            model.id = BaseModel.getString(dto.get(Schema.DISHES_TABLE_SCHEMA.FIELDS.ID));
            model.isEnable = BaseModel.getBoolean(dto.get(Schema.DISHES_TABLE_SCHEMA.FIELDS.IS_ENABLE));
            model.isDeleted = BaseModel.getBoolean(dto.get(Schema.DISHES_TABLE_SCHEMA.FIELDS.IS_DELETED));
            model.createdDate = BaseModel.getDate(dto.get(Schema.DISHES_TABLE_SCHEMA.FIELDS.CREATED_DATE));
            model.updatedDate = BaseModel.getDate(dto.get(Schema.DISHES_TABLE_SCHEMA.FIELDS.UPDATED_DATE));
            model.description = BaseModel.getString(dto.get(Schema.DISHES_TABLE_SCHEMA.FIELDS.DESCRIPTION));
            model.images = BaseModel.getArrayString(dto.get(Schema.DISHES_TABLE_SCHEMA.FIELDS.IMAGES));
            model.price = BaseModel.getNumber(dto.get(Schema.DISHES_TABLE_SCHEMA.FIELDS.PRICE));
            model.cookingMinutes = BaseModel.getNumber(dto.get(Schema.DISHES_TABLE_SCHEMA.FIELDS.COOKING_MINUTES));
        }
        DishModel.filter(model, filters);
        return model;
    }

    public static toDto(model: DishModel): any {
        let dto = {};
        if (model.id != null) {
            dto[Schema.DISHES_TABLE_SCHEMA.FIELDS.ID] = model.id;
        }
        if (model.isDeleted != null) {
            dto[Schema.DISHES_TABLE_SCHEMA.FIELDS.IS_DELETED] = model.isDeleted;
        }
        if (model.isEnable != null) {
            dto[Schema.DISHES_TABLE_SCHEMA.FIELDS.IS_ENABLE] = model.isEnable;
        }
        if (model.description != null) {
            dto[Schema.DISHES_TABLE_SCHEMA.FIELDS.DESCRIPTION] = model.description;
        }
        if (model.images != null) {
            dto[Schema.DISHES_TABLE_SCHEMA.FIELDS.IMAGES] = model.images;
        }
        if (model.price != null) {
            dto[Schema.DISHES_TABLE_SCHEMA.FIELDS.PRICE] = model.price;
        }
        if (model.cookingMinutes != null) {
            dto[Schema.DISHES_TABLE_SCHEMA.FIELDS.COOKING_MINUTES] = model.cookingMinutes;
        }
        return dto;
    }
    public validate() {
        if (!this.description || !this.images || this.price == null || this.cookingMinutes == null) {
            throw new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST
            );
        }
    }
}
