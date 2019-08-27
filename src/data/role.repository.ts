import { BaseRepository } from "./base.repository";
import { RoleDto } from "./sql/models";
import { RoleModel } from "../models";

export class RoleRepository extends BaseRepository<RoleDto, RoleModel> {
    constructor() {
        super(RoleDto, RoleModel, {
            fromDto: RoleModel.fromDto,
            toDto: RoleModel.toDto,
        });
    }
}
export  default RoleRepository;
