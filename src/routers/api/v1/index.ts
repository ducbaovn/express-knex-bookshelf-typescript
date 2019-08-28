import * as express from "express";

import auth from "./auth/auth.router";
import profile from "./profile/profile.router";
import users from "./users/users.router";

const router = express.Router();

router.use("/auth", auth);
router.use("/profile", profile);
router.use("/users", users);

export default router;

