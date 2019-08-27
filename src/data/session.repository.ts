import { BaseRepository } from "./base.repository";
import { SessionDto } from "./sql/models";
import { SessionModel } from "../models";

export class SessionRepository extends BaseRepository<SessionDto, SessionModel> {
    constructor() {
        super(SessionDto, SessionModel, {
            fromDto: SessionModel.fromDto,
            toDto: SessionModel.toDto,
        });
    }
}
export  default SessionRepository;
