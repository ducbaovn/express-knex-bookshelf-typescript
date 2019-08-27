import { ErrorCode, HttpStatus } from "../libs";
import { BaseModel, CollectionWrap, ExceptionModel } from "../models";
import { BaseDto } from "./sql/models";
import * as Bluebird from "bluebird";
import { QueryBuilder, Transaction, Raw } from "knex";
import * as _ from "lodash";
import { WithRelatedQuery } from "bookshelf";
import { POSTGRES_ERROR_CODE } from "../libs/constants";

export class BaseRepository<T extends BaseDto<T>, X extends BaseModel> {
    constructor(protected dto: { new (attributes?: any, isNew?: boolean): T },
        protected model: { new (): X },
        protected converter: {
            toDto: (data: X) => any,
            fromDto: (data: any, filter: string[]) => X,
        }) {
    }

    public update(data: X, t?: Transaction): Bluebird<T> {
        if (data == null && data.id != null && data.id !== "") {
            return Bluebird.reject(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        let ins = this.converter.toDto(data);
        return new this.dto({ id: ins.id }).save(ins, {
            patch: true,
            transacting: t
        }).catch(err => this.handleBookshelfError(err));
    }

    public insert(data: X, t?: Transaction): Bluebird<T> {
        if (data == null) {
            return Bluebird.resolve(null);
        }
        let ins = this.converter.toDto(data);
        return new this.dto().save(ins, {
            transacting: t
        }).catch(err => this.handleBookshelfError(err));
    }

    private handleBookshelfError(err) {
        switch (err.code) {
            case POSTGRES_ERROR_CODE.UNIQUE_CONSTRAINT: {
                throw new ExceptionModel(
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE.CODE,
                    ErrorCode.RESOURCE.DUPLICATE_RESOURCE.MESSAGE,
                    false,
                    HttpStatus.BAD_REQUEST
                );
            }
            case POSTGRES_ERROR_CODE.STATEMENT_TIMEOUT: {
                throw new ExceptionModel(
                    ErrorCode.SYSTEM.SYSTEM_TIMEOUT.CODE,
                    ErrorCode.SYSTEM.SYSTEM_TIMEOUT.MESSAGE,
                    false,
                    HttpStatus.BAD_REQUEST
                );
            }
            default: throw err;
        }
    }

    /**
     * Function insert and convert to model object with related and filters.
     *
     * @param data
     * @param related
     * @param filters
     * @returns {Bluebird<U>}
     */
    public insertGet(data: X, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<X> {
        return this.insert(data)
            .then(result => {
                return this.findOne(result.id, related, filters);
            });
    }

    public forceDelete(id: string, t?: Transaction): Bluebird<boolean> {
        if (id == null) {
            return Bluebird.resolve(false);
        }
        return new this.dto({ id: id }).destroy({
            transacting: t
        })
            .then(() => {
                return true;
            })
            .catch(err => {
                console.error(err.message, err);
                return false;
            });
    }
    public deleteLogic(id: string, t?: Transaction): Bluebird<T> {
        if (id == null || id.length === 0) {
            return Bluebird.reject(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST
            ));
        };

        return this.findOne(id)
            .then((object) => {
                if (!object) {
                    throw new ExceptionModel(
                        ErrorCode.RESOURCE.NOT_FOUND.CODE,
                        ErrorCode.RESOURCE.NOT_FOUND.MESSAGE,
                        false,
                        HttpStatus.BAD_REQUEST
                    );
                };
                return new this.dto({ id: id }).save({ is_deleted: 1 }, {
                    patch: true,
                    transacting: t
                });
            });
    }

    /**
     *
     * @param callback
     * @returns {BlueBird<any>}
     */
    public deleteByQuery(callback: (qb: QueryBuilder) => void, t?: Transaction): Bluebird<any[]> {
        return new this.dto().query(callback).destroy({
            transacting: t
        });
    }

    /**
     *
     * @returns {BlueBird<any>}
     */
    public truncate(): any {
        return new this.dto().query().truncate();
    }

    /**
     *
     * @param callback
     * @returns {BlueBird<any>}
     */
    public updateByQuery(callback: (qb: QueryBuilder) => void, data: any, t?: Transaction): Bluebird<T> {
        return new this.dto({}, false).query(callback).save(data, {
            method: "update",
            patch: true,
            require: false,
            transacting: t
        });
    }


    public list(related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<X[]> {
        return new this.dto().query((): void => {
        })
            .fetchAll({ withRelated: related })
            .then((objects) => {
                let ret: X[] = [];
                if (objects != null && objects.models != null && _.isArray(objects.models)) {
                    objects.models.forEach(object => {
                        let model = this.converter.fromDto(object, filters);
                        if (model != null) {
                            ret.push(model);
                        }
                    });
                }
                return ret;
            });
    }

    public findAll(ids: string[], related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<X[]> {
        let dto = new this.dto();
        return dto.query((q): void => {
            if (ids != null && ids.length > 0) {
                q.whereIn(dto.idAttribute, ids);
            }
            q.where(dto.isDelete, false);
        })
            .fetchAll({ withRelated: related })
            .then((objects) => {
                let ret: X[] = [];
                if (objects != null && objects.models != null && _.isArray(objects.models)) {
                    objects.models.forEach(object => {
                        let model = this.converter.fromDto(object, filters);
                        if (model != null) {
                            ret.push(model);
                        }
                    });
                }
                return ret;
            });
    }

    public findOne(id: string, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<X> {
        let ret: X = null;
        if (id == null || id === "") {
            return Bluebird.resolve(ret);
        }

        return this.findAll([id], related, filters)
            .then((objects) => {
                if (objects.length > 0) {
                    return objects[0];
                }
                return null;
            });
    }

    public countByQuery(callback: (qb: QueryBuilder) => void): Bluebird<number> {
        if (callback == null) {
            return Bluebird.resolve(0);
        }
        return new this.dto().query(callback).count()
            .then((total) => {
                return Number(total);
            });
    }

    public countDistinctByQuery(callback: (qb: QueryBuilder) => void): Bluebird<number> {
        if (callback == null) {
            return Bluebird.resolve(0);
        }
        return new this.dto().query(callback).fetch()
            .then(result => {
                return Number(result.get("count"));
            });
    }

    public countFetchByQuery(callback: (qb: QueryBuilder) => void): Bluebird<number> {
        if (callback == null) {
            return Bluebird.resolve(0);
        }
        return new this.dto().query(callback).fetchAll()
        .then(items => {
            return items.length;
        });
    }

    public findByQuery(callback: (qb: QueryBuilder) => void, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<X[]> {
        return new this.dto().query(callback).fetchAll({ withRelated: related })
            .then(items => {
                let ret: X[] = [];
                if (items != null && _.isArray(items.models))
                    items.models.forEach(item => {
                        let temp = this.converter.fromDto(item, filters);
                        if (temp != null) {
                            ret.push(temp);
                        }
                    });
                return ret;
            });
    }

    public findOneByQuery(callback: (qb: QueryBuilder) => void, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<X> {
        return new this.dto().query(callback).fetch({ withRelated: related })
            .then(item => {
                if (item != null) {
                    return this.converter.fromDto(item, filters);
                }
                return null;
            });
    }

    public countAndQuery(countQuery: (qb: QueryBuilder) => void, findQuery: (qb: QueryBuilder) => void, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<CollectionWrap<X>> {
        let ret = new CollectionWrap<X>();
        return this.countByQuery(countQuery)
            .then((total) => {
                ret.total = total;
                return this.findByQuery(findQuery, related, filters);
            })
            .then((objects) => {
                ret.data = objects;
                return ret;
            });
    }

    public raw(query: string): Raw {
        return BaseDto.knex().raw(query);
    }
}

export default BaseRepository;
