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

describe("Profile", () => {
    let accessToken;
    let refreshToken;
    before(() => {
        // runs before all tests in this block
        return app
        .post("/api/v1/auth/login")
        .send({
            userName: "user1",
            password: "123456"
        })
        .then(res => {
            expect(res.type).to.eql("application/json");
            expect(res.status).to.eql(HttpStatus.OK);
            accessToken = res.body.token;
            refreshToken = res.body.id;
        });
    });

    it("Get Profile", () => {
        return app
            .get("/api/v1/profile")
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                expect(res2.body).to.not.have.property("password");
                expect(res2.body).to.have.property("userName", "user1");
                expect(res2.body).to.have.property("roleId", constants.ROLE.USER);
            });
    });
    it("Update Profile userName fail if userName exist", () => {
        return app
            .put("/api/v1/profile")
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .send({
                userName: "chef1",
            })
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.BAD_REQUEST);
                expect(res2.body).to.have.property("code", ErrorCode.AUTHENTICATION.USER_EXIST.CODE);
                expect(res2.body).to.have.property("message", ErrorCode.AUTHENTICATION.USER_EXIST.MESSAGE);
            });
    });
    it("Update Password, Refresh Token with old refresh token will be fail", () => {
    return app
        .put("/api/v1/profile")
        .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
        .send({
            password: "1234567",
        })
        .then(res2 => {
            expect(res2.type).to.eql("application/json");
            expect(res2.status).to.eql(HttpStatus.OK);
            return app
                .post("/api/v1/auth/refresh")
                .send({
                    refreshToken: refreshToken,
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
