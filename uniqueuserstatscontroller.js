"use strict";

const statusCodes = require('@artemkv/statuscodes');
const statusMessages = require('@artemkv/statusmessages');
const RestError = require('@artemkv/resterror');
const restStats = require('@artemkv/reststats');
const data = require('./data');

const getUniqueUserStats = function getUniqueUserStats(req, res, next) {
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

    let period = req.my.query.period;
    if (period) {
        if (typeof period !== 'string') {
            throw new RestError(statusCodes.BadRequest, statusMessages.BadRequest);
        }
        validatePeriod(period);
    } else {
        throw new RestError(statusCodes.BadRequest, statusMessages.BadRequest);
    }

    let dt = req.my.query.dt;
    if (dt) {
        if (typeof dt !== 'string') {
            throw new RestError(statusCodes.BadRequest, statusMessages.BadRequest);
            validateDt(period, dt);
        }
    } else {
        throw new RestError(statusCodes.BadRequest, statusMessages.BadRequest);
    }

    let origin = req.headers['origin'];

    data.getUniqueUsersStats(req.my.userId, appCode, period, dt)
        .then(function returnStats(stats) {
            let statsDto = stats.map(x => {
                return {
                    dt: x.dt,
                    count: x.count
                }
            });

            let response = JSON.stringify(statsDto);
            res.statusCode = statusCodes.OK;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=60');
            res.setHeader('Access-Control-Allow-Origin', origin || 'http://localhost');
            res.setHeader('Access-Control-Allow-Methods', 'GET');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.write(response);
            res.end();

            restStats.countRequestByEndpoint("uniqueuserstats");
            restStats.updateResponseStats(req, res);
        })
        .catch(function (err) {
            next(err);
        });
}

function validatePeriod(period) {
    if (period === 'year' || period === 'month' || period === 'day') {
        return true;
    }
    throw new RestError(statusCodes.BadRequest, statusMessages.BadRequest);
}

function validateDt(period, dt) {
    // TODO: if perion is month, dt should specify a month, e.g. '201901' etc.
}

exports.getUniqueUserStats = getUniqueUserStats;