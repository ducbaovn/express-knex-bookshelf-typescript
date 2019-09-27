import * as express from "express";

export const cors = (): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): any => {
        res.header("Connection", "close");
        res.header("Content-Type", "application/json; charset=utf-8");
        // restrict it to the required domain
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,PATCH,DELETE");
        // Set custom headers for CORS
        res.header("Access-Control-Allow-Headers", "Content-Type, Accept, Pragma, If-Modified-Since, Cache-Control, Authorization, device-os, app-version, password");
        res.header("Access-Control-Expose-Headers", "Total, Offset, Limit");

        if (req.method === "OPTIONS") {
            res.status(200).end();
        } else {
            next();
        }
    };
};

export default cors;
