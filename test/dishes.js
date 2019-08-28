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

describe("Dishes", () => {
    let accessToken;
    let dishId;
    let description = "pho";
    let images = ["https://www.fodmapeveryday.com/wp-content/uploads/2017/06/Pho-closeup-copy.jpg"];
    let price = 4;
    let cookingMinutes = 3;
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
        });
    });

    it("List All Dishes", () => {
        return app
            .get("/api/v1/dishes")
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                expect(res2.body).to.be.an("array");
                res2.body.forEach(item => {
                    expect(item).to.have.property("id");
                    expect(item).to.have.property("description");
                    expect(item).to.have.property("images");
                    expect(item.images).to.be.an("array");
                    expect(item).to.have.property("price");
                    expect(item).to.have.property("cookingMinutes");
                });
            });
    });

    it("Create Dish", () => {
        return app
            .post("/api/v1/dishes")
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .send({
                description: description,
                images: images,
                price: price,
                cookingMinutes: cookingMinutes
            })
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                expect(res2.body).to.have.property("id");
                expect(res2.body).to.have.property("description");
                expect(res2.body).to.have.property("images");
                expect(res2.body.images).to.be.an("array");
                expect(res2.body).to.have.property("price");
                expect(res2.body).to.have.property("cookingMinutes");
                dishId = res2.body.id;
            });
    });

    it("Detail Dish", () => {
        return app
            .get("/api/v1/dishes/" + dishId)
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                expect(res2.body).to.have.property("id");
                expect(res2.body).to.have.property("description", description);
                expect(res2.body).to.have.property("images");
                expect(res2.body.images).to.be.an("array");
                expect(res2.body).to.have.property("price", price);
                expect(res2.body).to.have.property("cookingMinutes", cookingMinutes);
            });
    });

    it("Update Dish", () => {
        return app
            .put("/api/v1/dishes/" + dishId)
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .send({
                description: "pho bo"
            })
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                return app
                    .get("/api/v1/dishes/" + dishId)
                    .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
                    .then(res2 => {
                        expect(res2.type).to.eql("application/json");
                        expect(res2.status).to.eql(HttpStatus.OK);
                        expect(res2.body).to.have.property("description", "pho bo");
                        expect(res2.body).to.have.property("images");
                        expect(res2.body.images).to.be.an("array");
                        expect(res2.body).to.have.property("price", price);
                        expect(res2.body).to.have.property("cookingMinutes", cookingMinutes);
                    });
            });
    });

    it("Delete Dish", () => {
        return app
            .delete("/api/v1/dishes/" + dishId)
            .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
            .then(res2 => {
                expect(res2.type).to.eql("application/json");
                expect(res2.status).to.eql(HttpStatus.OK);
                return app
                    .get("/api/v1/dishes/" + dishId)
                    .set(constants.HEADERS.AUTHORIZATION, "Bearer " + accessToken)
                    .then(res2 => {
                        expect(res2.type).to.eql("application/json");
                        expect(res2.status).to.eql(HttpStatus.NO_CONTENT);
                    });
            });
    });
});
