import { ProfileHandler } from "./profile.handler";
import * as express from "express";
import { isAuthenticated, hasPrivilege } from "../../../../middlewares";
import { ROLE } from "../../../../libs/constants";

const router = express.Router();

router.route("/")
    .get(isAuthenticated, hasPrivilege([ROLE.ADMIN, ROLE.USER, ROLE.CHEF]), ProfileHandler.detail)
    .put(isAuthenticated, hasPrivilege([ROLE.ADMIN, ROLE.USER, ROLE.CHEF]), ProfileHandler.update);

export default router;
