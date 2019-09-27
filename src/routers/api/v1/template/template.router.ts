import { TemplateHandler } from "./template.handler";
import * as express from "express";

const router = express.Router();

router.route("/ping")
    .get(TemplateHandler.ping);

export default router;
