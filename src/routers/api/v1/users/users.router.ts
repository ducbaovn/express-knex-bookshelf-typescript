import { UserHandler } from "./users.handler";
import * as express from "express";
import { isAuthenticated, hasPrivilege } from "../../../../middlewares";
import { ROLE } from "../../../../libs/constants";

const router = express.Router();

router.route("/:id")
    .get(isAuthenticated, hasPrivilege([ROLE.ADMIN]), UserHandler.detail)
    .put(isAuthenticated, hasPrivilege([ROLE.ADMIN]), UserHandler.update)
    .delete(isAuthenticated, hasPrivilege([ROLE.ADMIN]), UserHandler.delete);

router.route("/")
    .get(isAuthenticated, hasPrivilege([ROLE.ADMIN]), UserHandler.list)
    .post(isAuthenticated, hasPrivilege([ROLE.ADMIN]), UserHandler.create);

export default router;
