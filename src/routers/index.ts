import * as express from "express";
import api from "./api/v1";

const router = express.Router();

router.get("/ping", (req, res, next) => {
    res.end();
});

router.use("/api/v1", api);

export default router;
