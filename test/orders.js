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

describe("Orders", () => {
    let items;
    let totalAmount = 0;
    let accessToken;
    let orderId;
    let userId;
    let orderDishId;
    before(() => {
        // runs before all tests in this block
        return app
        .post("/api/v1/auth/login")
        .send({
            userName: "user1",
            password: "1234567"
        })
        .then(res => {
            expect(res.type).to.eql("application/json");
            expect(res.status).to.eql(HttpStatus.OK);
            accessToken = res.body.token;
            userId = res.body.userId;
            return app
            .get("/api/v1/dishes")
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .then(res => {
                expect(res.type).to.eql("application/json");
                expect(res.status).to.eql(HttpStatus.OK);
                items = [
                    {
                        dishId: res.body[0].id,
                        price: res.body[0].price,
                        quantity: 3
                    },
                    {
                        dishId: res.body[3].id,
                        price: res.body[3].price,
                        quantity: 1
                    },
                    {
                        dishId: res.body[1].id,
                        price: res.body[1].price,
                        quantity: 6
                    }
                ];
                items.forEach(item => {
                    totalAmount += item.price * item.quantity;
                });
            })
        });
    });

    it("Create Order", () => {
        return app
            .post("/api/v1/orders")
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .send({
                items: items
            })
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                expect(res2.body).to.have.property("id");
                expect(res2.body).to.have.property("userId", userId);
                expect(res2.body).to.have.property("totalAmount", totalAmount);
                expect(res2.body).to.have.property("items");
                expect(res2.body.items).to.be.an("array");
                orderId = res2.body.id;
            });
    });

    it("Detail Order", () => {
        return app
            .get("/api/v1/orders/" + orderId)
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                expect(res2.body).to.have.property("id", orderId);
                expect(res2.body).to.have.property("userId", userId);
                expect(res2.body).to.have.property("totalAmount", totalAmount);
                expect(res2.body).to.have.property("items");
                expect(res2.body.items).to.be.an("array");
            });
    });

    // it("Delete Order", () => {
    //     return app
    //         .post("/api/v1/auth/login")
    //         .send({
    //             userName: "admin",
    //             password: "123456"
    //         })
    //         .then(res => {
    //             expect(res.type).to.eql("application/json");
    //             expect(res.status).to.eql(HttpStatus.OK);
    //             return app
    //                 .delete("/api/v1/orders/" + orderId)
    //                 .set(constants.HEADERS.AUTHORIZATION, "Bearer " + res.body.token)
    //                 .then(res2 => {
    //                     expect(res2.type).to.eql("application/json");
    //                     expect(res2.status).to.eql(HttpStatus.OK);
    //                     return app
    //                         .get("/api/v1/orders/" + orderId)
    //                         .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
    //                         .then(res2 => {
    //                             expect(res2.type).to.eql("application/json");
    //                             expect(res2.status).to.eql(HttpStatus.NO_CONTENT);
    //                         });
    //                 });
    //         });
    // });
});
