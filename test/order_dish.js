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

describe("Order Dish", () => {
    let accessToken;
    let orderDishId;
    before(() => {
        // runs before all tests in this block
        return app
        .post("/api/v1/auth/login")
        .send({
            userName: "chef1",
            password: "123456"
        })
        .then(res => {
            expect(res.type).to.eql("application/json");
            expect(res.status).to.eql(HttpStatus.OK);
            accessToken = res.body.token;
        });
    });

    it("Dequeue Order Dish 1st", () => {
        return app
            .get("/api/v1/order-dish/dequeue")
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                expect(res2.body).to.have.property("id");
                expect(res2.body).to.have.property("dishId");
                expect(res2.body).to.have.property("quantity");
                expect(res2.body).to.have.property("status", constants.ORDER_DISH_STATUS.NEW);
                orderDishId = res2.body.id;
            });
    });

    it("Set Status Order Dish to served", () => {
        return app
            .put("/api/v1/order-dish/status")
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .send({
                id: orderDishId,
                status: constants.ORDER_DISH_STATUS.SERVED
            })
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                expect(res2.body).to.have.property("id", orderDishId);
                expect(res2.body).to.have.property("status", constants.ORDER_DISH_STATUS.SERVED);
            });
    });

    it("Dequeue Order Dish 2nd", () => {
        return app
            .get("/api/v1/order-dish/dequeue")
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                expect(res2.body).to.have.property("id");
                expect(res2.body).to.have.property("dishId");
                expect(res2.body).to.have.property("quantity");
                expect(res2.body).to.have.property("status", constants.ORDER_DISH_STATUS.NEW);
            });
    });

    it("Dequeue Order Dish 3rd", () => {
        return app
            .get("/api/v1/order-dish/dequeue")
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                expect(res2.body).to.have.property("id");
                expect(res2.body).to.have.property("dishId");
                expect(res2.body).to.have.property("quantity");
                expect(res2.body).to.have.property("status", constants.ORDER_DISH_STATUS.NEW);
            });
    });

    it("Dequeue Order Dish 4th will be fail", () => {
        return app
            .get("/api/v1/order-dish/dequeue")
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.BAD_REQUEST);
                expect(res2.body).to.have.property("code", ErrorCode.RESOURCE.ORDER_DISH_QUEUE_EMPTY.CODE);
                expect(res2.body).to.have.property("message", ErrorCode.RESOURCE.ORDER_DISH_QUEUE_EMPTY.MESSAGE);
            });
    });
});
