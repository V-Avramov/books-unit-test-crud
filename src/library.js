const util = require('./functions');
const Book = require('./book');

class Library {
    constructor() {
        this.id = null;
        this.name = 'Lib';
        this.books = [];
    }
    constructor(name) {
        this.id = null;
        this.name = name;
        this.books = [];
    }
    addBook(book) {
        util.ASSERT(book instanceof  Book, "This object is not an instance of book");
        this.books.push(book);
    }
    prepareBooksForSave() {
        ASSERT(this.id === null, "This library does not exist in the database yet");
        const savedBooks = [];
        for(const book of this.books) {
            const currBook = book.getBookAsObject();
            currBook.library_id = this.id;
            savedBooks.push(currBook);
        }
        return savedBooks;
    }
    async saveBooks(self) {
        const prepareResult = util.prepareInsert('books', this.prepareBooksForSave());

        const insertedBooks = await self.db.query(prepareResult.query, prepareResult.placeholders);
    }
};

module.exports = Library;