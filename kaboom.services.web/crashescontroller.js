"use strict";

const statusCodes = require('@artemkv/statuscodes');
const statusMessages = require('@artemkv/statusmessages');
const RestError = require('@artemkv/resterror');
const restStats = require('@artemkv/reststats');
const userService = require('./userservice');

const getCrashes = function (req, res, next) {
    if (req.method !== 'GET') {
        throw new RestError(statusCodes.MethodNotAllowed, statusMessages.MethodNotAllowed);
    }
    // TODO: move this validation up
    if (!req.session.id_token) {
        throw new RestError(statusCodes.Unauthorized, statusMessages.Unauthorized);
    }

    userService.convertTokenToUserId(req.session.id_token)
        .then(
            function (userId) {
                console.log("Accessing stats as " + userId);

                // TODO: Validate that user exists in the database (on the upper layer)

                // TODO: Get the real data
                let response = JSON.stringify({
                    crashes: [
                        {
                            id: 427348768723,
                            message: "NullReference...",
                            counter: 3
                        },
                        {
                            id: 398475983443,
                            message: "IllegalArgument...",
                            counter: 1
                        }
                    ]
                });

                res.statusCode = statusCodes.OK;
                res.setHeader("Content-Type", "application/json; charset=utf-8");
                res.setHeader('Cache-Control', 'no-store');
                // TODO: this is for debug
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', '*');
                res.write(response);
                res.end();

                restStats.countRequestByEndpoint("crashes");
                restStats.updateResponseStats(req, res);
            }
        )
        .catch(function (err) {
            next(err);
        });
}

exports.getCrashes = getCrashes;