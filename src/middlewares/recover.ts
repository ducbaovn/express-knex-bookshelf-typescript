import * as express from "express";
import { ErrorCode, HttpStatus } from "../libs";
import { ExceptionModel } from "../models";

export const recover = (): express.ErrorRequestHandler => {
    let fallback = (error: any, res: express.Response): void => {
        res.status(500);
        res.end();
    };

    return (error: any, req: express.Request, res: express.Response, next: express.NextFunction): any => {
        if (!(error instanceof ExceptionModel)) {
            error = new ExceptionModel(
                ErrorCode.SYSTEM.GENERIC.CODE,
                ErrorCode.SYSTEM.GENERIC.MESSAGE,
                false,
                HttpStatus.BAD_GATEWAY
            );
        }
        res.status(error.httpStatus);
        res.json(error);
        if (!res.finished) {
            fallback(error, res);
        }
    };
};

export default recover;
