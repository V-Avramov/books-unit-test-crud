const connection = require("./src/database");
const util = require('./src/functions');

console.log(util.select(connection, 1));
util.update(connection, {
    isbn: "123",
    genre: "adventure",
    author: "AZ",
    name: "MOTIVATION"
}, {id: 1, isbn: "123"})