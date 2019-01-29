"use strict";

const SERVICE_URL = `http://${process.env.NODE_IP || 'localhost'}:${process.env.NODE_PORT || 8700}`;

let chai = require('chai');
let expect = chai.expect;
let request = require('request');

describe('[REST Api Test Suite]', function () {
    it(':) Health check', function (done) {
        request.get(`${SERVICE_URL}/health`, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it(':( Try accessing root', function (done) {
        request.get(SERVICE_URL, function (error, response, body) {
            expect(response.statusCode).to.equal(404);

            let expectedError = {
                error: "Not Found"
            };
            let actual = JSON.parse(body);
            expect(actual).to.deep.equal(expectedError);

            done();
        });
    });

    it(':( Try accessing non-existing page', function (done) {
        request.get(`${SERVICE_URL}/xxx`, function (error, response, body) {
            expect(response.statusCode).to.equal(404);

            let expectedError = {
                error: "Not Found"
            };
            let actual = JSON.parse(body);
            expect(actual).to.deep.equal(expectedError);

            done();
        });
    });

    it(':( Handle error', function (done) {
        request.get(`${SERVICE_URL}/error`, function (error, response, body) {
            expect(response.statusCode).to.equal(500);

            let expectedError = {
                error: "Test error"
            };
            let actual = JSON.parse(body);
            expect(actual).to.deep.equal(expectedError);

            done();
        });
    });

    it(':( Handle REST error', function (done) {
        request.get(`${SERVICE_URL}/resterror`, function (error, response, body) {
            expect(response.statusCode).to.equal(501);

            let expectedError = {
                error: "Not Implemented"
            };
            let actual = JSON.parse(body);
            expect(actual).to.deep.equal(expectedError);

            done();
        });
    });

    it(':( Signin without id_token', function (done) {
        let options = {
            url: `${SERVICE_URL}/signin`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: null
        };
        request.post(options, function (error, response, body) {
            expect(response.statusCode).to.equal(401);
            done();
        });
    });

    it(':( Signin with invalid id_token', function (done) {
        let token = {
            "id_token": "Bad token"
        };
        let options = {
            url: `${SERVICE_URL}/signin`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: Buffer.from(JSON.stringify(token))
        };
        request.post(options, function (error, response, body) {
            expect(response.statusCode).to.equal(401);
            done();
        });
    });

    it(':( Signin with expired id_token', function (done) {
        let token = {
            "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjA4ZDMyNDVjNjJmODZiNjM2MmFmY2JiZmZlMWQwNjk4MjZkZDFkYzEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTAxMjczOTc2MjI1Mi1hZ3RoYmUyZThkZjU4cGowOHE0cnBjZWpzOG5ka3E3ZS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjEwMTI3Mzk3NjIyNTItYWd0aGJlMmU4ZGY1OHBqMDhxNHJwY2VqczhuZGtxN2UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDAxMDAwMTYzMzY1NjA5NDEzMTAiLCJlbWFpbCI6ImFydGVta3ZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJSS0RSc3pXb3hsc05JTWpUTnVRUndBIiwibmFtZSI6IkFydGVtIEtvbmRyYXR5ZXYiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1iMllsdVRqN18wdy9BQUFBQUFBQUFBSS9BQUFBQUFBQUlhVS9lM0hrSDlTOUFuQS9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiQXJ0ZW0iLCJmYW1pbHlfbmFtZSI6IktvbmRyYXR5ZXYiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTU0NzkxNTY5OCwiZXhwIjoxNTQ3OTE5Mjk4LCJqdGkiOiIwMmVjYWE1MmI5ODZlNzVkODdmMDA5NzM1MGY5NzU3YjVkZjYyYTMwIn0.Wuas6q6Rh5yWjs-7lME6Wd_y_xLFrcPg9NSPht-KTwzluh28uZj7kHj4Ru5kcivvXjR9pOIjz9YY_bt-Skw1rtH-HNBfQLEJcPVfrpFnb8JNAV0-UllNKtqNF0rfLUeZItky-sDdCHUha3nPE54xZEnp2zYKQpMXKifY_PU_6TaC-6ZI21pasULQxTAcDiK-UFZlp0lyyWReaC1YWqkuE_NjKAzm4YLTGKwrl9jD-8B429NehZMhzwUsSRn4mIBvHPaLHhMmCuLI_od3tKS_c4FeiehqEe6VrpWqZZRRK9WH2C1gWMB75VR8anZ4hAs2OVrEkHaoJV6szDD6ss3Egg"
        };
        let options = {
            url: `${SERVICE_URL}/signin`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: Buffer.from(JSON.stringify(token))
        };
        request.post(options, function (error, response, body) {
            expect(response.statusCode).to.equal(401);
            done();
        });
    });

    it(':( Access crashes without appcode', function (done) {
        let options = {
            url: `${SERVICE_URL}/crashes`,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        request.get(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it(':( Access crash details without params', function (done) {
        let options = {
            url: `${SERVICE_URL}/crash`,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        request.get(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it(':( Access crash details without appcode', function (done) {
        let options = {
            url: `${SERVICE_URL}/crash?id=34534`,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        request.get(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it(':( Access crash details without id', function (done) {
        let options = {
            url: `${SERVICE_URL}/crash?appcode=34534`,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        request.get(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it(':( Access crashstats without params', function (done) {
        let options = {
            url: `${SERVICE_URL}/crashstats`,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        request.get(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it(':( Access crashstats without appcode', function (done) {
        let options = {
            url: `${SERVICE_URL}/crashstats?period=month&dt=201901`,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        request.get(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it(':( Access crashstats without period', function (done) {
        let options = {
            url: `${SERVICE_URL}/crashstats?appcode=34534&dt=201901`,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        request.get(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it(':( Access crashstats without dt', function (done) {
        let options = {
            url: `${SERVICE_URL}/crashstats?period=month&appcode=34534`,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        request.get(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it(':( Access uniqueuserstats without params', function (done) {
        let options = {
            url: `${SERVICE_URL}/uniqueuserstats`,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        request.get(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it(':( Access uniqueuserstats without appcode', function (done) {
        let options = {
            url: `${SERVICE_URL}/uniqueuserstats?period=month&dt=201901`,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        request.get(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it(':( Access uniqueuserstats without period', function (done) {
        let options = {
            url: `${SERVICE_URL}/uniqueuserstats?appcode=34534&dt=201901`,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        request.get(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it(':( Access uniqueuserstats without dt', function (done) {
        let options = {
            url: `${SERVICE_URL}/uniqueuserstats?period=month&appcode=34534`,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        request.get(options, function (error, response, body) {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });
});