import * as express from "express";
import * as Bluebird from "bluebird";
import { ErrorCode } from "../libs";

interface OnError {
    (meta: number): any;
}

interface OnCheckWhiteList {
    (path: string, method: string): boolean;
}

interface OnVerify {
    (token: string, deviceId: string): Bluebird<any>;
}

export const authenticate = (onError?: OnError, onCheck?: OnCheckWhiteList, onVerify?: OnVerify): express.RequestHandler => {
    const TRAGEDY_KEY = "Bearer";
    const AUTH_HEADER = "authorization";
    const DEVICE_HEADER = "device-id";

    let errorCallback = onError != null ? onError : (meta: number): any => {
        return new Error(meta.toString());
    };

    let checkUrlCallback = onCheck != null ? onCheck : (path: string, method: string): boolean => {
        return false;
    };

    let verifyCallback = onVerify != null ? onVerify : (token: string, deviceId: string): Bluebird<any> => {
            return Bluebird.resolve(true);
        };

    return (req: express.Request, res: express.Response, next: express.NextFunction): any => {
        return Bluebird.resolve()
            .then(() => {
                let token: string;

                if (req.header(AUTH_HEADER) != null) {
                    let parts = req.header(AUTH_HEADER).split(" ");
                    if (parts.length === 2 && parts[0] === TRAGEDY_KEY) {
                        token = parts[1];
                    }
                }
                return token;
            })
            .then(token => {
                if ((token == null || token === "") && checkUrlCallback(req.baseUrl, req.method)) {
                    throw errorCallback(ErrorCode.AUTHENTICATION.INVALID_AUTHORIZATION_HEADER.CODE);
                }
                return verifyCallback(token, req.header(DEVICE_HEADER));
            })
            .then((object) => {
                if (object != null && object.jwt != null && object.jwt.payload != null) {
                    res.locals.session = object.jwt.payload;
                    next();
                } else {
                    next(errorCallback(ErrorCode.AUTHENTICATION.AUTHENTICATION_FAIL.CODE));
                }
                return true;
            })
            .catch(error => {
                next(errorCallback(error));
            });
    };
};

export default authenticate;
