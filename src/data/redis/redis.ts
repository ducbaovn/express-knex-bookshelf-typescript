import * as Bluebird from "bluebird";
import { ClientOpts, RedisClient } from "redis";
import * as _ from "lodash";
import { Configuration, Utils } from "../../libs";
const waitOn = require("wait-on");
const RedisLib = require("redis");
Bluebird.promisifyAll(RedisLib.Multi.prototype);
Bluebird.promisifyAll(RedisLib.RedisClient.prototype);

declare module "redis" {
    export interface Multi extends NodeJS.EventEmitter {
        constructor();
        execAsync(...args: any[]): Bluebird<any>;
    }
    export interface RedisClient extends NodeJS.EventEmitter {
        decrAsync(...args: any[]): Bluebird<any>;
        delAsync(...args: any[]): Bluebird<any>;
        execAsync(...args: any[]): Bluebird<any>;
        getAsync(...args: any[]): Bluebird<any>;
        incrAsync(...args: any[]): Bluebird<any>;
        expireAsync(...args: any[]): Bluebird<any>;
        keysAsync(...args: any[]): Bluebird<any>;
        saddAsync(...args: any[]): Bluebird<any>;
        scardAsync(...args: any[]): Bluebird<any>;
        sdiffAsync(...args: any[]): Bluebird<any>;
        sdiffstoreAsync(...args: any[]): Bluebird<any>;
        selectAsync(...args: any[]): Bluebird<any>;
        setAsync(...args: any[]): Bluebird<any>;
        sinterAsync(...args: any[]): Bluebird<any>;
        sismemberAsync(...args: any[]): Bluebird<any>;
        smembersAsync(...args: any[]): Bluebird<any>;
        smoveAsync(...args: any[]): Bluebird<any>;
        spopAsync(...args: any[]): Bluebird<any>;
        srandmemeberAsync(...args: any[]): Bluebird<any>;
        sremAsync(...args: any[]): Bluebird<any>;
        sscanAsync(...args: any[]): Bluebird<any>;
        sunionAsync(...args: any[]): Bluebird<any>;
        sunionstoreAsync(...args: any[]): Bluebird<any>;
    }
}

interface RedisOpts extends ClientOpts {
    prefix: string;
}


export class RedisConnection {
    private opts: RedisOpts;
    private client: RedisClient;
    public prefix: string;
    public db: string;

    constructor(opts?: any) {
        opts = opts || {};
        let defaultOpts: RedisOpts = {
            host: "127.0.0.1",
            port: 6379,
            password: "whatPass?",
            db: "1",
            prefix: process.env.NODE_ENV + ":foodordering:",
        };

        this.opts = _.defaultsDeep(opts, defaultOpts) as RedisOpts;
        this.prefix = this.opts.prefix;
        this.db = this.opts.db;
    }

    public initWithWaiting(): Bluebird<boolean> {
        console.info("Wait for redis connection");

        let isComplete = false;
        return Utils.PromiseLoop(
            () => {
                return isComplete === true;
            },
            () => {
                return new Bluebird((resolve, reject) => {
                    waitOn({
                        resources: [`tcp:${this.opts.host}:${this.opts.port}`]
                    }, (err) => {
                        if (err != null) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }).then(() => {
                    this.client = Bluebird.promisifyAll(RedisLib.createClient(this.opts)) as RedisClient;
                    console.info("Redis connection is OK");
                    isComplete = true;
                }).catch((err) => {
                    console.info("Connect to redis failed, try again");
                    console.error(err.message);
                    isComplete = false;
                });
            });
    }

    public getClient(): RedisClient {
        return this.client;
    }

    private createKey(...params: string[]): string {
        return params.filter(val => val != null && val !== "").join(":");
    }
}

export const Redis = new RedisConnection(Configuration.database != null ? Configuration.database.redis : null);
export default Redis;
