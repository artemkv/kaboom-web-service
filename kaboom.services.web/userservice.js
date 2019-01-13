"use strict";

const CLIENT_ID = '1012739762252-agthbe2e8df58pj08q4rpcejs8ndkq7e.apps.googleusercontent.com'; // TODO: environment?

const googleAuth = require('google-auth-library');

function validateToken(id_token) {
    let authClient = new googleAuth.OAuth2Client(CLIENT_ID);
    return authClient.verifyIdToken({
        idToken: id_token,
        audience: CLIENT_ID,
    });
}

function validateTicket(ticket) {
    let payload = ticket.getPayload();
    let userId = payload['sub'];

    // TODO: validate *iss*, must be equal to "accounts.google.com" or "https://accounts.google.com"

    return userId;
}

const convertTokenToUserId = function convertTokenToUserId(id_token) {
    return validateToken(id_token).then(validateTicket);
}

exports.convertTokenToUserId = convertTokenToUserId;