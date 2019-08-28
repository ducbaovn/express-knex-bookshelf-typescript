import * as Bluebird from "bluebird";
import { BaseModel } from "./";
import Redis from "../data/redis/redis";

export class OrderDishQueue extends BaseModel {
    public key: string;
    constructor() {
        super();
        this.key = Redis.getOrderDishQueueKey();
    }
    public enqueue(orderDishId: string): Bluebird<boolean> {
        return Redis.getClient().rpushAsync(this.key, orderDishId);
    }
    public dequeue(): Bluebird<string>  {
        return Redis.getClient().lpopAsync(this.key);
    }
}
