import * as Schema from "../data/sql/schema";
import { BaseModel } from "./base.model";
import { RoleDto } from "../data/sql/models";

export class RoleModel extends BaseModel {
    public name: string;
    public description: string;

    public static fromDto(dto: RoleDto, filters: string[] = []): RoleModel {
        let model: RoleModel = null;
        if (dto != null) {
            model = new RoleModel();
            model.id = BaseModel.getString(dto.get(Schema.ROLES_TABLE_SCHEMA.FIELDS.ID));
            model.isEnable = BaseModel.getBoolean(dto.get(Schema.ROLES_TABLE_SCHEMA.FIELDS.IS_ENABLE));
            model.isDeleted = BaseModel.getBoolean(dto.get(Schema.ROLES_TABLE_SCHEMA.FIELDS.IS_DELETED));
            model.createdDate = BaseModel.getDate(dto.get(Schema.ROLES_TABLE_SCHEMA.FIELDS.CREATED_DATE));
            model.updatedDate = BaseModel.getDate(dto.get(Schema.ROLES_TABLE_SCHEMA.FIELDS.UPDATED_DATE));
            model.description = BaseModel.getString(dto.get(Schema.ROLES_TABLE_SCHEMA.FIELDS.DESCRIPTION));
        }
        RoleModel.filter(model, filters);
        return model;
    }

    public static toDto(model: RoleModel): any {
        let dto = {};
        if (model.id != null) {
            dto[Schema.ROLES_TABLE_SCHEMA.FIELDS.ID] = model.id;
        }
        if (model.isDeleted != null) {
            dto[Schema.ROLES_TABLE_SCHEMA.FIELDS.IS_DELETED] = model.isDeleted;
        }
        if (model.isEnable != null) {
            dto[Schema.ROLES_TABLE_SCHEMA.FIELDS.IS_ENABLE] = model.isEnable;
        }
        if (model.description != null) {
            dto[Schema.ROLES_TABLE_SCHEMA.FIELDS.DESCRIPTION] = model.description;
        }
        return dto;
    }
}
