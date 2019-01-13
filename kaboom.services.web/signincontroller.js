"use strict";

const MAX_LENGTH = 2000;

const statusCodes = require('@artemkv/statuscodes');
const statusMessages = require('@artemkv/statusmessages');
const RestError = require('@artemkv/resterror');
const restStats = require('@artemkv/reststats');
const readJsonStream = require('@artemkv/readjsonstream');
const userService = require('./userservice');
const data = require('./data');

const postToken = function postToken(req, res, next) {
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
    let contentType = req.headers['content-type'];
    if (contentType !== 'application/json') {
        throw new RestError(statusCodes.BadRequest, statusMessages.BadRequest);
    }

    let promise = new Promise(readJsonStream(req, MAX_LENGTH));

    let id_token = null;
    promise
        .then(function convertTokenToUserId(tokenContainer) {
            id_token = tokenContainer.id_token;
            if (!id_token) {
                throw new RestError(statusCodes.BadRequest, statusMessages.BadRequest);
            }
            return userService.convertTokenToUserId(id_token);
        })
        .then(function storeTokenInSessionAndRetrieveUserInfo(userId) {
            console.log("Logged in as " + userId);
            console.log("id_token is " + id_token);

            // Store in session
            req.session.id_token = id_token;

            return data.getUserInfo(userId);
        })
        .then(function returnUserInfo(userInfo) {
            let userDto = {
                userId: userInfo.userId,
                defaultAppCode: userInfo.defaultAppCode
            };

            let response = JSON.stringify(userDto);
            res.statusCode = statusCodes.OK;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.setHeader('Cache-Control', 'no-store');            
            // TODO: this is for debug
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.write(response);
            res.end();

            restStats.countRequestByEndpoint("signin");
            restStats.updateResponseStats(req, res);
        })
        .catch(function (err) {
            console.log(err); // TODO: log somewhere else
            // Any error while validating the token is considered unauthorized access
            next(new RestError(statusCodes.Unauthorized, statusMessages.Unauthorized));
        });
}

exports.postToken = postToken;