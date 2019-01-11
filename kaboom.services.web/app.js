"use strict";

const dotenv = require('dotenv');
const connect = require('connect');
const favicon = require('serve-favicon');
const restStats = require('@artemkv/reststats');
const errorHandler = require('@artemkv/errorhandler');
const myRequest = require('@artemkv/myrequest');
const version = require('./myversion');
const signinController = require('./signincontroller');

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

    // Sign-in // TODO: store user id in the session
    .use('/signin', signinController.postToken)

    // TODO: do business

    // Handles errors
    .use(errorHandler.handle404)
    .use(errorHandler.catchAll);

// Start the server
let env = process.env;
let port = env.NODE_PORT || 8000;
let ip = env.NODE_IP || 'localhost';
server.listen(port, ip, function () {
    console.log('Application started');
    console.log('http://' + ip + ":" + port + '/');
    restStats.initialize(version);
});