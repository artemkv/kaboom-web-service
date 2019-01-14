"use strict";

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

function generateAppCode() {
    return '4398759834759'; // TODO:
}

// TODO: validate that all requests that user does are allowed for her (appId actually belongs to that user)

// If user exists, retrieves the user info
// If user does not exist, first creates the user
const getUserInfo = function getUserInfo(userId) {
    return new Promise(function (resolve, reject) {
        const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true });
        let db = null;
        let userInfo = null;
        client.connect()
            .then(function saveDb() {
                db = client.db(process.env.DB_NAME);
            })
            .then(function ensureUserExists() {
                return db.collection('users').updateOne(
                    { userId },
                    {
                        $set: { lastAccessedOn: new Date() },
                        $setOnInsert: {
                            userId,
                            defaultAppCode: generateAppCode()
                        }
                    },
                    { upsert: true })
            })
            .then(function (result) {
                if (!result.result.ok) {
                    throw new Error(`User with id ${userId} could not be created/updated`);
                }
            })
            .then(function retrieveUser() {
                return db.collection('users').findOne({ userId });
            })
            .then(function (user) {
                if (!user) {
                    throw new Error(`User with id ${userId} was not found`);
                }
                userInfo = user;
            })
            .then(function ensureDefaultAppExists() {
                return db.collection('applications').updateOne(
                    { appCode: userInfo.defaultAppCode },
                    {
                        $set: { lastAccessedOn: new Date() },
                        $setOnInsert: {
                            appCode: userInfo.defaultAppCode
                        }
                    },
                    { upsert: true }
                );
            })
            .then(function (result) {
                if (!result.result.ok) {
                    throw new Error(`Application with appCode ${userInfo.defaultAppCode} could not be created/updated`);
                }
            })
            .then(function done() {
                resolve(userInfo);
            })
            .catch(function (err) {
                reject(err);
            })
            .then(function () {
                // Always close the connection
                if (client) {
                    client.close();
                }
            });
    });
}

const getAppCrashes = function getAppCrashes(appCode) {
    return new Promise(function (resolve, reject) {
        const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true });
        let db = null;
        let appInfo = null;
        client.connect()
            .then(function saveDb() {
                db = client.db(process.env.DB_NAME);
            })
            .then(function retrieveAppInfo() {
                return db.collection('applications').findOne({ appCode });
            })
            .then(function (app) {
                if (!app) {
                    throw new Error(`App with appCode ${appCode} was not found`);
                }
                appInfo = app;
            })
            .then(function retrieveCrashes() {
                return db.collection('appcrashes').find({ appId: appInfo._id.toString() }).toArray();
            })
            .then(function done(crashes) {
                if (!crashes) {
                    crashes = [];
                }
                resolve(crashes);
            })
            .catch(function (err) {
                reject(err);
            })
            .then(function () {
                // Always close the connection
                if (client) {
                    client.close();
                }
            });
    });
}

const getAppCrash = function getAppCrash(crashId) {
    return new Promise(function (resolve, reject) {
        const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true });
        let db = null;
        client.connect()
            .then(function saveDb() {
                db = client.db(process.env.DB_NAME);
            })
            .then(function retrieveCrashInfo() {
                return db.collection('appcrashes').findOne({ _id: ObjectID(crashId) });
            })
            .then(function done(crashInfo) {
                resolve(crashInfo);
            })
            .catch(function (err) {
                reject(err);
            })
            .then(function () {
                // Always close the connection
                if (client) {
                    client.close();
                }
            });
    });
}

const getAppCrashStats = function getAppCrashStats(appCode, period, dt) {
    let tableName = '';
    let periodStart = '';
    let periodEnd = '';
    switch (period) {
        case 'year':
            tableName = 'appstats.crash.bymonth'
            periodStart = dt + '01';
            periodEnd = dt + '12';
            break;
        case 'month':
            tableName = 'appstats.crash.byday'
            periodStart = dt + '01';
            periodEnd = dt + '31';
            break;
        case 'day':
            tableName = 'appstats.crash.byhour'
            periodStart = dt + '00';
            periodEnd = dt + '23';
            break;
        case 'hour':
            tableName = 'appstats.crash.byminute'
            periodStart = dt + '00';
            periodEnd = dt + '59';
            break;
        case 'minute':
            tableName = 'appstats.crash.bysecond'
            periodStart = dt + '00';
            periodEnd = dt + '59';
            break;
        default:
            throw new Error(`Unknown period ${period}`);
    }

    return new Promise(function (resolve, reject) {
        const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true });
        let db = null;
        let appInfo = null;
        client.connect()
            .then(function saveDb() {
                db = client.db(process.env.DB_NAME);
            })
            .then(function retrieveAppInfo() {
                return db.collection('applications').findOne({ appCode });
            })
            .then(function (app) {
                if (!app) {
                    throw new Error(`App with appCode ${appCode} was not found`);
                }
                appInfo = app;
            })
            .then(function retrieveCrashStats() {
                return db.collection(tableName).find(
                    {
                        appId: appInfo._id.toString(),
                        dt: { $gte: periodStart, $lte: periodEnd }
                    }).toArray();
            })
            .then(function done(stats) {
                if (!stats) {
                    stats = [];
                }
                resolve(stats);
            })
            .catch(function (err) {
                reject(err);
            })
            .then(function () {
                // Always close the connection
                if (client) {
                    client.close();
                }
            });
    });
}

const getUniqueUsersStats = function getUniqueUsersStats(appCode, period, dt) {
    let tableName = '';
    let periodStart = '';
    let periodEnd = '';
    switch (period) {
        case 'year':
            tableName = 'uniqueusers.bymonth'
            periodStart = dt + '01';
            periodEnd = dt + '12';
            break;
        case 'month':
            tableName = 'uniqueusers.byday'
            periodStart = dt + '01';
            periodEnd = dt + '31';
            break;
        case 'day':
            tableName = 'uniqueusers.byhour'
            periodStart = dt + '00';
            periodEnd = dt + '23';
            break;
        default:
            throw new Error(`Unknown period ${period}`);
    }

    return new Promise(function (resolve, reject) {
        const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true });
        let db = null;
        let appInfo = null;
        client.connect()
            .then(function saveDb() {
                db = client.db(process.env.DB_NAME);
            })
            .then(function retrieveAppInfo() {
                return db.collection('applications').findOne({ appCode });
            })
            .then(function (app) {
                if (!app) {
                    throw new Error(`App with appCode ${appCode} was not found`);
                }
                appInfo = app;
            })
            .then(function retrieveUniqueUserStats() {
                return db.collection(tableName).find(
                    {
                        appId: appInfo._id.toString(),
                        dt: { $gte: periodStart, $lte: periodEnd }
                    }).toArray();
            })
            .then(function done(stats) {
                if (!stats) {
                    stats = [];
                }
                resolve(stats);
            })
            .catch(function (err) {
                reject(err);
            })
            .then(function () {
                // Always close the connection
                if (client) {
                    client.close();
                }
            });
    });
}

exports.getUserInfo = getUserInfo;
exports.getAppCrashes = getAppCrashes;
exports.getAppCrash = getAppCrash;
exports.getAppCrashStats = getAppCrashStats;
exports.getUniqueUsersStats = getUniqueUsersStats;