const express = require('express');
const app = express();
app.use(express.json());

const connection = require("./src/utilities/database");
const util = require('./src/utilities/functions');
const config = require('./src/utilities/config')

const bookR = require('./src/routing/book-route');

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
            if (dispatchTable[method][url].func.constructor.name === 'AsyncFunction') {
                console.log('AsyncFunction');
            } else {
                console.log('Function');
            }
            if (method === 'get') {
                app.get(url, dispatchTable[method][url].func.constructor.name === 'AsyncFunction' ? util.asyncHandler((req, res) => func(req, res)) : (req, res) => func(req, res));
            } else if (method === 'post') {
                app.post(url, dispatchTable[method][url].func.constructor.name === 'AsyncFunction' ? util.asyncHandler((req, res) => func(req, res)) : (req, res) => func(req, res));
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