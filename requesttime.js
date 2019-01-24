"use strict";

const requestTime = function (req, res, next) {
    req.requestTime = new Date();
    return next();
}

module.exports = requestTime;