"use strict";

const statusCodes = require('@artemkv/statuscodes');

const handleHealthCheck = function handleHealthCheck(req, res, next) {
    res.statusCode = statusCodes.OK;
    res.end();
}

exports.handleHealthCheck = handleHealthCheck;