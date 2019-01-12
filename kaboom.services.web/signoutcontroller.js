"use strict";

const statusCodes = require('@artemkv/statuscodes');
const statusMessages = require('@artemkv/statusmessages');
const RestError = require('@artemkv/resterror');
const restStats = require('@artemkv/reststats');

const post = function post(req, res, next) {
    // TODO: this is for debug
    if (req.method === 'OPTIONS') {
        res.statusCode = statusCodes.OK;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.end();
        return;
    }

    if (req.method !== 'POST') {
        throw new RestError(statusCodes.MethodNotAllowed, statusMessages.MethodNotAllowed);
    }

    // Kill the session
    req.session = null;

    res.statusCode = statusCodes.OK;
    // TODO: this is for debug
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.end();

    restStats.countRequestByEndpoint("signout");
    restStats.updateResponseStats(req, res);
}

exports.post = post;