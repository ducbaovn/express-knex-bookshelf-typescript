import * as Schema from "../data/sql/schema";
import { BaseModel, UserModel, RoleModel } from "./";
import { SessionDto, UserDto } from "../data/sql/models";

export class SessionModel extends BaseModel {
    public userId: string;
    public roleId: string;

    public user: UserModel;

    public static fromDto(dto: SessionDto, filters: string[] = []): SessionModel {
        let model: SessionModel = null;
        if (dto != null) {
            model = new SessionModel();
            model.id = BaseModel.getString(dto.get(Schema.SESSIONS_TABLE_SCHEMA.FIELDS.ID));
            model.isEnable = BaseModel.getBoolean(dto.get(Schema.SESSIONS_TABLE_SCHEMA.FIELDS.IS_ENABLE));
            model.isDeleted = BaseModel.getBoolean(dto.get(Schema.SESSIONS_TABLE_SCHEMA.FIELDS.IS_DELETED));
            model.createdDate = BaseModel.getDate(dto.get(Schema.SESSIONS_TABLE_SCHEMA.FIELDS.CREATED_DATE));
            model.updatedDate = BaseModel.getDate(dto.get(Schema.SESSIONS_TABLE_SCHEMA.FIELDS.UPDATED_DATE));
            model.userId = BaseModel.getString(dto.get(Schema.SESSIONS_TABLE_SCHEMA.FIELDS.USER_ID));
            model.roleId = BaseModel.getString(dto.get(Schema.SESSIONS_TABLE_SCHEMA.FIELDS.ROLE_ID));

            let userDto: UserDto = dto.related("user") as UserDto;
            if (userDto != null && userDto.id != null) {
                let userModel = UserModel.fromDto(userDto, filters);
                if (userModel != null) {
                    model.user = userModel;
                }
            }
        }
        SessionModel.filter(model, filters);
        return model;
    }

    public static toDto(model: SessionModel): any {
        let dto = {};
        if (model.isDeleted != null) {
            dto[Schema.SESSIONS_TABLE_SCHEMA.FIELDS.IS_DELETED] = model.isDeleted;
        }
        if (model.isEnable != null) {
            dto[Schema.SESSIONS_TABLE_SCHEMA.FIELDS.IS_ENABLE] = model.isEnable;
        }
        if (model.userId != null) {
            dto[Schema.SESSIONS_TABLE_SCHEMA.FIELDS.USER_ID] = model.userId;
        }
        if (model.roleId != null) {
            dto[Schema.SESSIONS_TABLE_SCHEMA.FIELDS.ROLE_ID] = model.roleId;
        }
        return dto;
    }
}
