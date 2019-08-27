import { BaseRepository } from "./base.repository";
import { UserDto } from "./sql/models";
import { UserModel } from "../models";

export class UserRepository extends BaseRepository<UserDto, UserModel> {
    constructor() {
        super(UserDto, UserModel, {
            fromDto: UserModel.fromDto,
            toDto: UserModel.toDto,
        });
    }
}
export  default UserRepository;
