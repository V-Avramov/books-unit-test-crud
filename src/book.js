const util = require('./functions');

class Book {
    constructor(isbn, genre, name, author) {
        this.id = null;
        this.isbn = isbn;
        this.genre = genre;
        this.name = name;
        this.author = author;
    }

    getISBN() {
        return this.isbn;
    }
    setISBN(isbn) {
        this.isbn = isbn;
    }
    getGenre() {
        return this.genre;
    }
    setGenre(genre) {
        this.genre = genre
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getAuthor() {
        return this.author;
    }
    
    setAuthor(author) {
        this.author = author;
    }

    createBook() {
        const prepareResult = util.prepareInsert('books', {
            isbn: this.isbn,
            genre: this.genre,
            author: this.author,
            name: this.name
        });
        console.log(prepareResult);

        // TODO ADD DB this.id = queryResult[0].id
    }

    updateBook() {
        if (this.id !== undefined || this.id !== null) {
            const prepareResult = util.prepareUpdate('books', {
                    isbn: this.isbn,
                    genre: this.genre,
                    author: this.author,
                    name: this.name
                }, 
                {
                    id: this.id
                }
            )
            console.log(prepareResult);
            //TODO ADD DB
        }
        else {
            this.createBook();
        }
    }

    deleteBook() {
        if (this.id !== undefined || this.id !== null) {
            return;
        }
        const prepareResult = util.prepareDeleteBooks('books', {id: this.id})
        console.log(prepareResult);
        //TODO ADD DB
    }

    getAllBooks() {
        const prepareResult = util.prepareSelect('books', '*', {});
        console.log(prepareResult);
        // TODO ADD DB
    }
}

module.exports = {Book}