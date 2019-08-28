import * as Bluebird from "bluebird";
import { BaseService } from "./base.service";
import { UserModel, ExceptionModel } from "../models";
import { UserRepository } from "../data";
import { ErrorCode, HttpStatus, Utils } from "../libs";
import { ROLE } from "../libs/constants";

export class UserService extends BaseService<UserModel, typeof UserRepository > {
    constructor() {
        super(UserRepository);
    }

    public create(userName: string, password: string, roleId: string = ROLE.USER): Bluebird<UserModel> {
        return Bluebird.resolve(new UserModel())
        .tap(user => {
            user.userName = userName;
            user.password = password;
            user.roleId = roleId;
            user.validate();
            return UserRepository.findByUserName(user.userName)
            .then(object => {
                if (object != null) {
                    throw new ExceptionModel(
                        ErrorCode.AUTHENTICATION.USER_EXIST.CODE,
                        ErrorCode.AUTHENTICATION.USER_EXIST.MESSAGE,
                        false,
                        HttpStatus.BAD_REQUEST
                    );
                }
            });
        })
        .tap(user => {
            return Utils.hashPassword(user.password)
            .then(hash => user.password = hash);
        })
        .then(user => UserRepository.insert(user));
    }

    public update(id: string, userName?: string, password?: string, roleId?: string): Bluebird<UserModel> {
        return Bluebird.resolve(new UserModel())
        .tap(user => {
            user.id = id;
            if (password) {
                user.password = password;
            }
            if (roleId) {
                user.roleId = roleId;
            }
            if (userName) {
                user.userName = userName;
                return UserRepository.findByUserName(user.userName)
                .then(object => {
                    if (object != null) {
                        throw new ExceptionModel(
                            ErrorCode.AUTHENTICATION.USER_EXIST.CODE,
                            ErrorCode.AUTHENTICATION.USER_EXIST.MESSAGE,
                            false,
                            HttpStatus.BAD_REQUEST
                        );
                    }
                });
            }
        })
        .tap(user => {
            if (user.password) {
                return Utils.hashPassword(user.password)
                .then(hash => user.password = hash);
            }
        })
        .tap(user => UserRepository.update(user));
    }
}

export default UserService;
