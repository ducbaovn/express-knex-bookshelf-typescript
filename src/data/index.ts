import DishRepo from "./dish.repository";
import OrderRepo from "./order.repository";
import OrderDishRepo from "./order_dish.repository";
import RoleRepo from "./role.repository";
import SessionRepo from "./session.repository";
import UserRepo from "./user.repository";

export const DishRepository = new DishRepo();
export const OrderRepository = new OrderRepo();
export const OrderDishRepository = new OrderDishRepo();
export const RoleRepository = new RoleRepo();
export const SessionRepository = new SessionRepo();
export const UserRepository = new UserRepo();