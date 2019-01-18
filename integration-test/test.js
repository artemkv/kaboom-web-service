"use strict";

const SERVICE_URL = `http://${process.env.NODE_IP || 'localhost'}:${process.env.NODE_PORT || 8700}`;

let chai = require('chai'); 
let expect = chai.expect;
let request = require('request');

describe('[REST Api Test Suite]', function () {

    it(':( Try accessing root', function (done) {
        request.get(SERVICE_URL, function (error, response, body) {
            expect(response.statusCode).to.equal(401);

            let expectedError = {
                error: "Unauthorized"
            };
            let actual = JSON.parse(body);
            expect(actual).to.deep.equal(expectedError);

            done();
        });
    });
    
    it(':( Try accessing non-existing page', function (done) {
        request.get(`${SERVICE_URL}/xxx`, function (error, response, body) {
            expect(response.statusCode).to.equal(401);

            let expectedError = {
                error: "Unauthorized"
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
});