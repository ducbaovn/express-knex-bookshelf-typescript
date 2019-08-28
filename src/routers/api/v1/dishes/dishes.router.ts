import { DishHandler } from "./dishes.handler";
import * as express from "express";
import { isAuthenticated, hasPrivilege } from "../../../../middlewares";
import { ROLE } from "../../../../libs/constants";

const router = express.Router();

router.route("/:id")
    .get(isAuthenticated, hasPrivilege([ROLE.ADMIN, ROLE.CHEF, ROLE.USER]), DishHandler.detail)
    .put(isAuthenticated, hasPrivilege([ROLE.ADMIN]), DishHandler.update)
    .delete(isAuthenticated, hasPrivilege([ROLE.ADMIN]), DishHandler.delete);

router.route("/")
    .get(isAuthenticated, hasPrivilege([ROLE.ADMIN, ROLE.CHEF, ROLE.USER]), DishHandler.list)
    .post(isAuthenticated, hasPrivilege([ROLE.ADMIN]), DishHandler.create);

export default router;
