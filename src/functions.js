async function select(conn, id) {
    const sql = `SELECT * FROM books WHERE id = $1`;

    const resp = await conn.query(sql, [id]);

    return resp.rows;
}

async function insert(conn, params) {

    let colsStr = "";
    let placeholders = [];
    for(const key in params) {
        colsStr += `${key},`;
        placeholders.push(params[key]);
    }
    colsStr = colsStr.slice(0, -1);

    const sql = `INSERT INTO books(${colsStr})
                VALUES ($1, $2, $3, $4)
                RETURNING *`;

    const resp = await conn.query(sql, placeholders);
    return resp.rows[0].id;
}

module.exports = {select, insert};