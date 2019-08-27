import * as express from "express";
import { ExceptionModel } from "../models";
import { ErrorCode } from "../libs";

export const notFound = (): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): any => {
        next(new ExceptionModel(
            ErrorCode.RESOURCE.INVALID_URL.CODE,
            ErrorCode.RESOURCE.INVALID_URL.MESSAGE,
            false,
            404,
        ));
    };
};

export default notFound;
