var config = require('./config');
const { Pool } = require("pg");

const credentials = {
user: config.DB_USER,
host: config.DB_HOST,
database: config.DB_DATABASE,
password: config.DB_PASSWORD,
port: config.DB_PORT,
"max": 1, // change this aswell
"connectionTimeoutMillis": 0,
"idleTimeoutMillis": 0
};

const connection = new Pool(credentials)

module.exports = connection;