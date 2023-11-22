var config = require('./config');
const { Pool, types } = require("pg");

const credentials = {
user: config.DB_USER,
host: config.DB_HOST,
database: config.DB_DATABASE_TEST,
password: config.DB_PASSWORD,
port: config.DB_PORT,
"max": 1, // change this aswell
"connectionTimeoutMillis": 0,
"idleTimeoutMillis": 0
};

types.setTypeParser(20, parseInt);

const connection = new Pool(credentials)

module.exports = connection;