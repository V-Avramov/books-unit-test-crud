function queryPrepare(params) {
    let query = {
        placeholders: [],
    };
    let placeholderIndex = 1;
    if ('insertCols' in params && Object.keys(params.insertCols).length !== 0) {

        query.colsStr = "";
        query.placeholderValues = "";
        for(const key in params.insertCols) {
            query.colsStr += `${key},`;
            query.placeholders.push(params.insertCols[key]);
            query.placeholderValues += `$${placeholderIndex++},`;
        }
        query.colsStr = query.colsStr.slice(0, -1);
        query.placeholderValues = query.placeholderValues.slice(0, -1);
    }
    if ('setVals' in params && Object.keys(params.setVals).length !== 0) {
        query.setStr = "";
        for(const key in params.setVals) {
            query.setStr += `${key} = $${placeholderIndex++},`;
            query.placeholders.push(params.setVals[key]);
        }
        query.setStr = query.setStr.slice(0, -1);
    }
    if ('whereVals' in params && Object.keys(params.whereVals).length !== 0) {
        query.whereStr = "";
        for(const key in params.whereVals) {
            query.whereStr += `${key} = $${placeholderIndex++} AND `;
            query.placeholders.push(params.whereVals[key]);
        }
        query.whereStr = query.whereStr.slice(0, -5);
    }

    return query;
}
/*
async function select(conn, id) {
    const sql = `SELECT * FROM books WHERE id = $1`;

    const resp = await conn.query(sql, [id]);

    return resp.rows;
}
*/

function prepareSelect(selectVals, whereVals) {
    const resultData = queryPrepare({whereVals: whereVals});
    const sql = `
    SELECT ${selectVals}
    FROM books
    WHERE ${resultData.whereStr}`;

    //const resp = await conn.query(sql, [id]);

    //return resp.rows;
    return {query: sql, placeholders: resultData.placeholders};
}
/*
async function insert(conn, params) {

    /*let colsStr = "";
    let placeholders = [];
    let placeholderIndex = 1;
    let placeholderValues = "";
    for(const key in params) {
        colsStr += `${key},`;
        placeholders.push(params[key]);
        placeholderValues += `$${placeholderIndex++},`;
    }
    colsStr = colsStr.slice(0, -1);
    placeholderValues = placeholderValues.slice(0, -1);*//*
    const resultData = queryPrepare({insertCols: params});
    const sql = `INSERT INTO books(${resultData.colsStr})
                VALUES (${resultData.placeholderValues})
                RETURNING *`;

    const resp = await conn.query(sql, resultData.placeholders);
    return resp.rows[0].id;
}*/

function prepareInsert(params) {
    const resultData = queryPrepare({insertCols: params});
    const sql = `
    INSERT INTO books(${resultData.colsStr})
    VALUES (${resultData.placeholderValues})
    RETURNING *`;

    return {query: sql, placeholders: resultData.placeholders};
}

function prepareUpdate(setVals, whereVals) {
    if (Object.keys(setVals).length === 0 || Object.keys(whereVals).length === 0) {
        return;
    }
    const resultData = queryPrepare({setVals: setVals, whereVals: whereVals});

    const sql = `
    UPDATE books
    SET ${resultData.setStr}
    WHERE ${resultData.whereStr}`;

    //await conn.query(sql, resultData.placeholders);

    return {query: sql, placeholders: resultData.placeholders};
}

function prepareDeleteBooks(whereVals) {
    if (Object.keys(whereVals).length === 0) {
        return;
    }

    const resultData = queryPrepare({whereVals: whereVals})

    const sql = `
    DELETE
    FROM books
    WHERE ${resultData.whereStr}`;
    
    //await conn.query(sql, resultData.placeholders);
    return {query: sql, placeholders: resultData.placeholders};
}

function getReplaceTemplate(templateStr, templateData) {
    for(const key in templateData) {
        templateStr = templateStr.replaceAll(`$${key.toString()}$`, templateData[key]);
        console.log("KEY", key, "DATA", templateData[key], "RESULT STR", templateStr);
    }
    return templateStr;
}

module.exports = {prepareSelect, prepareInsert, prepareUpdate, prepareDeleteBooks, getReplaceTemplate};