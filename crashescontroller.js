"use strict";

const statusCodes = require('@artemkv/statuscodes');
const statusMessages = require('@artemkv/statusmessages');
const RestError = require('@artemkv/resterror');
const restStats = require('@artemkv/reststats');
const data = require('./dataprovider').getData();

const getCrashes = function getCrashes(req, res, next) {
    if (req.method !== 'GET') {
        throw new RestError(statusCodes.MethodNotAllowed, statusMessages.MethodNotAllowed);
    }

    let appCode = req.my.query.appcode;
    if (appCode) {
        if (typeof appCode !== 'string') {
            throw new RestError(statusCodes.BadRequest, statusMessages.BadRequest);
        }
    } else {
        throw new RestError(statusCodes.BadRequest, statusMessages.BadRequest);
    }

    let origin = req.headers['origin'];

    data.getAppCrashes(req.my.userId, appCode)
        .then(function returnCrashes(crashes) {
            let crashesDto = crashes.map(x => {
                return {
                    id: x._id.toString(),
                    message: x.message,
                    count: x.count
                }
            });

            let response = JSON.stringify(crashesDto);
            res.statusCode = statusCodes.OK;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Cache-Control', 'no-store');
            res.setHeader('Access-Control-Allow-Origin', origin || 'http://localhost');
            res.setHeader('Access-Control-Allow-Methods', 'GET');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.write(response);
            res.end();

            restStats.countRequestByEndpoint("crashes");
            restStats.updateResponseStats(req, res);
        })
        .catch(function (err) {
            next(err);
        });
}

exports.getCrashes = getCrashes;