"use strict";

const chai = require('chai');
const expect = chai.expect;
const Readable = require('stream').Readable;
const crashesController = require('../crashescontroller');

it(':) Get crashes', function (done) {
    let req = {};
    req.method = 'GET';
    req.headers = {
        'content-type': 'application/json'
    };
    req.my = {
        userId: '243245',
        query: {
            appcode: '12345'
        }
    };

    let headers = {};
    let result = {};
    let res = {
        end: verify,
        setHeader: function (key, value) {
            headers[key] = value;
        },
        write: function write(x) {
            result = JSON.parse(x);
        }
    };

    function verify(err) {
        if (err) {
            return done(err);
        }

        expect(res.statusCode).to.equal(200);

        expect(headers['Content-Type']).to.equal('application/json; charset=utf-8');
        expect(headers['Cache-Control']).to.equal('no-store');

        expect(result[0].id).to.equal('5c3d26eb7a2b614415e84498');
        expect(result[0].message).to.equal('Hello Exception1');
        expect(result[0].count).to.equal(25);
        expect(result[0]._id).to.be.undefined;
        expect(result[0].appId).to.be.undefined;
        expect(result[0].hash).to.be.undefined;
        expect(result[0].dt).to.be.undefined;
        expect(result[0].details).to.be.undefined;

        expect(result[1].id).to.equal('5c3d26eb7a2b614415e84499');
        expect(result[1].message).to.equal('Hello Exception2');
        expect(result[1].count).to.equal(30);
        expect(result[1]._id).to.be.undefined;
        expect(result[1].appId).to.be.undefined;
        expect(result[1].hash).to.be.undefined;
        expect(result[1].dt).to.be.undefined;
        expect(result[1].details).to.be.undefined;

        return done();
    }

    crashesController.getCrashes(req, res, verify);
});