const dotenv = require('dotenv');
dotenv.config();

const data = process.env.NODE_ENV === 'test' ? require('./test/datamock') : require('./data');
const getData = function getData() {
    return data;
}

exports.getData = getData;