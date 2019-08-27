import * as express from "express";
import * as helmet from "helmet";
import * as http from "http";
import * as Bluebird from "bluebird";
import Router from "./routers";
import { Database } from "./data/sql/connection";
import { Redis } from "./data/redis/redis";
import { cors, httpLogger, httpError, notFound, recover } from "./middlewares";
import { json, urlencoded } from "body-parser";

export class Application {
    private opts: any;
    private app: express.Express;
    private bind: number;
    private server: http.Server;

    constructor(opts?: any) {
        this.opts = opts !== null ? { ...opts } : {};
        this.app = express();
        this.app.locals.title = "iCondo";
        this.app.enable("case sensitive routing");
        this.app.enable("trust proxy");
        this.app.disable("x-powered-by");
        this.app.disable("etag");

        this.app.use(json());
        this.app.use(urlencoded({ extended: false }));
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(httpLogger());
        this.app.use("/", Router);
        this.app.use(notFound());
        this.app.use(httpError());
        this.app.use(recover());
        process.on("unhandledRejection", (reason: any): void => {
            console.error("unhandledRejection: " + reason);
        });
        process.on("uncaughtException", (err: Error): void => {
            console.error(err.message, err);
            // Note: When this happen, the process should be terminated
            // process.exit(1);
        });
    }

    public listen(port) {
        console.info("Wait for others components become available");
        Bluebird.all([
            Database.migration(),
            Redis.initWithWaiting()
        ])
        .then(() => {
            if (port != null) {
                let portNumber = parseInt(port, 10);
                this.bind = isNaN(portNumber) ? port : portNumber;
            } else {
                this.bind = 3000;
            }
            this.app.set("port", this.bind);
            this.server = http.createServer(this.app);
            this.server.on("error", this.onError.bind(this));
            this.server.on("listening", this.onListening.bind(this));
            this.server.listen(this.bind);
        }).catch(err => {
            console.error(err.message, err);
        });
    }

    public getExpressInstance(): express.Express {
        return this.app;
    }

    private onListening() {
        let addr = this.server.address();
        let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
        console.info("Listening on " + bind);
    }

    private onError(error: any) {
        if (error.syscall !== "listen") {
            throw error;
        }

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case "EACCES":
                console.error(this.bind + " requires elevated privileges");
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(this.bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
}

export default Application;
