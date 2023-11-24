const express = require('express');
const app = express();
app.use(express.json());

const connection = require("./src/database");
const util = require('./src/functions');
const config = require('./src/config')

const Book = require('./src/book');


const asyncHandler = fn => (req, res, next) => {
    req.self = self;
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

try {
    var self = {
        db: connection
    };

    /*const dispatchTable = {
        get: {
            "/create-book": {
                func: require("./src/routing/book").createBook
            }
        },
        post: {
            "/create-book": {
                func: require("./src/routing/book").createBook
            }
        }
    };
    for(const method in dispatchTable) {
        for (const url in dispatchTable[method]) {
            const func = (req, res) => dispatchTable[method][url].func(req, res);
            if (method === 'get') {
                app.get(url, asyncHandler((req, res) => dispatchTable[method][url].func(req, res)));
            } else if (method === 'post') {
                app.post(url, asyncHandler((req, res) => dispatchTable[method][url].func(req, res)));
            }
        }
    }*/

    app.post('/create-book', async (req, res) => {
        console.log("Creating book", req.body);
        const book = new Book(req.body.isbn, req.body.genre, req.body.name, req.body.author);
        const createdBook = await book.createBook(self);
        
        res.send(createdBook);
    });

    app.listen(config.PORT, () => {
        console.log(`Listening on port ${config.PORT}`)
      });
} catch(e) {
    console.error(e);
}