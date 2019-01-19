"use strict";

function generateAppCode() {
    return '12345';
}

const getUserInfo = function getUserInfo(userId) {
    return new Promise(function (resolve, reject) {
        process.nextTick(resolve);
    });
}

const getAppCrashes = function getAppCrashes(userId, appCode) {
    return new Promise(function (resolve, reject) {
        function getFakeAppCrashes() {
            let crashes = [
                {
                    "_id": "5c3d26eb7a2b614415e84498",
                    "appId": "5c3a86c0b55c0b399e8c2f48",
                    "hash": "54ef15dcc265a7ad2024133b17c8111a",
                    "count": 25,
                    "details": "amF2YS5sYW5nLkls",
                    "dt": "2019-01-15T00:18:50.304Z",
                    "message": "Hello Exception1"
                },
                {
                    "_id": "5c3d26eb7a2b614415e84499",
                    "appId": "5c3a86c0b55c0b399e8c2f48",
                    "hash": "54ef15dcc265a7ad2024133b17c8111b",
                    "count": 30,
                    "details": "amF2YS5sYdfgsdfg",
                    "dt": "2019-01-15T00:18:52.304Z",
                    "message": "Hello Exception2"
                }
            ];
            resolve(crashes);
        }

        process.nextTick(getFakeAppCrashes);
    });
}

const getAppCrash = function getAppCrash(userId, appCode, crashId) {
    return new Promise(function (resolve, reject) {
        process.nextTick(resolve);
    });
}

const getAppCrashStats = function getAppCrashStats(userId, appCode, period, dt) {
    return new Promise(function (resolve, reject) {
        process.nextTick(resolve);
    });
}

const getUniqueUsersStats = function getUniqueUsersStats(userId, appCode, period, dt) {
    return new Promise(function (resolve, reject) {
        process.nextTick(resolve);
    });
}

exports.getUserInfo = getUserInfo;
exports.getAppCrashes = getAppCrashes;
exports.getAppCrash = getAppCrash;
exports.getAppCrashStats = getAppCrashStats;
exports.getUniqueUsersStats = getUniqueUsersStats;