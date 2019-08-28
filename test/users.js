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

describe("Users", () => {
    let accessToken;
    let userId;
    let chef2Id;
    before(() => {
        // runs before all tests in this block
        return app
        .post("/api/v1/auth/login")
        .send({
            userName: "admin",
            password: "123456"
        })
        .then(res => {
            expect(res.type).to.eql("application/json");
            expect(res.status).to.eql(HttpStatus.OK);
            accessToken = res.body.token;
            refreshToken = res.body.id;
            userId = res.body.userId;
        });
    });

    it("List All Users", () => {
        return app
            .get("/api/v1/users")
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                expect(res2.body).to.be.an("array");
                res2.body.forEach(item => {
                    expect(item).to.have.property("userName");
                    expect(item).to.have.property("roleId");
                });
            });
    });

    it("List Admin Users", () => {
        return app
            .get("/api/v1/users")
            .query({
                roleId: constants.ROLE.ADMIN
            })
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                expect(res2.body).to.be.an("array");
                res2.body.forEach(item => {
                    expect(item).to.have.property("userName");
                    expect(item).to.have.property("roleId", constants.ROLE.ADMIN);
                });
            });
    });

    it("List Chef Users", () => {
        return app
            .get("/api/v1/users")
            .query({
                roleId: constants.ROLE.CHEF
            })
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                expect(res2.body).to.be.an("array");
                res2.body.forEach(item => {
                    expect(item).to.have.property("userName");
                    expect(item).to.have.property("roleId", constants.ROLE.CHEF);
                });
            });
    });

    it("Detail User", () => {
        return app
            .get("/api/v1/users/" + userId)
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                expect(res2.body).to.have.property("userName");
                expect(res2.body).to.have.property("roleId");
            });
    });

    it("Create Admin Users", () => {
        return app
            .post("/api/v1/users")
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .send({
                userName: "admin2",
                password: "123456",
                roleId: constants.ROLE.ADMIN
            })
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                expect(res2.body).to.have.property("userName", "admin2");
                expect(res2.body).to.have.property("roleId", constants.ROLE.ADMIN);
            });
    });

    it("Create Chef Users", () => {
        return app
            .post("/api/v1/users")
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .send({
                userName: "chef2",
                password: "123456",
                roleId: constants.ROLE.CHEF
            })
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                expect(res2.body).to.have.property("userName", "chef2");
                expect(res2.body).to.have.property("roleId", constants.ROLE.CHEF);
                chef2Id = res2.body.id;
            });
    });

    it("Update chef2 userName fail if userName exist", () => {
        return app
            .put("/api/v1/users/" + chef2Id)
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

    it("Update chef2 Password", () => {
    return app
        .put("/api/v1/users/" + chef2Id)
        .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
        .send({
            password: "1234567",
        })
        .then(res2 => {
            expect(res2.type).to.eql("application/json");
            expect(res2.status).to.eql(HttpStatus.OK);
        });
    });
});
