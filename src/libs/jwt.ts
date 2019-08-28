import * as jwt from "jsonwebtoken";
import { SessionModel } from "../models";

export interface BearerObject {
    payload: any;
    exp: number;
    iat: number;
    iss: string;
    aud: string;
    token?: string;
}

export class JsonWebToken {
    public readonly DEFAULT_ISSUER = "Food Ordering";
    public readonly DEFAULT_CLIENT = "simulator";
    public readonly DEFAULT_EXPIRE = 15 * 60 * 1000; // 15 minutes
    private password: string;
    private issuer: string;
    private defaultExpireTime: number;
    private defaultClient: string;

    constructor(opts?: any) {
        opts = opts != null ? opts : {};
        this.password = opts.password != null && opts.password !== "" ? opts.password : this.DEFAULT_ISSUER;
        this.issuer = opts.issuer != null && opts.issuer !== "" ? opts.issuer : this.DEFAULT_ISSUER;
        this.defaultClient = opts.defaultClient != null && opts.defaultClient !== "" ? opts.defaultClient : this.DEFAULT_CLIENT;
        this.defaultExpireTime = opts.defaultExpireTime != null && opts.defaultExpireTime !== "" ? opts.defaultExpireTime : this.DEFAULT_EXPIRE; // 1 year
    }

    public encode(payload: SessionModel, expire?: number, client = this.defaultClient): string {
        if (payload != null) {
            delete payload.user.password;
            let current = Date.now();
            let expiredTime;
            if (expire != null && expire > 0) {
                expiredTime = current + expire;
            } else {
                expiredTime = current + this.defaultExpireTime;
            }
            return jwt.sign({
                // Payload part
                payload,
                // Standard
                exp: expiredTime,
                iat: current,
                iss: this.issuer,
                aud: client,
            }, this.password);
        }
        return null;
    }

    public decode(token: string): BearerObject {
        return jwt.decode(token);
    }

    public verify(token: string, client = this.defaultClient): boolean {
        return jwt.verify(token, this.password, {
            audience: client,
            issuer: this.issuer,
        });
    }
}

export default JsonWebToken;
