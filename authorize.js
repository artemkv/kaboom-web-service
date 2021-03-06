"use strict";

const statusCodes = require('@artemkv/statuscodes');
const statusMessages = require('@artemkv/statusmessages');
const RestError = require('@artemkv/resterror');

const authorize = function authorize(req, res, next) {
    if (!req.my.userId) {
        throw new RestError(statusCodes.Unauthorized, statusMessages.Unauthorized);
    }

    // TODO: verify that user has the right access level

    return next();
};

module.exports = authorize;