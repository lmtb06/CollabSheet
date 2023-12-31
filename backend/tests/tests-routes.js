const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);
chai.should();

describe("Tests routes API", () => {
    describe("GET /api/route", () => {
        it("devrait obtenir une réponse", (done) => {
            chai.request(server)
                .get('/api/register')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});
