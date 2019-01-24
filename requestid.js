"use strict";

const uuid = require('uuid/v4');

const requestId = function (req, res, next) {
    req.requestId = uuid();
    return next();
}

module.exports = requestId;