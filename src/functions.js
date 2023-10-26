async function select(conn, id) {
    const sql = `SELECT * FROM books WHERE id = $1`;

    const resp = await conn.query(sql, [id]);

    return resp.rows;
}

async function insert(conn, params) {

    let colsStr = "";
    let placeholders = [];
    let placeholderIndex = 1;
    let placeholderValues = "";
    for(const key in params) {
        colsStr += `${key},`;
        placeholders.push(params[key]);
        placeholderValues += `$${placeholderIndex++},`;
    }
    colsStr = colsStr.slice(0, -1);
    placeholderValues = placeholderValues.slice(0, -1);

    const sql = `INSERT INTO books(${colsStr})
                VALUES (${placeholderValues})
                RETURNING *`;

    const resp = await conn.query(sql, placeholders);
    return resp.rows[0].id;
}

async function update(conn, setVals, whereVals) {
    if (Object.keys(setVals).length === 0 || Object.keys(whereVals).length === 0) {
        return;
    }
    let placeholderIndex = 1;
    let setStr = "";
    let placeholders = [];
    for(const key in setVals) {
        setStr += `${key} = $${placeholderIndex++},`;
        placeholders.push(setVals[key]);
    }
    setStr = setStr.slice(0, -1);
    console.log(setStr);
    console.log(placeholders);

    let whereStr = "";
    for(const key in whereVals) {
        whereStr += `${key} = $${placeholderIndex++} AND `;
        placeholders.push(whereVals[key]);
    }
    whereStr = whereStr.slice(0, -4);
    console.log(whereStr);
    console.log(placeholders);

    const sql = `
        UPDATE books
        SET ${setStr}
        WHERE ${whereStr}`;

    await conn.query(sql, placeholders);
}

async function deleteBooks(conn, whereVals) {
    if (Object.keys(whereVals).length === 0) {
        return;
    }

    let placeholderIndex = 1;
    let placeholders = [];
    let whereStr = "";
    for(const key in whereVals) {
        whereStr += `${key} = $${placeholderIndex++} AND `;
        placeholders.push(whereVals[key]);
    }
    whereStr = whereStr.slice(0, -4);

    const sql = `
        DELETE
        FROM books
        WHERE ${whereStr}`;
    
    await conn.query(sql, placeholders);
}

function getReplaceTemplate(templateStr, templateData) {
    for(const key in templateData) {
        templateStr = templateStr.replaceAll(`$${key.toString()}$`, templateData[key]);
        console.log("KEY", key, "DATA", templateData[key], "RESULT STR", templateStr);
    }
    return templateStr;
}

module.exports = {select, insert, update, deleteBooks, getReplaceTemplate};