"use strict";

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

function generateAppCode() {
    return '4398759834759'; // TODO:
}

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


exports.getUserInfo = getUserInfo;
exports.getAppCrashes = getAppCrashes;
exports.getAppCrash = getAppCrash;