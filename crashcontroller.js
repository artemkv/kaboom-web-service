"use strict";

const statusCodes = require('@artemkv/statuscodes');
const statusMessages = require('@artemkv/statusmessages');
const RestError = require('@artemkv/resterror');
const restStats = require('@artemkv/reststats');
const data = require('./data');

const getCrash = function getCrash(req, res, next) {
    if (req.method !== 'GET') {
        throw new RestError(statusCodes.MethodNotAllowed, statusMessages.MethodNotAllowed);
    }

    let crashId = req.my.query.id;
    if (crashId) {
        if (typeof crashId !== 'string') {
            throw new RestError(statusCodes.BadRequest, statusMessages.BadRequest);
        }
    } else {
        throw new RestError(statusCodes.BadRequest, statusMessages.BadRequest);
    }

    data.getAppCrash(crashId)
        .then(function returnCrash(crash) {
            let crashDto = {
                id: crash._id.toString(),
                message: crash.message,
                count: crash.count,
                details: crash.details
            };

            let response = JSON.stringify(crashDto);
            res.statusCode = statusCodes.OK;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ALLOW_ORIGIN);
            res.setHeader('Access-Control-Allow-Methods', 'GET');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.write(response);
            res.end();

            restStats.countRequestByEndpoint("crash");
            restStats.updateResponseStats(req, res);
        })
        .catch(function (err) {
            next(err);
        });
}

exports.getCrash = getCrash;