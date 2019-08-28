import * as express from "express";

import auth from "./auth/auth.router";
import dishes from "./dishes/dishes.router";
import orders from "./orders/orders.router";
import orderDish from "./order_dish/order_dish.router";
import profile from "./profile/profile.router";
import users from "./users/users.router";

const router = express.Router();

router.use("/auth", auth);
router.use("/dishes", dishes);
router.use("/orders", orders);
router.use("/order-dish", orderDish);
router.use("/profile", profile);
router.use("/users", users);

export default router;

