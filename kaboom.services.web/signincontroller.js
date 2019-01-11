"use strict";

const MAX_LENGTH = 2000;
const CLIENT_ID = '1012739762252-agthbe2e8df58pj08q4rpcejs8ndkq7e.apps.googleusercontent.com'; // TODO: environment?

const statusCodes = require('@artemkv/statuscodes');
const statusMessages = require('@artemkv/statusmessages');
const RestError = require('@artemkv/resterror');
const restStats = require('@artemkv/reststats');
const readJsonStream = require('@artemkv/readjsonstream');
const googleAuth = require('google-auth-library');

const postToken = function (req, res, next) {
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

    promise
        .then(function validateToken(id_token) {
            let authClient = new googleAuth.OAuth2Client(CLIENT_ID);
            return authClient.verifyIdToken({
                idToken: id_token.id_token,
                audience: CLIENT_ID,
            });
        })
        .then(function validateTicket(ticket) {
            let payload = ticket.getPayload();
            let userId = payload['sub'];

            console.log("Logged in as " + userId);

            // validate *iss*, must be equal to "accounts.google.com" or "https://accounts.google.com"

            res.statusCode = statusCodes.OK;
            // TODO: this is for debug
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.end(userId);

            restStats.countRequestByEndpoint("signin");
            restStats.updateResponseStats(req, res);
        })
        .catch(function (err) {
            next(err);
        });
}

exports.postToken = postToken;