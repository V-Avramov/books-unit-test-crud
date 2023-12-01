const express = require('express');
const app = express();
const readFileSync = require('fs').readFileSync;
app.use(express.json());
const Ajv = require('ajv');
const ajv = new Ajv();

const connection = require("./src/utilities/database");
const util = require('./src/utilities/functions');
const config = require('./src/utilities/config')

const bookR = require('./src/routing/book-route');


function readJsonFile(commandName) {
    const fileName = `./json_schemas/bookstore::crud::${commandName}.json`
    let raw = readFileSync(fileName);
    console.log(raw);
    return JSON.parse(raw);
}

function middleware(req, res, next) {
    console.log("MIDDLEWARE CALLED", req.url);
    const jsonSchema = readJsonFile(req.url.slice(1));
    console.log(jsonSchema);
    const isValid = ajv.validate(jsonSchema, req.body);
    if (!isValid) {
        throw Error("The input is invalid");
    }
    next();
}

try {
    var self = {
        db: connection
    };

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
    for(const method in dispatchTable) {
        for (const url in dispatchTable[method]) {
            const func = (req, res) => 
            {
                req.self = self;
                dispatchTable[method][url].func(req, res);
            }
            if (method === 'get') {
                app.get(url, middleware, dispatchTable[method][url].func.constructor.name === 'AsyncFunction' ? util.asyncHandler((req, res) => func(req, res)) : (req, res) => func(req, res));
            } else if (method === 'post') {
                app.post(url, middleware, dispatchTable[method][url].func.constructor.name === 'AsyncFunction' ? util.asyncHandler((req, res) => func(req, res)) : (req, res) => func(req, res));
            }
        }
    }
/*
    app.post('/create-book', async (req, res) => {
        console.log("Creating book", req.body);
        const book = new Book(req.body.isbn, req.body.genre, req.body.name, req.body.author);
        const createdBook = await book.createBook(self);
        
        res.send(createdBook);
    });*/

    app.listen(config.PORT, () => {
        console.log(`Listening on port ${config.PORT}`)
      });
} catch(e) {
    console.error(e);
}