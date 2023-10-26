const connection = require("./test-database");
const util = require('./functions');

beforeAll(async() => {
  const sql = `
        CREATE TABLE IF NOT EXISTS books(
            id BIGSERIAL PRIMARY KEY UNIQUE,
            isbn text UNIQUE,
            genre text,
            name text,
            author text
        )`;

  await connection.query(sql);
});

afterAll(async () => {
  const sql = `DROP TABLE IF EXISTS books`;

  await connection.query(sql);
});

test('test select', async () => {
  const id = await util.insert(connection, {
          isbn: '123123',
          genre: 'adventure',
          author: 'nqkoi',
          name: 'HARRY POTTTER'
  });
  console.log("ID IS", id);
  await expect(util.select(connection, id)).resolves.toEqual([
          {
            id: id,
            isbn: '123123',
            genre: 'adventure',
            author: 'nqkoi',
            name: 'HARRY POTTTER'
          }
      ]
    );
  });


test('test update', async () => {
  const id = await util.insert(connection, {
          isbn: '123',
          genre: 'ooooo',
          author: 'nqkoi2',
          name: 'HARRY POTTTER2'
  });
  console.log("ID IS", id);

  await util.update(connection, {
    genre: "adventure",
    author: "The Book Author",
    name: "Harry Potter and the Chamber of secrets"
  }, {id: id, isbn: "123"})

  await expect(util.select(connection, id)).resolves.toEqual([
          {
            id: id,
            isbn: '123',
            genre: "adventure",
            author: "The Book Author",
            name: "Harry Potter and the Chamber of secrets"
          }
      ]
    );
  });


test('test delete', async () => {
  const id = await util.insert(connection, {
          isbn: '111',
          genre: 'ooooo',
          author: 'nqkoi2',
          name: 'HARRY POTTTER2'
  });

  expect(id).toBeDefined();

  await util.deleteBooks(connection, {id: id});

  await expect(util.select(connection, id)).resolves.toEqual([
      ]
    );
  });