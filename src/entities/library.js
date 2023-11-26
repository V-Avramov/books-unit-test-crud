const util = require('../utilities/functions');
const Book = require('./book');

class Library {
    constructor(name) {
        this.id = null;
        this.name = name;
        this.books = [];
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    addBook(book) {
        util.ASSERT(book instanceof Book, "This object is not an instance of book");
        this.books.push(book);
    }
    
    getBooks() {
        return this.books;
    }

    async saveLibrary(self) {
        const prepareResult = util.prepareInsert('libraries', [{name: this.name}]);
        const insertedLibrary = await self.db.query(prepareResult.query, prepareResult.placeholders);
        util.ASSERT(insertedLibrary.rowsCount !== 0, "Problem while saving library");
        this.id = insertedLibrary.rows[0].id;

        return insertedLibrary.rows[0];
    }

    prepareBooksForSave() {
        const savedBooks = [];
        for(const book of this.books) {
            savedBooks.push(book.getBookAsObject());
        }
        return savedBooks;
    }

    prepareLibraryBooksForSave() {
        util.ASSERT(this.id !== null, "This library does not exist in the database yet");
        const libraryBooks = [];

        for(const book of this.books) {
            libraryBooks.push({
                book_isbn: book.getISBN(),
                library_id: this.id
            });
        }

        return libraryBooks;
    }

    async saveBooks(self) {
        util.ASSERT(this.id !== null, "This library does not exist in the database yet");
        const prepareResult = util.prepareInsert('books', this.prepareBooksForSave());

        const insertedBooks = await self.db.query(prepareResult.query, prepareResult.placeholders);
        return insertedBooks.rows;
    }

    async saveLibraryBooks(self) {
        const prepareResult = util.prepareInsert('library_book', this.prepareLibraryBooksForSave());

        const insertedLibraryBooks = await self.db.query(prepareResult.query, prepareResult.placeholders);
        return insertedLibraryBooks.rows;
    }
};

module.exports = Library;