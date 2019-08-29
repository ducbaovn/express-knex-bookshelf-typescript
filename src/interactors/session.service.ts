import * as Bluebird from "bluebird";
import { BaseService } from "./base.service";
import { SessionModel, UserModel, ExceptionModel } from "../models";
import { SessionRepository, UserRepository } from "../data";
import { Jwt, ErrorCode, HttpStatus, Utils } from "../libs";
import * as Schema from "../data/sql/schema";

export class SessionService extends BaseService<SessionModel, typeof SessionRepository > {
    constructor() {
        super(SessionRepository);
    }

    public create(user: UserModel): Bluebird<SessionModel> {
        return Bluebird.resolve(new SessionModel())
        .then(session => {
            session.userId = user.id;
            session.roleId = user.roleId;
            session.user = user;
            session.token = Jwt.encode(session);
            return SessionRepository.insert(session);
        });
    }

    public refreshToken(refreshToken: string): Bluebird<SessionModel> {
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

    public login(userName: string, password: string): Bluebird<SessionModel> {
        return UserRepository.findByUserName(userName)
        .tap(user => {
            if (!user) {
                throw new ExceptionModel(
                    ErrorCode.AUTHENTICATION.AUTHENTICATION_FAIL.CODE,
                    ErrorCode.AUTHENTICATION.AUTHENTICATION_FAIL.MESSAGE,
                    false,
                    HttpStatus.FORBIDDEN
                );
            }
            return Utils.compareHash(password, user.password)
            .then(isValid => {
                if (!isValid) {
                    throw new ExceptionModel(
                        ErrorCode.AUTHENTICATION.AUTHENTICATION_FAIL.CODE,
                        ErrorCode.AUTHENTICATION.AUTHENTICATION_FAIL.MESSAGE,
                        false,
                        HttpStatus.FORBIDDEN
                    );
                }
            });
        })
        .then(user => this.create(user));
    }

    public revokeTokenByUser(userId: string): Bluebird<any> {
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

    public revokeToken(refreshToken: string): Bluebird<any> {
        return Bluebird.resolve()
        .then(() => {
            if (!refreshToken) {
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
                q.where(Schema.SESSIONS_TABLE_SCHEMA.FIELDS.ID, refreshToken);
            }, deleteLogic);
        });
    }
}

export default SessionService;
