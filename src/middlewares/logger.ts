import * as express from "express";
import { ExceptionModel } from "../models";

interface LogHandler {
    error(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    info(message: string, meta?: any): void;
}

export const httpLogger = (logger?: LogHandler): express.RequestHandler => {
    let Logger: LogHandler = logger || {
        error: (message: string, meta?: any): void => console.error(message),
        warn: (message: string, meta?: any): void => console.warn(message),
        info: (message: string, meta?: any): void => console.log(message),
    };

    return (req: express.Request, res: any, next: express.NextFunction) => {
        req["_startTime"] = Date.now();
        // Capture end function in Request object to calculate information
        let endFunc = res.end;
        res.end = (chunk: any, encoding: any) => {
            res.responseTime = Date.now() - req["_startTime"];
            res.end = endFunc;
            res.end(chunk, encoding);
            req.url = req.originalUrl || req.url;

            let format = `${req.ip} ${req.method} ${req.url} ${res.responseTime}ms ${chunk ? chunk.length : 0}bytes ${res.statusCode} ${res.statusMessage}`;
            let meta = {
                ip: req.ip,
                method: req.method,
                path: req.path ? req.path : "",
                time: res.responseTime,
                size: chunk ? chunk.length : 0,
                statusCode: res.statusCode,
                headers: req.headers,
                body: req.body,
            };
            switch (true) {
                case (req.path === "/ping"):
                    break;
                case (res.statusCode < 200):
                    Logger.warn(format, meta);
                    break;
                case (res.statusCode > 199 && res.statusCode < 300):
                    Logger.info(format, meta);
                    break;
                case (res.statusCode > 299 && res.statusCode < 500):
                    Logger.warn(format, meta);
                    break;
                default:
                    Logger.error(format, meta);
            }

            endFunc = null;
        };
        next();
    };
};

export const httpError = (logger?: any): express.ErrorRequestHandler => {
    let Logger = logger || {
        error: (message: string, meta?: any): void => console.error(message),
        warn: (message: string, meta?: any): void => console.warn(message),
        info: (message: string, meta?: any): void => console.log(message),
    };

    return (error: any, req: express.Request, res: express.Response, next: express.NextFunction): any => {
        if (error instanceof ExceptionModel) {
            Logger.warn(error.message, error);
        } else {
            Logger.error(error.message, error);
        }
        next(error);
    };
};
