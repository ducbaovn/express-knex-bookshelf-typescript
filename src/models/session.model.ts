import * as Bluebird from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseModel, ExceptionModel, UserModel, RoleModel } from "./";
import { SessionDto, UserDto } from "../data/sql/models";
import { Jwt, ErrorCode, HttpStatus, Utils } from "../libs";
import { SessionRepository, UserRepository } from "../data";

export class SessionModel extends BaseModel {
    public userId: string;
    public roleId: string;

    public token: string;
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

    public static create(user: UserModel): Bluebird<SessionModel> {
        return Bluebird.resolve(new SessionModel())
        .then(session => {
            session.userId = user.id;
            session.roleId = user.roleId;
            session.token = Jwt.encode(session);
            session.user = user;
            return SessionRepository.insert(session);
        });
    }

    public static refreshToken(refreshToken: string): Bluebird<SessionModel> {
        return SessionRepository.findOne(refreshToken, ["user"])
        .tap(session => {
            if (!session) {
                throw new ExceptionModel(
                    ErrorCode.AUTHENTICATION.AUTHENTICATION_FAIL.CODE,
                    ErrorCode.AUTHENTICATION.AUTHENTICATION_FAIL.MESSAGE,
                    false,
                    HttpStatus.FORBIDDEN
                );
            }
            session.token = Jwt.encode(session);
        });
    }

    public static login(userName: string, password: string): Bluebird<SessionModel> {
        return UserRepository.findByUserName(userName)
        .tap(user => {
            return Utils.compareHash(password, user.password)
            .then(isValid => {
                if (!isValid) {
                    throw new ExceptionModel(
                        ErrorCode.AUTHENTICATION.AUTHENTICATION_FAIL.CODE,
                        ErrorCode.AUTHENTICATION.AUTHENTICATION_FAIL.MESSAGE,
                        false,
                        HttpStatus.BAD_REQUEST
                    );
                }
            });
        })
        .then(user => SessionModel.create(user));
    }

    public static revokeTokenByUser(userId: string): Bluebird<any> {
        return Bluebird.resolve()
        .then(() => {
            if (!userId) {
                throw new ExceptionModel(
                    ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                    ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                    false,
                    HttpStatus.BAD_REQUEST
                );
            }
            let deleteLogic = {};
            deleteLogic[Schema.SESSIONS_TABLE_SCHEMA.FIELDS.IS_DELETED] = true;
            return SessionRepository.updateByQuery(q => {
                q.where(Schema.SESSIONS_TABLE_SCHEMA.FIELDS.USER_ID, userId);
            }, deleteLogic);
        });
    }
}
