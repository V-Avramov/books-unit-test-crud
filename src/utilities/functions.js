const config = require('./config');

function queryPrepare(params) {
    let query = {
        placeholders: [],
    };
    let placeholderIndex = 1;
    if ('insertRows' in params && Object.keys(params.insertRows).length !== 0) {

        query.colsStr = "";
        query.placeholderValues = "";
        let isGettingCols = true;
        for(const cols of params.insertRows) {
            query.placeholderValues += "(";
            for (const key in cols) {
                if (isGettingCols) {
                    query.colsStr += `${key},`;
                }
                query.placeholders.push(cols[key]);
                query.placeholderValues += `$${placeholderIndex++},`;
            }
            isGettingCols = false;
            query.placeholderValues = query.placeholderValues.slice(0, -1);
            query.placeholderValues += "),";
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
    const resultData = queryPrepare({insertRows: params});
    const sql = `
    INSERT INTO ${table}(${resultData.colsStr})
    VALUES ${resultData.placeholderValues}
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

const asyncHandler = fn => (req, res, next) => {
    return Promise
        .resolve(fn(req, res, next))
        .catch(e => {
            handleError(res, req, e);
        });
};

function handleError(res, req, err) {
    if (err instanceof ClientException) {
        if (err.tag === 'xhr') {
            res.status(250);
            res.send({data: err.message})
            return;
        }
    }
    res.send("Application error");
}


module.exports = {prepareSelect, prepareInsert, prepareUpdate, prepareDeleteBooks, getReplaceTemplate, ASSERT, asyncHandler};