const main = require('./main');
const { Pool } = require("pg");

const credentials = {
    user: 'postgres',
    host: 'localhost',
    database: 'books_db',
    password: 'Asd123123',
    port: '5432',
    "max": 1, // change this aswell
    "connectionTimeoutMillis": 0,
    "idleTimeoutMillis": 0
};

const connection = new Pool(credentials)

test('test select', async () => {
    await expect(main.select(connection, 1)).resolves.toEqual([
            {
            id: '1',
            isbn: '123123',
            genre: 'adventure',
            author: 'nqkoi',
            name: 'HARRY POTTTER'
            }
        ]
      );
});