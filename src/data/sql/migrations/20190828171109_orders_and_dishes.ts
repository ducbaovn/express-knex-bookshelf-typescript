import * as Bluebird from "bluebird";
import * as Knex from "knex";
import * as Schema from "../schema";
import * as UUID from "uuid";
import { ORDER_DISH_STATUS } from "../../../libs/constants";

export const up = (knex: Knex, promise: typeof Bluebird) => {
    return promise.resolve()
    .then(() => {
        return knex.schema.createTable(Schema.ORDERS_TABLE_SCHEMA.TABLE_NAME, (table => {
            table.string(Schema.ORDERS_TABLE_SCHEMA.FIELDS.ID, 255).notNullable().primary();
            table.boolean(Schema.ORDERS_TABLE_SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
            table.boolean(Schema.ORDERS_TABLE_SCHEMA.FIELDS.IS_ENABLE).notNullable().defaultTo(1);
            table.dateTime(Schema.ORDERS_TABLE_SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
            table.dateTime(Schema.ORDERS_TABLE_SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));
            table.string(Schema.ORDERS_TABLE_SCHEMA.FIELDS.USER_ID, 36).notNullable().index()
                .references(Schema.USERS_TABLE_SCHEMA.FIELDS.ID)
                .inTable(Schema.USERS_TABLE_SCHEMA.TABLE_NAME)
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.text(Schema.ORDERS_TABLE_SCHEMA.FIELDS.NOTES);
            table.specificType(Schema.ORDERS_TABLE_SCHEMA.FIELDS.TOTAL_AMOUNT, "numeric(8,2)").notNullable();
        }));
    })
    .then(() => {
        return knex.schema.createTable(Schema.DISHES_TABLE_SCHEMA.TABLE_NAME, (table => {
            table.string(Schema.DISHES_TABLE_SCHEMA.FIELDS.ID, 36).notNullable().primary();
            table.boolean(Schema.DISHES_TABLE_SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
            table.boolean(Schema.DISHES_TABLE_SCHEMA.FIELDS.IS_ENABLE).notNullable().defaultTo(1);
            table.dateTime(Schema.DISHES_TABLE_SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
            table.dateTime(Schema.DISHES_TABLE_SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));
            table.text(Schema.DISHES_TABLE_SCHEMA.FIELDS.DESCRIPTION);
            table.specificType(Schema.DISHES_TABLE_SCHEMA.FIELDS.IMAGES, "text[]").notNullable();
            table.specificType(Schema.DISHES_TABLE_SCHEMA.FIELDS.PRICE, "numeric(8,2)").notNullable();
            table.integer(Schema.DISHES_TABLE_SCHEMA.FIELDS.COOKING_MINUTES, "numeric(8,2)").notNullable();
        }));
    })
    .then(() => {
        return knex.schema.createTable(Schema.ORDER_DISH_TABLE_SCHEMA.TABLE_NAME, (table => {
            table.string(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.ID, 36).notNullable().primary();
            table.boolean(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.IS_DELETED).notNullable().defaultTo(0);
            table.boolean(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.IS_ENABLE).notNullable().defaultTo(1);
            table.dateTime(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.CREATED_DATE).defaultTo(knex.raw("current_timestamp"));
            table.dateTime(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.UPDATED_DATE).defaultTo(knex.raw("current_timestamp"));
            table.string(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.ORDER_ID, 36).notNullable().index()
                .references(Schema.ORDERS_TABLE_SCHEMA.FIELDS.ID)
                .inTable(Schema.ORDERS_TABLE_SCHEMA.TABLE_NAME)
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.string(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.DISH_ID, 36).notNullable().index()
                .references(Schema.DISHES_TABLE_SCHEMA.FIELDS.ID)
                .inTable(Schema.DISHES_TABLE_SCHEMA.TABLE_NAME)
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.string(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.STATUS, 255).notNullable().defaultTo(ORDER_DISH_STATUS.NEW);
            table.integer(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.QUANTITY).notNullable().defaultTo(1);
            table.specificType(Schema.ORDERS_TABLE_SCHEMA.FIELDS.TOTAL_AMOUNT, "numeric(8,2)").notNullable();
            table.integer(Schema.ORDER_DISH_TABLE_SCHEMA.FIELDS.SERVED_BY, 36).notNullable().index()
                .references(Schema.USERS_TABLE_SCHEMA.FIELDS.ID)
                .inTable(Schema.USERS_TABLE_SCHEMA.TABLE_NAME)
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
        }));
    })
    .then(() => {
        let pizzaS = {};
        pizzaS[Schema.DISHES_TABLE_SCHEMA.FIELDS.ID] = UUID.v4();
        pizzaS[Schema.DISHES_TABLE_SCHEMA.FIELDS.DESCRIPTION] = "pizza size S";
        pizzaS[Schema.DISHES_TABLE_SCHEMA.FIELDS.IMAGES] = ["https://cdn.apartmenttherapy.info/image/fetch/f_auto,q_auto:eco,c_fit,w_1460/https%3A%2F%2Fstorage.googleapis.com%2Fgen-atmedia%2F3%2F2018%2F03%2Fd2adab64f31b724e2e15f300e8ae83b24d8e46ef.jpeg"];
        pizzaS[Schema.DISHES_TABLE_SCHEMA.FIELDS.PRICE] = 13;
        pizzaS[Schema.DISHES_TABLE_SCHEMA.FIELDS.COOKING_MINUTES] = 14;

        let pizzaM = {};
        pizzaM[Schema.DISHES_TABLE_SCHEMA.FIELDS.ID] = UUID.v4();
        pizzaM[Schema.DISHES_TABLE_SCHEMA.FIELDS.DESCRIPTION] = "pizza size M";
        pizzaM[Schema.DISHES_TABLE_SCHEMA.FIELDS.IMAGES] = ["https://cdn.apartmenttherapy.info/image/fetch/f_auto,q_auto:eco,c_fit,w_1460/https%3A%2F%2Fstorage.googleapis.com%2Fgen-atmedia%2F3%2F2018%2F03%2Fd2adab64f31b724e2e15f300e8ae83b24d8e46ef.jpeg"];
        pizzaM[Schema.DISHES_TABLE_SCHEMA.FIELDS.PRICE] = 17;
        pizzaM[Schema.DISHES_TABLE_SCHEMA.FIELDS.COOKING_MINUTES] = 15;

        let pizzaL = {};
        pizzaL[Schema.DISHES_TABLE_SCHEMA.FIELDS.ID] = UUID.v4();
        pizzaL[Schema.DISHES_TABLE_SCHEMA.FIELDS.DESCRIPTION] = "pizza size L";
        pizzaL[Schema.DISHES_TABLE_SCHEMA.FIELDS.IMAGES] = ["https://cdn.apartmenttherapy.info/image/fetch/f_auto,q_auto:eco,c_fit,w_1460/https%3A%2F%2Fstorage.googleapis.com%2Fgen-atmedia%2F3%2F2018%2F03%2Fd2adab64f31b724e2e15f300e8ae83b24d8e46ef.jpeg"];
        pizzaL[Schema.DISHES_TABLE_SCHEMA.FIELDS.PRICE] = 20;
        pizzaL[Schema.DISHES_TABLE_SCHEMA.FIELDS.COOKING_MINUTES] = 16;

        let spaghettiS = {};
        spaghettiS[Schema.DISHES_TABLE_SCHEMA.FIELDS.ID] = UUID.v4();
        spaghettiS[Schema.DISHES_TABLE_SCHEMA.FIELDS.DESCRIPTION] = "spaghetti size S";
        spaghettiS[Schema.DISHES_TABLE_SCHEMA.FIELDS.IMAGES] = ["https://www.spendwithpennies.com/wp-content/uploads/2019/03/Spaghetti-and-Meatballs-SpendWithPennies-4.jpg"];
        spaghettiS[Schema.DISHES_TABLE_SCHEMA.FIELDS.PRICE] = 9;
        spaghettiS[Schema.DISHES_TABLE_SCHEMA.FIELDS.COOKING_MINUTES] = 6;

        let spaghettiM = {};
        spaghettiM[Schema.DISHES_TABLE_SCHEMA.FIELDS.ID] = UUID.v4();
        spaghettiM[Schema.DISHES_TABLE_SCHEMA.FIELDS.DESCRIPTION] = "spaghettiM";
        spaghettiM[Schema.DISHES_TABLE_SCHEMA.FIELDS.IMAGES] = ["https://www.spendwithpennies.com/wp-content/uploads/2019/03/Spaghetti-and-Meatballs-SpendWithPennies-4.jpg"];
        spaghettiM[Schema.DISHES_TABLE_SCHEMA.FIELDS.PRICE] = 11;
        spaghettiM[Schema.DISHES_TABLE_SCHEMA.FIELDS.COOKING_MINUTES] = 6;

        let spaghettiL = {};
        spaghettiL[Schema.DISHES_TABLE_SCHEMA.FIELDS.ID] = UUID.v4();
        spaghettiL[Schema.DISHES_TABLE_SCHEMA.FIELDS.DESCRIPTION] = "spaghettiL";
        spaghettiL[Schema.DISHES_TABLE_SCHEMA.FIELDS.IMAGES] = ["https://www.spendwithpennies.com/wp-content/uploads/2019/03/Spaghetti-and-Meatballs-SpendWithPennies-4.jpg"];
        spaghettiL[Schema.DISHES_TABLE_SCHEMA.FIELDS.PRICE] = 13;
        spaghettiL[Schema.DISHES_TABLE_SCHEMA.FIELDS.COOKING_MINUTES] = 7;

        let hamburgerS = {};
        hamburgerS[Schema.DISHES_TABLE_SCHEMA.FIELDS.ID] = UUID.v4();
        hamburgerS[Schema.DISHES_TABLE_SCHEMA.FIELDS.DESCRIPTION] = "hamburgerS";
        hamburgerS[Schema.DISHES_TABLE_SCHEMA.FIELDS.IMAGES] = ["https://www.recipetineats.com/wp-content/uploads/2016/02/Beef-Hamburgers_7-2.jpg"];
        hamburgerS[Schema.DISHES_TABLE_SCHEMA.FIELDS.PRICE] = 6.5;
        hamburgerS[Schema.DISHES_TABLE_SCHEMA.FIELDS.COOKING_MINUTES] = 3;

        let hamburgerM = {};
        hamburgerM[Schema.DISHES_TABLE_SCHEMA.FIELDS.ID] = UUID.v4();
        hamburgerM[Schema.DISHES_TABLE_SCHEMA.FIELDS.DESCRIPTION] = "hamburgerM";
        hamburgerM[Schema.DISHES_TABLE_SCHEMA.FIELDS.IMAGES] = ["https://www.recipetineats.com/wp-content/uploads/2016/02/Beef-Hamburgers_7-2.jpg"];
        hamburgerM[Schema.DISHES_TABLE_SCHEMA.FIELDS.PRICE] = 7.5;
        hamburgerM[Schema.DISHES_TABLE_SCHEMA.FIELDS.COOKING_MINUTES] = 3;

        let hamburgerL = {};
        hamburgerL[Schema.DISHES_TABLE_SCHEMA.FIELDS.ID] = UUID.v4();
        hamburgerL[Schema.DISHES_TABLE_SCHEMA.FIELDS.DESCRIPTION] = "hamburgerL";
        hamburgerL[Schema.DISHES_TABLE_SCHEMA.FIELDS.IMAGES] = ["https://www.recipetineats.com/wp-content/uploads/2016/02/Beef-Hamburgers_7-2.jpg"];
        hamburgerL[Schema.DISHES_TABLE_SCHEMA.FIELDS.PRICE] = 9;
        hamburgerL[Schema.DISHES_TABLE_SCHEMA.FIELDS.COOKING_MINUTES] = 3;


        return Bluebird.all([
            // Inserts seed entries
            knex(Schema.DISHES_TABLE_SCHEMA.TABLE_NAME).insert(pizzaS),
            knex(Schema.DISHES_TABLE_SCHEMA.TABLE_NAME).insert(pizzaM),
            knex(Schema.DISHES_TABLE_SCHEMA.TABLE_NAME).insert(pizzaL),
            knex(Schema.DISHES_TABLE_SCHEMA.TABLE_NAME).insert(spaghettiS),
            knex(Schema.DISHES_TABLE_SCHEMA.TABLE_NAME).insert(spaghettiM),
            knex(Schema.DISHES_TABLE_SCHEMA.TABLE_NAME).insert(spaghettiL),
            knex(Schema.DISHES_TABLE_SCHEMA.TABLE_NAME).insert(hamburgerS),
            knex(Schema.DISHES_TABLE_SCHEMA.TABLE_NAME).insert(hamburgerM),
            knex(Schema.DISHES_TABLE_SCHEMA.TABLE_NAME).insert(hamburgerL)
        ]);
    });
};

export const down = (knex: Knex, promise: typeof Bluebird) => {
    return promise.resolve()
    .then(() => {
        return knex.schema.dropTable(Schema.DISHES_TABLE_SCHEMA.TABLE_NAME);
    })
    .then(() => {
        return knex.schema.dropTable(Schema.ORDERS_TABLE_SCHEMA.TABLE_NAME);
    })
    .then(() => {
        return knex.schema.dropTable(Schema.ORDER_DISH_TABLE_SCHEMA.TABLE_NAME);
    });
};