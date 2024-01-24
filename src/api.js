const express = require('express');
const app = express();
app.use(express.json());

const connection = require("./utilities/database");
const util = require('./utilities/functions');
const config = require('./utilities/config')

const bookR = require('./routing/book-route');

const dispatchTable = {
    get: {
        "/get-book": {
            func: bookR.getBook
        }
    },
    post: {
        "/create-book": {
            func: bookR.createBook
        }
    }
};

function mainStart() {
    
    var self = {
        db: connection
    };
    
    for(const method in dispatchTable) {
        for (const url in dispatchTable[method]) {
            const func = (req, res) => 
            {
                req.self = self;
                dispatchTable[method][url].func(req, res);
            }
            if (method === 'get') {
                app.get(url, dispatchTable[method][url].func.constructor.name === 'AsyncFunction' ? util.asyncHandler((req, res) => func(req, res)) : (req, res) => func(req, res));
            } else if (method === 'post') {
                app.post(url, dispatchTable[method][url].func.constructor.name === 'AsyncFunction' ? util.asyncHandler((req, res) => func(req, res)) : (req, res) => func(req, res));
            }
        }
    }
    
    app.listen(config.PORT, () => {
        console.log(`Listening on port ${config.PORT}`)
      });
}

module.exports = { mainStart, app }