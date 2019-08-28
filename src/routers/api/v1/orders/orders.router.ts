import { OrderHandler } from "./orders.handler";
import * as express from "express";
import { isAuthenticated, hasPrivilege } from "../../../../middlewares";
import { ROLE } from "../../../../libs/constants";

const router = express.Router();

router.route("/:id")
    .get(isAuthenticated, hasPrivilege([ROLE.ADMIN, ROLE.USER]), OrderHandler.detail)
    .delete(isAuthenticated, hasPrivilege([ROLE.ADMIN]), OrderHandler.delete);

router.route("/")
    .get(isAuthenticated, hasPrivilege([ROLE.ADMIN, ROLE.USER]), OrderHandler.list)
    .post(isAuthenticated, hasPrivilege([ROLE.USER]), OrderHandler.create);

export default router;
