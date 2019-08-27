import { Configuration, Utils } from "../../libs";
import * as Bookshelf from "bookshelf";
import * as Knex from "knex";
import * as Bluebird from "bluebird";
const waitOn = require("wait-on");

export class Connection {
    private sql: any;
    private instance: Bookshelf;

    constructor(opts?: any) {
        opts = opts || {};
        let defaultConf: any = {
            host: "127.0.0.1",
            port: 5432,
            user: "root",
            password: "",
            database: "test",
            charset: "utf8mb4",
            timezone: "UTC",
        };
        let database: any = Configuration.database || { postgres: defaultConf };
        this.sql = database.postgres != null ? database.postgres : defaultConf;

        let knex: Knex = Knex({
            client: "postgresql",
            connection: this.sql,
            debug: this.sql.debug ? this.sql.debug : false,
        });

        this.instance = Bookshelf(knex);
    }

    public migration(): Bluebird<boolean> {
        console.info("Wait for database connection");

        let isComplete = false;
        return Utils.PromiseLoop(
            () => {
                return isComplete === true;
            },
            () => {
                return new Bluebird((resolve, reject) => {
                    waitOn({
                        resources: [`tcp:${this.sql.host}:${this.sql.port}`]
                    }, (err) => {
                        if (err != null) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }).then(() => {
                    return Bluebird.delay(1000);
                }).then(() => {
                    console.info("Perform database migration");
                    return this.instance.knex.migrate.latest({
                        directory: __dirname + "/migrations",
                    });
                }).then((info) => {
                    console.info("All migrations were success");
                    isComplete = true;
                }).catch((err) => {
                    console.info("All migrations were failed, try again");
                    console.error(err.message);
                    isComplete = false;
                });
            });
    }

    public bookshelf(): Bookshelf {
        return this.instance;
    }
}

export const Database = new Connection(Configuration.database);
export const Dto = Database.bookshelf();
export default Connection;
