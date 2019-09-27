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

describe("Template", () => {
    it("Ping", () => {
        return app
            .get("/api/v1/template/ping")
            .then(res => {
                expect(res.type).to.eql("application/json");
                expect(res.status).to.eql(HttpStatus.OK);
            });
    });
});
