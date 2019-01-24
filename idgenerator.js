"use strict";

const uuid = require('uuid/v4');

const getNewId = function getNewId() {
    return uuid()
};

const isValidId = function isValidId(id) {
    var uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidPattern.test(id);
};

exports.getNewId = getNewId;
exports.isValidId = isValidId;