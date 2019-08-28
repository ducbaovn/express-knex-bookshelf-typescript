import { BaseModel } from "../models";
import { BaseRepository } from "../data/base.repository";

export class BaseService<M extends BaseModel, R extends BaseRepository<any, M>> {
    private repo: R;

    constructor(repo: R) {
        this.repo = repo;
    }
}

export default BaseService;
