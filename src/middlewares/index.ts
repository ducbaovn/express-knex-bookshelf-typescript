import * as Bluebird from "bluebird";
import * as express from "express";
import { ExceptionModel } from "../models";
import { ErrorCode, HttpStatus, Jwt } from "../libs";
import { BearerObject } from "../libs/jwt";
import authenticate from "./authentication";

export * from "./cors";
export * from "./logger";
export * from "./not_found";
export * from "./recover";

export const isAuthenticated = authenticate(
    (meta: number): any => {
        let error: ExceptionModel = null;
        switch (meta) {
            case ErrorCode.AUTHENTICATION.AUTHENTICATION_FAIL.CODE:
                error = new ExceptionModel(
                    ErrorCode.AUTHENTICATION.AUTHENTICATION_FAIL.CODE,
                    ErrorCode.AUTHENTICATION.AUTHENTICATION_FAIL.MESSAGE,
                    false,
                    HttpStatus.UNAUTHORIZED
                );
                break;
            case ErrorCode.AUTHENTICATION.INVALID_AUTHORIZATION_HEADER.CODE:
                error = new ExceptionModel(
                    ErrorCode.AUTHENTICATION.INVALID_AUTHORIZATION_HEADER.CODE,
                    ErrorCode.AUTHENTICATION.INVALID_AUTHORIZATION_HEADER.MESSAGE,
                    false,
                    HttpStatus.UNAUTHORIZED
                );
                break;
            default:
                error = new ExceptionModel(
                    ErrorCode.AUTHENTICATION.GENERIC.CODE,
                    ErrorCode.AUTHENTICATION.GENERIC.MESSAGE,
                    false,
                    HttpStatus.UNAUTHORIZED
                );
        }
        return error;
    },
    (path: string, method: string): boolean => {
        return false;
    },
    (token: string, deviceId: string): Bluebird<any> => {
        let jwtObject: BearerObject = null;
        return Bluebird.resolve()
            .then(() => {
                jwtObject = Jwt.decode(token);
                let current: number = Date.now();
                if (current < jwtObject.exp && Jwt.verify(token, deviceId)) {
                    return {
                        jwt: jwtObject,
                    };
                } else {
                    throw ErrorCode.AUTHENTICATION.AUTHENTICATION_FAIL.CODE;
                }
            });
    }
);