const connection = require("./src/database");
const util = require('./src/functions');

console.log(util.select(connection, 1));