import { BaseModel } from "./";
import Redis from "../data/redis/redis";

export class OrderDishQueue extends BaseModel {
    public key: string;
    constructor() {
        super();
        this.key = Redis.getOrderDishQueueKey();
    }
    public enqueue(orderDishId: string): boolean {
        return Redis.getClient().rpush(this.key, orderDishId);
    }
    public dequeue(): any  {
        return Redis.getClient().lpop(this.key);
    }
}
