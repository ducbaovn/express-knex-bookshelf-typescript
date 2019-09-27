import * as Bluebird from "bluebird";
import { WithRelatedQuery } from "bookshelf";
import { BaseModel } from "../models";
import { BaseRepository } from "../data/base.repository";

export class BaseService<M extends BaseModel, R extends BaseRepository<any, M>> {
    private repo: R;

    constructor(repo: R) {
        this.repo = repo;
    }

    public findOne(id: string, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<M> {
        return Bluebird.resolve()
            .then(() => {
                return this.repo.findOne(id, related, filters);
            });
    }
}

export default BaseService;
