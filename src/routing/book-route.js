const Book = require('../entities/book');

async function createBook(req, res) {
    console.log("Creating book", req.body);
    const book = new Book(req.body.isbn, req.body.genre, req.body.name, req.body.author);
    const createdBook = await book.createBook(req.self);
    
    res.send(createdBook);
}

function getBook(req, res) {
    const book = new Book(req.body.isbn, '', '', '');
    return book.getBookFromDB(req.self);
}

function deleteBook(req, res) {
    const book = new Book(req.body.isbn, '', '', '');
    book.deleteBook(req.self);
    res.send({status: true})
}

module.exports = {createBook, getBook}