import * as express from "express";

import template from "./template/template.router";

const router = express.Router();

router.use("/template", template);

export default router;

