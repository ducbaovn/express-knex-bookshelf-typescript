import * as Bluebird from "bluebird";
import * as Knex from "knex";
import * as Schema from "../schema";
import * as UUID from "uuid";
import * as bcrypt from "bcrypt";
import { ROLE } from "../../../libs/constants";

export const up = (knex: Knex, promise: typeof Bluebird) => {
    return promise.resolve()
    .then(() => {
        return knex.schema.createTable(Schema.USERS_TABLE_SCHEMA.TABLE_NAME, (table => {
            table.sring(Schema.USERS_TABLE_SCHEMA.FIELDS.ID, 36).notNullable().primary();
            table.boolean(Schema.USERS_TABLE_SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
            table.boolean(Schema.USERS_TABLE_SCHEMA.FIELDS.IS_ENABLE).notNullable().defaultTo(1);
            table.dateTime(Schema.USERS_TABLE_SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
            table.dateTime(Schema.USERS_TABLE_SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));
            table.string(Schema.USERS_TABLE_SCHEMA.FIELDS.USER_NAME, 255).notNullable().unique();
            table.string(Schema.USERS_TABLE_SCHEMA.FIELDS.PASSWORD, 255).notNullable();
        }));
    })
    .then(() => {
        return knex.schema.createTable(Schema.ROLES_TABLE_SCHEMA.TABLE_NAME, (table => {
            table.sring(Schema.ROLES_TABLE_SCHEMA.FIELDS.ID, 255).notNullable().primary();
            table.boolean(Schema.ROLES_TABLE_SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
            table.boolean(Schema.ROLES_TABLE_SCHEMA.FIELDS.IS_ENABLE).notNullable().defaultTo(1);
            table.dateTime(Schema.ROLES_TABLE_SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
            table.dateTime(Schema.ROLES_TABLE_SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));
            table.string(Schema.ROLES_TABLE_SCHEMA.FIELDS.DESCRIPTION, 255);
        }));
    })
    .then(() => {
        return knex.schema.createTable(Schema.SESSIONS_TABLE_SCHEMA.TABLE_NAME, (table => {
            table.sring(Schema.SESSIONS_TABLE_SCHEMA.FIELDS.ID, 36).notNullable().primary();
            table.boolean(Schema.SESSIONS_TABLE_SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
            table.boolean(Schema.SESSIONS_TABLE_SCHEMA.FIELDS.IS_ENABLE).notNullable().defaultTo(1);
            table.dateTime(Schema.SESSIONS_TABLE_SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
            table.dateTime(Schema.SESSIONS_TABLE_SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));
            table.string(Schema.SESSIONS_TABLE_SCHEMA.FIELDS.USER_ID, 36).notNullable().index()
                .references(Schema.USERS_TABLE_SCHEMA.FIELDS.ID)
                .inTable(Schema.USERS_TABLE_SCHEMA.TABLE_NAME)
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.string(Schema.SESSIONS_TABLE_SCHEMA.FIELDS.ROLE_ID, 255).notNullable().index()
                .references(Schema.ROLES_TABLE_SCHEMA.FIELDS.ID)
                .inTable(Schema.ROLES_TABLE_SCHEMA.TABLE_NAME)
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
        }));
    })
    .then(() => {
        let adminRole = {};
        adminRole[Schema.ROLES_TABLE_SCHEMA.FIELDS.ID] = ROLE.ADMIN;
        let userRole = {};
        userRole[Schema.ROLES_TABLE_SCHEMA.FIELDS.ID] = ROLE.USER;
        let chefRole = {};
        chefRole[Schema.ROLES_TABLE_SCHEMA.FIELDS.ID] = ROLE.CHEF;
        let admin = {};
        admin[Schema.USERS_TABLE_SCHEMA.FIELDS.ID] = UUID.v4();
        admin[Schema.USERS_TABLE_SCHEMA.FIELDS.USER_NAME] = "admin";
        admin[Schema.USERS_TABLE_SCHEMA.FIELDS.PASSWORD] = bcrypt.hashSync("123456", 10);
        let user = {};
        user[Schema.USERS_TABLE_SCHEMA.FIELDS.ID] = UUID.v4();
        user[Schema.USERS_TABLE_SCHEMA.FIELDS.USER_NAME] = "user1";
        user[Schema.USERS_TABLE_SCHEMA.FIELDS.PASSWORD] = bcrypt.hashSync("123456", 10);
        let chef = {};
        chef[Schema.USERS_TABLE_SCHEMA.FIELDS.ID] = UUID.v4();
        chef[Schema.USERS_TABLE_SCHEMA.FIELDS.USER_NAME] = "chef1";
        chef[Schema.USERS_TABLE_SCHEMA.FIELDS.PASSWORD] = bcrypt.hashSync("123456", 10);

        return Bluebird.all([
            // Inserts seed entries
            knex(Schema.ROLES_TABLE_SCHEMA.TABLE_NAME).insert(adminRole),
            knex(Schema.ROLES_TABLE_SCHEMA.TABLE_NAME).insert(userRole),
            knex(Schema.ROLES_TABLE_SCHEMA.TABLE_NAME).insert(chefRole),
            knex(Schema.USERS_TABLE_SCHEMA.TABLE_NAME).insert(admin),
            knex(Schema.USERS_TABLE_SCHEMA.TABLE_NAME).insert(user),
            knex(Schema.USERS_TABLE_SCHEMA.TABLE_NAME).insert(chef)
        ]);
    });
};

export const down = (knex: Knex, promise: typeof Bluebird) => {
    return promise.resolve()
    .then(() => {
        return knex.schema.dropTable(Schema.SESSIONS_TABLE_SCHEMA.TABLE_NAME);
    })
    .then(() => {
        return knex.schema.dropTable(Schema.USERS_TABLE_SCHEMA.TABLE_NAME);
    })
    .then(() => {
        return knex.schema.dropTable(Schema.USERS_TABLE_SCHEMA.TABLE_NAME);
    });
};