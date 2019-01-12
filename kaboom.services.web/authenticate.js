"use strict";

const statusCodes = require('@artemkv/statuscodes');
const statusMessages = require('@artemkv/statusmessages');
const RestError = require('@artemkv/resterror');
const userService = require('./userservice');

const authenticate = function authenticate(req, res, next) {
    if (!req.session.id_token) {
        throw new RestError(statusCodes.Unauthorized, statusMessages.Unauthorized);
    }

    userService.convertTokenToUserId(req.session.id_token)
        .then(function (userId) {
            req.my.userId = userId;
            return next();
        }).catch(function (err) {
            console.log(err); // TODO: log somewhere else
            // Any error while validating the token is considered unauthorized access
            next(new RestError(statusCodes.Unauthorized, statusMessages.Unauthorized));
        });
};

module.exports = authenticate;