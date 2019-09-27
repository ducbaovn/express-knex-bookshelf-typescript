import * as Schema from "../data/sql/schema";
import { BaseModel } from ".";
import { TemplateDto } from "../data/sql/models";

export class TemplateModel extends BaseModel {
    public static fromDto(dto: TemplateDto, filters: string[] = []): TemplateModel {
        let model: TemplateModel = null;
        if (dto != null) {
            model = new TemplateModel();
            model.id = BaseModel.getString(dto.get(Schema.TEMPLATES_TABLE_SCHEMA.FIELDS.ID));
            model.isEnable = BaseModel.getBoolean(dto.get(Schema.TEMPLATES_TABLE_SCHEMA.FIELDS.IS_ENABLE));
            model.isDeleted = BaseModel.getBoolean(dto.get(Schema.TEMPLATES_TABLE_SCHEMA.FIELDS.IS_DELETED));
            model.createdDate = BaseModel.getDate(dto.get(Schema.TEMPLATES_TABLE_SCHEMA.FIELDS.CREATED_DATE));
            model.updatedDate = BaseModel.getDate(dto.get(Schema.TEMPLATES_TABLE_SCHEMA.FIELDS.UPDATED_DATE));
        }
        TemplateModel.filter(model, filters);
        return model;
    }

    public static toDto(model: TemplateModel): any {
        let dto = {};
        if (model.id != null) {
            dto[Schema.TEMPLATES_TABLE_SCHEMA.FIELDS.ID] = model.id;
        }
        if (model.isDeleted != null) {
            dto[Schema.TEMPLATES_TABLE_SCHEMA.FIELDS.IS_DELETED] = model.isDeleted;
        }
        if (model.isEnable != null) {
            dto[Schema.TEMPLATES_TABLE_SCHEMA.FIELDS.IS_ENABLE] = model.isEnable;
        }
        return dto;
    }
}
