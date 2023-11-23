'use strict';

const Book = require('./book');
const connection = require("./test-database");

var self = {};
var book;

beforeAll(async() => {
    self.db = connection;

    let sql = `
          CREATE TABLE IF NOT EXISTS libraries(
              id BIGSERIAL PRIMARY KEY UNIQUE,
              name text
          )`;
  
    await self.db.query(sql);

    sql = `
          CREATE TABLE IF NOT EXISTS books(
              id BIGSERIAL PRIMARY KEY UNIQUE,
              isbn text UNIQUE,
              genre text,
              name text,
              author text,
              library_id bigint REFERENCES libraries(id)
          )`;
  
    await self.db.query(sql);
  });
  
afterAll(async () => {
    let sql = `DROP TABLE IF EXISTS books`;  
    await self.db.query(sql);

    sql = `DROP TABLE IF EXISTS libraries`;
    await self.db.query(sql);

    self.db.end();
  });

test('add book to library', () => {

});