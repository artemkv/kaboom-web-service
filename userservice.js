"use strict";

const CLIENT_ID = '1012739762252-agthbe2e8df58pj08q4rpcejs8ndkq7e.apps.googleusercontent.com';

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

    // Verify token issuer
    if (payload.iss !== 'accounts.google.com' && payload.iss !== 'https://accounts.google.com') {
        throw new Error("Invalid id_token issuer: " + payload.iss);
    }

    // Verify expiration date/time
    if (payload.exp < Math.floor(new Date().valueOf() / 1000)) {
        throw new Error("id_token expired at: " + payload.exp);
    }

    let userId = payload['sub'];

    return userId;
}

const convertTokenToUserId = function convertTokenToUserId(id_token) {
    return validateToken(id_token).then(validateTicket);
}

exports.convertTokenToUserId = convertTokenToUserId;