"use strict";

const statusCodes = require('@artemkv/statuscodes');
const statusMessages = require('@artemkv/statusmessages');
const RestError = require('@artemkv/resterror');
const restStats = require('@artemkv/reststats');

const getCrash = function getCrash(req, res, next) {
    if (req.method !== 'GET') {
        throw new RestError(statusCodes.MethodNotAllowed, statusMessages.MethodNotAllowed);
    }

    console.log("Accessing stats as " + req.my.userId);

    let crashId = req.my.query.id;
    if (crashId) {
        if (typeof crashId !== 'string') {
            throw new RestError(statusCodes.BadRequest, statusMessages.BadRequest);
        }
    } else {
        throw new RestError(statusCodes.BadRequest, statusMessages.BadRequest);
    }

    // TODO: Get the real data
    let response = JSON.stringify({
        id: crashId,
        message: "NullReference...",
        counter: 3,
        details: "amF2YS5sYW5nLklsbGVnYWxTdGF0..."
    });

    res.statusCode = statusCodes.OK;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ALLOW_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.write(response);
    res.end();

    restStats.countRequestByEndpoint("crash");
    restStats.updateResponseStats(req, res);
}

exports.getCrash = getCrash;