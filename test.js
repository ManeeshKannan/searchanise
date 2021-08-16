const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("./app");

const should = chai.should();
chai.use(chaiHttp);

describe("/GET product", () => {
    it("it should GET a messag", (done) => {
        chai
            .request(server)
            .get("/api/dev/v1/product")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("products");
                done();
            });
    });
});