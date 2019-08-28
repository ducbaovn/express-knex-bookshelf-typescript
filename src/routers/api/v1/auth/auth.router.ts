import { AuthHandler } from "./auth.handler";
import * as express from "express";

const router = express.Router();

router.route("/login")
    .post(AuthHandler.login);

router.route("/register")
    .post(AuthHandler.register);

router.route("/refresh")
    .post(AuthHandler.refreshToken);

export default router;
