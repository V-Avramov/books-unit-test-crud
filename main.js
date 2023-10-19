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

async function select(conn, id) {
    const sql = `SELECT * FROM books WHERE id = $1`;

    const resp = await conn.query(sql, [id]);

    return resp.rows;
}

async function insert() {

    const sql = `INSERT INTO books(isbn, genre, author, name)
                VALUES ($1, $2, $3, $4)`;

    const resp = await conn.query(sql, ['123123', 'adventure', 'nqkoi', 'HARRY POTTTER']);
}

//console.log(select(connection));

module.exports = {select, insert};