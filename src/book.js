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

    async createBook(self) {
        const prepareResult = util.prepareInsert('books', [{
            isbn: this.isbn,
            genre: this.genre,
            author: this.author,
            name: this.name
        }]);
        const inserted = await self.db.query(prepareResult.query, prepareResult.placeholders);
        util.ASSERT(inserted.rowCount === 1, "Problem with createBook insert");
        util.ASSERT(inserted.rows[0].id !== undefined && inserted.rows[0].id !== null);
        this.id = inserted.rows[0].id;
        
        return inserted.rows[0];
    }

    async updateBook(self, newCols = null) {
        if (this.id !== undefined && this.id !== null) {
            let bookNewData = {
                isbn: this.isbn,
                genre: this.genre,
                author: this.author,
                name: this.name
            };

            if (newCols !== null) {
                bookNewData = newCols;
            }
            const prepareResult = util.prepareUpdate('books', 
                bookNewData, 
                {
                    id: this.id
                }
            )
            await self.db.query(prepareResult.query, prepareResult.placeholders);
        }
        else {
            await this.createBook(self);
        }
    }

    async deleteBook(self, where = null) {
        let whereVals = {id: this.id};
        if (where !== null) {
            whereVals = where;
        } else {
            util.ASSERT(this.id !== undefined && this.id !== null, "The book does not exist in the database");
        }
        const prepareResult = util.prepareDeleteBooks('books', whereVals)
        await self.db.query(prepareResult.query, prepareResult.placeholders);
    }

    async getAllBooks(self) {
        const prepareResult = util.prepareSelect('books', '*');
        const result = await self.db.query(prepareResult.query, prepareResult.placeholders);
        return result.rows;
    }

    async getBookFromDB(self) {
        util.ASSERT(this.id !== null, "This book is not in the database yet");

        const prepareResult = util.prepareSelect('books', '*', { id: this.id })
        const result = await self.db.query(prepareResult.query, prepareResult.placeholders);
        
        return result.rows[0];
    }

    getBookAsObject() {
        return {
            isbn: this.isbn,
            genre: this.genre,
            name: this.name,
            author: this.author
        };
    }
};

module.exports = Book