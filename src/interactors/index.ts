import DishSv from "./dish.service";
import OrderSv from "./order.service";
import OrderDishSv from "./order_dish.service";
import SessionSv from "./session.service";
import UserSv from "./user.service";

export const DishService = new DishSv();
export const OrderService = new OrderSv();
export const OrderDishService = new OrderDishSv();
export const SessionService = new SessionSv();
export const UserService = new UserSv();