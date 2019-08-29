require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const Application = require("../build/app").default;
const libs = require("../build/libs");
const HttpStatus = libs.HttpStatus;
const ErrorCode = libs.ErrorCode;
const constants = require("../build/libs/constants");
chai.use(chaiHttp);
const expect = chai.expect;
const app = chai.request(new Application().getExpressInstance()).keepOpen();

describe("Authentication", () => {
    it("Register should be fail if exists username", () => {
        return app
            .post("/api/v1/auth/register")
            .send({
                userName: "user1",
                password: "123456"
            })
            .then(res => {
                expect(res.type).to.eql("application/json");
                expect(res.status).to.eql(HttpStatus.BAD_REQUEST);
                expect(res.body).to.have.property("code", ErrorCode.AUTHENTICATION.USER_EXIST.CODE);
                expect(res.body).to.have.property("message", ErrorCode.AUTHENTICATION.USER_EXIST.MESSAGE);
            });
    });
    it("Register, Get Profile", () => {
        return app
            .post("/api/v1/auth/register")
            .send({
                userName: "user2",
                password: "123456"
            })
            .then(res => {
                expect(res.type).to.eql("application/json");
                expect(res.status).to.eql(HttpStatus.OK);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("userId");
                expect(res.body).to.have.property("roleId");
                expect(res.body).to.have.property("token");
                expect(res.body).to.have.property("user");
                expect(res.body.user).to.not.have.property("password");
                expect(res.body.user).to.have.property("userName", "user2");
                expect(res.body.user).to.have.property("roleId", constants.ROLE.USER);
                return app
                    .get("/api/v1/profile")
                    .set(constants.HEADERS.AUTHORIZATION, "Bearer " + res.body.token)
                    .then(res2 => {
                        expect(res2.type).to.eql("application/json");
                        expect(res2.body).to.not.have.property("password");
                        expect(res2.body).to.have.property("userName", "user2");
                        expect(res2.body).to.have.property("roleId", constants.ROLE.USER);
                    });
            });
    });
    it("Login should be fail if wrong password", () => {
        return app
            .post("/api/v1/auth/login")
            .send({
                userName: "user2",
                password: "1234567"
            })
            .then(res => {
                expect(res.type).to.eql("application/json");
                expect(res.status).to.eql(HttpStatus.FORBIDDEN);
                expect(res.body).to.have.property("code", ErrorCode.AUTHENTICATION.AUTHENTICATION_FAIL.CODE);
                expect(res.body).to.have.property("message", ErrorCode.AUTHENTICATION.AUTHENTICATION_FAIL.MESSAGE);
            });
    });
    it("Login, Get Profile", () => {
        return app
            .post("/api/v1/auth/login")
            .send({
                userName: "user2",
                password: "123456"
            })
            .then(res => {
                expect(res.type).to.eql("application/json");
                expect(res.status).to.eql(HttpStatus.OK);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("userId");
                expect(res.body).to.have.property("roleId");
                expect(res.body).to.have.property("token");
                expect(res.body).to.have.property("user");
                expect(res.body.user).to.not.have.property("password");
                expect(res.body.user).to.have.property("userName", "user2");
                expect(res.body.user).to.have.property("roleId", constants.ROLE.USER);
                return app
                    .get("/api/v1/profile")
                    .set(constants.HEADERS.AUTHORIZATION, "Bearer " + res.body.token)
                    .then(res2 => {
                        expect(res2.type).to.eql("application/json");
                        expect(res2.status).to.eql(HttpStatus.OK);
                        expect(res2.body).to.not.have.property("password");
                        expect(res2.body).to.have.property("userName", "user2");
                        expect(res2.body).to.have.property("roleId", constants.ROLE.USER);
                    });
            });
    });
    it("Login, Refresh Token, Get Profile", () => {
        return app
            .post("/api/v1/auth/login")
            .send({
                userName: "user2",
                password: "123456"
            })
            .then(res => {
                expect(res.type).to.eql("application/json");
                expect(res.status).to.eql(HttpStatus.OK);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("userId");
                expect(res.body).to.have.property("roleId");
                expect(res.body).to.have.property("token");
                expect(res.body).to.have.property("user");
                expect(res.body.user).to.not.have.property("password");
                expect(res.body.user).to.have.property("userName", "user2");
                expect(res.body.user).to.have.property("roleId", constants.ROLE.USER);
                return app
                    .post("/api/v1/auth/refresh")
                    .send({
                        refreshToken: res.body.id,
                    })
                    .then(res2 => {
                        expect(res2.type).to.eql("application/json");
                        expect(res2.status).to.eql(HttpStatus.OK);
                        expect(res2.body).to.have.property("id");
                        expect(res2.body).to.have.property("userId");
                        expect(res2.body).to.have.property("roleId");
                        expect(res2.body).to.have.property("token");
                        expect(res2.body).to.have.property("user");
                        expect(res2.body.user).to.not.have.property("password");
                        expect(res2.body.user).to.have.property("userName", "user2");
                        expect(res2.body.user).to.have.property("roleId", constants.ROLE.USER);
                        expect(res2.body.id).to.eql(res.body.id);
                        expect(res2.body.token).to.not.eql(res.body.token);
                        return app
                            .get("/api/v1/profile")
                            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + res2.body.token)
                            .then(res3 => {
                                expect(res3.type).to.eql("application/json");
                                expect(res3.status).to.eql(HttpStatus.OK);
                                expect(res3.body).to.not.have.property("password");
                                expect(res3.body).to.have.property("userName", "user2");
                                expect(res3.body).to.have.property("roleId", constants.ROLE.USER);
                            });
                    });
            });
    });
    it("Login, Logout -> Refresh Token with old token will be fail", () => {
        return app
            .post("/api/v1/auth/login")
            .send({
                userName: "user2",
                password: "123456"
            })
            .then(res => {
                expect(res.type).to.eql("application/json");
                expect(res.status).to.eql(HttpStatus.OK);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("userId");
                expect(res.body).to.have.property("roleId");
                expect(res.body).to.have.property("token");
                expect(res.body).to.have.property("user");
                expect(res.body.user).to.not.have.property("password");
                expect(res.body.user).to.have.property("userName", "user2");
                expect(res.body.user).to.have.property("roleId", constants.ROLE.USER);
                return app
                    .post("/api/v1/auth/logout")
                    .send({
                        refreshToken: res.body.id,
                    })
                    .then(res2 => {
                        expect(res2.type).to.eql("application/json");
                        expect(res2.status).to.eql(HttpStatus.OK);
                        return app
                            .post("/api/v1/auth/refresh")
                            .send({
                                refreshToken: res.body.id,
                            })
                            .then(res3 => {
                                expect(res3.type).to.eql("application/json");
                                expect(res3.status).to.eql(HttpStatus.FORBIDDEN);
                                expect(res3.body).to.have.property("code", ErrorCode.AUTHENTICATION.AUTHENTICATION_FAIL.CODE);
                                expect(res3.body).to.have.property("message", ErrorCode.AUTHENTICATION.AUTHENTICATION_FAIL.MESSAGE);
                            });
                    });
            });
    });
});
