import { Dto } from "./connection";
import * as UUID from "uuid";

export class BaseDto<T> extends Dto.Model<any> {

    public static knex() {
        return Dto.knex;
    }

    private static generateUuid(model: any): void {
        if (model.isNew()) {
            model.set(model.idAttribute, UUID.v4());
        }
    }

    constructor(attributes?: any, isNew?: boolean) {
        super(attributes);
        if (isNew != null) {
            this.isNew = () => {
                return isNew;
            };
        }
    }

    // noinspection JSMethodCanBeStatic
    get idAttribute(): string {
        return "id";
    }

    get isDelete(): string {
        return "is_deleted";
    }

    get hasTimestamps(): string[] {
        return ["created_date", "updated_date"];
    }

    public initialize(): void {
        this.on("saving", BaseDto.generateUuid);
    }
}