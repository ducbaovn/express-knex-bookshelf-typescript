import * as express from "express";
import * as Bluebird from "bluebird";

export class TemplateHandler {

    public static ping(req: express.Request, res: express.Response, next: express.NextFunction): Bluebird<void> {
        return Bluebird.resolve()
        .then(() => {
            res.send("ping");
        })
        .catch(next);
    }

}

export default TemplateHandler;

