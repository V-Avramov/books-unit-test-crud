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

module.exports = {select, insert};