import * as Bluebird from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseModel, ExceptionModel } from "./";
import { UserDto } from "../data/sql/models";
import { ErrorCode, Utils, HttpStatus } from "../libs";
import { ROLE } from "../libs/constants";
import { UserRepository } from "../data";

export class UserModel extends BaseModel {
    public userName: string;
    public password: string;
    public roleId: string;

    public static fromDto(dto: UserDto, filters: string[] = []): UserModel {
        let model: UserModel = null;
        if (dto != null) {
            model = new UserModel();
            model.id = BaseModel.getString(dto.get(Schema.USERS_TABLE_SCHEMA.FIELDS.ID));
            model.isEnable = BaseModel.getBoolean(dto.get(Schema.USERS_TABLE_SCHEMA.FIELDS.IS_ENABLE));
            model.isDeleted = BaseModel.getBoolean(dto.get(Schema.USERS_TABLE_SCHEMA.FIELDS.IS_DELETED));
            model.createdDate = BaseModel.getDate(dto.get(Schema.USERS_TABLE_SCHEMA.FIELDS.CREATED_DATE));
            model.updatedDate = BaseModel.getDate(dto.get(Schema.USERS_TABLE_SCHEMA.FIELDS.UPDATED_DATE));
            model.userName = BaseModel.getString(dto.get(Schema.USERS_TABLE_SCHEMA.FIELDS.USER_NAME));
            model.roleId = BaseModel.getString(dto.get(Schema.USERS_TABLE_SCHEMA.FIELDS.ROLE_ID));
            model.password = BaseModel.getString(dto.get(Schema.USERS_TABLE_SCHEMA.FIELDS.PASSWORD));
        }
        UserModel.filter(model, filters);
        return model;
    }

    public static toDto(model: UserModel): any {
        let dto = {};
        if (model.id != null) {
            dto[Schema.SESSIONS_TABLE_SCHEMA.FIELDS.ID] = model.id;
        }
        if (model.isDeleted != null) {
            dto[Schema.USERS_TABLE_SCHEMA.FIELDS.IS_DELETED] = model.isDeleted;
        }
        if (model.isEnable != null) {
            dto[Schema.USERS_TABLE_SCHEMA.FIELDS.IS_ENABLE] = model.isEnable;
        }
        if (model.userName != null) {
            dto[Schema.USERS_TABLE_SCHEMA.FIELDS.USER_NAME] = model.userName;
        }
        if (model.roleId != null) {
            dto[Schema.USERS_TABLE_SCHEMA.FIELDS.ROLE_ID] = model.roleId;
        }
        if (model.password != null) {
            dto[Schema.USERS_TABLE_SCHEMA.FIELDS.PASSWORD] = model.password;
        }
        return dto;
    }
    public validate() {
        if (!this.userName || !this.password || !this.roleId) {
            throw new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST
            );
        }
    }
}
