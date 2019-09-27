import * as Bluebird from "bluebird";
import * as Knex from "knex";
import * as Schema from "../schema";
import * as UUID from "uuid";

export const up = (knex: Knex, promise: typeof Bluebird) => {
    return promise.resolve()
    .then(() => {
        return knex.schema.createTable(Schema.TEMPLATES_TABLE_SCHEMA.TABLE_NAME, (table => {
            table.string(Schema.TEMPLATES_TABLE_SCHEMA.FIELDS.ID, 255).notNullable().primary();
            table.boolean(Schema.TEMPLATES_TABLE_SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
            table.boolean(Schema.TEMPLATES_TABLE_SCHEMA.FIELDS.IS_ENABLE).notNullable().defaultTo(1);
            table.dateTime(Schema.TEMPLATES_TABLE_SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
            table.dateTime(Schema.TEMPLATES_TABLE_SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));
        }));
    })
    .then(() => {
        let template = {};
        template[Schema.TEMPLATES_TABLE_SCHEMA.FIELDS.ID] = UUID.v4();
        return Bluebird.all([
            // Inserts seed entries
            knex(Schema.TEMPLATES_TABLE_SCHEMA.TABLE_NAME).insert(template)
        ]);
    });
};

export const down = (knex: Knex, promise: typeof Bluebird) => {
    return promise.resolve()
    .then(() => {
        return knex.schema.dropTable(Schema.TEMPLATES_TABLE_SCHEMA.TABLE_NAME);
    });
};