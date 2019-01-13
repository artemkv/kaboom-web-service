"use strict";

const dotenv = require('dotenv');
const connect = require('connect');
const favicon = require('serve-favicon');
const cookieSession = require('cookie-session')
const restStats = require('@artemkv/reststats');
const errorHandler = require('@artemkv/errorhandler');
const myRequest = require('@artemkv/myrequest');
const version = require('./myversion');
const authenticate = require('./authenticate');
const authorize = require('./authorize');
const signinController = require('./signincontroller');
const signoutController = require('./signoutcontroller');
const crashesController = require('./crashesController');
const crashController = require('./crashController');

dotenv.config();

let server = connect();

server
    .use(restStats.countRequest)

    // favicon
    .use(favicon('./favicon.ico'))

    // Used for testing / health checks
    .use('/error', errorHandler.handleError)
    .use('/resterror', errorHandler.handleRestError)

    // Assemble my request
    .use(myRequest)

    // Statistics endpoint
    .use('/stats', restStats.getStats)

    // Session
    .use(cookieSession({
        name: 'session',
        keys: [process.env.SESSION_SECRET_KEY],
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }))

    // Sign-in - stores user id_token in the session
    .use('/signin', signinController.postToken)
    .use('/signout', signoutController.post)

    // *** Enter the protected area ***
    .use(authenticate)
    .use(authorize)

    // Business logic
    .use('/crashes', crashesController.getCrashes)
    .use('/crash', crashController.getCrash)

    // Handles errors
    .use(errorHandler.handle404)
    .use(errorHandler.catchAll);

// Start the server
let port = process.env.NODE_PORT || 8000;
let ip = process.env.NODE_IP || 'localhost';
server.listen(port, ip, function () {
    console.log('Application started');
    console.log('http://' + ip + ":" + port + '/');
    restStats.initialize(version);
});