import { OrderDishHandler } from "./order_dish.handler";
import * as express from "express";
import { isAuthenticated, hasPrivilege } from "../../../../middlewares";
import { ROLE } from "../../../../libs/constants";

const router = express.Router();

router.route("/status")
    .put(isAuthenticated, hasPrivilege([ROLE.CHEF]), OrderDishHandler.udpateStatus);

router.route("/dequeue")
    .get(isAuthenticated, hasPrivilege([ROLE.CHEF]), OrderDishHandler.dequeue);

export default router;
