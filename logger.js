"use strict";

const fs = require('fs');
const dateTimeUtil = require('@artemkv/datetimeutil');

// This is to cache logging data before it is flushed
let _logDir = `${__dirname}/log`;
const ROWS_TO_FLASH = 30;
let _requests = [];

function getLogFileName_4XX() {
    return `${_logDir}/4XX_${dateTimeUtil.getSortableDate()}.log`;
}

function getLogFileName_5XX() {
    return `${_logDir}/5XX_${dateTimeUtil.getSortableDate()}.log`;
}

function getLogFileName_General() {
    return `${_logDir}/_${dateTimeUtil.getSortableDate()}.log`;
}

function getLogFileName_Session() {
    return `${_logDir}/SESSION_${dateTimeUtil.getSortableDate()}.log`;
}

const logFailedRequest = function (req, res, err) {
    let fileName = '';
    if (err.statusCode >= 400 && err.statusCode < 500) {
        fileName = getLogFileName_4XX();
    } else {
        fileName = getLogFileName_5XX();
    }

    let logLine = req.requestTime.toLocaleTimeString() + ' ' +
        req.requestId + ' ' + err.statusCode + ' ' + err.statusMessage + ' ' + err.stack + '\n';
    fs.appendFile(fileName, logLine, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

const log = function (msg) {
    let logLine = new Date().toLocaleTimeString() + ' ' + msg + '\n';
    fs.appendFile(getLogFileName_General(), logLine, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

const logSession = function (url) {
    _requests.push({
        on: new Date(),
        to: url
    });
    if (_requests.length === ROWS_TO_FLASH) {
        let logLine = _requests.map(function (x) { return JSON.stringify(x) }).join(",\n") + ",\n";
        fs.appendFile(getLogFileName_Session(), logLine, function (err) {
            if (err) {
                console.log(err);
            }
        });
        _requests = [];
    }
}

const initialize = function () {
    if (!fs.existsSync(_logDir)) {
        fs.mkdirSync(_logDir);
    }
}

exports.initialize = initialize;
exports.logFailedRequest = logFailedRequest;
exports.log = log;
exports.logSession = logSession;