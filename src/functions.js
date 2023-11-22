const config = require('./config');

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
    if ('whereVals' in params && params.whereVals !== undefined && Object.keys(params.whereVals).length !== 0) {
        query.whereStr = "WHERE ";
        for(const key in params.whereVals) {
            query.whereStr += `${key} = $${placeholderIndex++} AND `;
            query.placeholders.push(params.whereVals[key]);
        }
        query.whereStr = query.whereStr.slice(0, -5);
    }

    return query;
}

function prepareSelect(table, selectVals, whereVals) {
    const resultData = queryPrepare({whereVals: whereVals});
    const sql = `
    SELECT ${selectVals}
    FROM ${table}
    ${resultData.whereStr}`;

    return {query: sql, placeholders: resultData.placeholders};
}

function prepareInsert(table, params) {
    const resultData = queryPrepare({insertCols: params});
    const sql = `
    INSERT INTO ${table}(${resultData.colsStr})
    VALUES (${resultData.placeholderValues})
    RETURNING *`;

    return {query: sql, placeholders: resultData.placeholders};
}

function prepareUpdate(table, setVals, whereVals) {
    if (Object.keys(setVals).length === 0 || Object.keys(whereVals).length === 0) {
        return;
    }
    const resultData = queryPrepare({setVals: setVals, whereVals: whereVals});

    const sql = `
    UPDATE ${table}
    SET ${resultData.setStr}
    ${resultData.whereStr}`;

    return {query: sql, placeholders: resultData.placeholders};
}

function prepareDeleteBooks(table, whereVals) {
    if (Object.keys(whereVals).length === 0) {
        return;
    }

    const resultData = queryPrepare({whereVals: whereVals})

    const sql = `
    DELETE
    FROM ${table}
    ${resultData.whereStr}`;
    
    return {query: sql, placeholders: resultData.placeholders};
}

function getReplaceTemplate(templateStr, templateData) {
    for(const key in templateData) {
        templateStr = templateStr.replaceAll(`$${key.toString()}$`, templateData[key]);
    }
    return templateStr;
}

function ASSERT(condition, msg = config.APP_ERROR) {
    if (!condition) {
        throw Error(msg);
    }
    return;
}

module.exports = {prepareSelect, prepareInsert, prepareUpdate, prepareDeleteBooks, getReplaceTemplate, ASSERT};