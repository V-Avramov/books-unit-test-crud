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
  await expect(util.select(connection, 1)).resolves.toEqual([
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