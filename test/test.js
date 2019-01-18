"use strict";

const chai = require('chai');
const expect = chai.expect;
const Readable = require('stream').Readable;

it(':) TODO', function (done) {
    done();

/*    let req = new Readable();
    req.push('');
    req.push(null);

    req.method = 'POST';
    req.headers = {
        'content-type': 'application/json'
    };

    let res = {
        end: verify
    };

    let counter = kafkaConnector.allCallData.counter;

    function verify(err) {
        if (err) {
            return done(err);
        }

        try {
            expect(res.statusCode).to.equal(200);

            expect(kafkaConnector.allCallData.counter).to.equal(counter + 1);
            expect(kafkaConnector.lastCallData.topicName).to.equal('launch_event');
            expect(kafkaConnector.lastCallData.key).to.equal('9735965b-e1cb-4d7f-adb9-a4adf457f61a');
            let actualEvent = JSON.parse(kafkaConnector.lastCallData.message);
            expect(actualEvent.t).to.equal('S');
            expect(actualEvent.a).to.equal('9735965b-e1cb-4d7f-adb9-a4adf457f61a');
            expect(actualEvent.u).to.equal('User001');
            expect(actualEvent.dt).to.equal('2018-12-19T16:36:02.632+01');
            expect(actualEvent.dts).not.be.null;
        } catch (err) {
            return done(err);
        }

        return done();
    }

    eventController.postEvent(req, res, verify);*/
});