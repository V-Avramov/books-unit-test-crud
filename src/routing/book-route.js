const Book = require('../entities/book');

async function createBook(req, res) {
    console.log("Creating book", req.body);
    const book = new Book(req.body.isbn, req.body.genre, req.body.name, req.body.author);
    const createdBook = await book.createBook(req.self);
    
    res.send(createdBook);
}

function getBook(req, res) {
    res.send({text:"BOOK"})
}

module.exports = {createBook, getBook}