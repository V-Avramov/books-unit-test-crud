'use strict';

const Book = require('./book');
const connection = require("./test-database");

var self = {};
var book;

beforeAll(async() => {
    self.db = connection;
    const sql = `
          CREATE TABLE IF NOT EXISTS books(
              id BIGSERIAL PRIMARY KEY UNIQUE,
              isbn text UNIQUE,
              genre text,
              name text,
              author text
          )`;
  
    await self.db.query(sql);
  });
  
afterAll(async () => {
    const sql = `DROP TABLE IF EXISTS books`;
  
    await self.db.query(sql);
    self.db.end();
  });

beforeEach(() => {
    book = new Book('123', 'adventure', 'johnny ludiq', 'az');
})
test('test get isbn', () => {
    expect(book.getISBN()).toEqual('123');
  });


test('test change isbn', () => {
    expect(book.getISBN()).toEqual('123');

    book.setISBN('567');
    expect(book.getISBN()).toEqual('567');
  });

test('test get genre', () => {
    expect(book.getGenre()).toEqual('adventure');
});

test('test change genre', () => {
    expect(book.getGenre()).toEqual('adventure');

    book.setGenre('sci fi');
    expect(book.getGenre()).toEqual('sci fi');
});

test('test get name', () => {
    expect(book.getGenre()).toEqual('adventure');
});

test('test change name', () => {
    expect(book.getName()).toEqual('johnny ludiq');

    book.setName('novo ime');
    expect(book.getName()).toEqual('novo ime');
});

test('test get author', () => {
    expect(book.getAuthor()).toEqual('az');
});

test('test change author', () => {
    expect(book.getAuthor()).toEqual('az');

    book.setAuthor('toi');
    expect(book.getAuthor()).toEqual('toi');
});

// Below are integration tests with DB
test('test create book', async () => {
    const result = await book.createBook(self);
    expect(result).toEqual(
        {
          id: result.id, // IDK how to test this here
          isbn: '123',
          genre: 'adventure',
          author: 'az',
          name: 'johnny ludiq'
        }
  );
});

test('test update nonexistent book', async () => {
    book.setISBN('1111');
    await book.updateBook(self);

    const updatedBook = await book.getBookFromDB(self);
    expect(updatedBook).toEqual(
        {
          id: updatedBook.id, // IDK how to test this here
          isbn: '1111',
          genre: 'adventure',
          author: 'az',
          name: 'johnny ludiq'
        })
});

test('test update existing book', async () => {
    book.setISBN('123123');
    await book.createBook(self);

    book.setName("My name is what? My name is who?")
    await book.updateBook(self);

    const updatedBook = await book.getBookFromDB(self);
    expect(updatedBook).toEqual(
        {
          id: updatedBook.id, // IDK how to test this here
          isbn: '123123',
          genre: 'adventure',
          author: 'az',
          name: 'My name is what? My name is who?'
        })
});

test('test update existing book only one column', async () => {
    book.setISBN('123asd');
    await book.createBook(self);

    await book.updateBook(self, { author: "AAA"});

    const updatedBook = await book.getBookFromDB(self);
    expect(updatedBook).toEqual(
        {
          id: updatedBook.id, // IDK how to test this here
          isbn: '123asd',
          genre: 'adventure',
          author: 'AAA',
          name: 'johnny ludiq'
        })
});

test('delete book from DB', async () => {
    book.setISBN('bt001');
    await book.createBook(self);
    await book.deleteBook(self);
    const deletedBook = await book.getBookFromDB(self);
    expect(deletedBook).toBeUndefined();
});

test('delete book from DB with custom where', async () => {
    book.setISBN('bt002');
    await book.createBook(self);
    await book.deleteBook(self, {isbn: 'bt002'});
    const deletedBook = await book.getBookFromDB(self);
    expect(deletedBook).toBeUndefined();
});

test('delete nonexistent book from DB', () => {
    book.deleteBook(self)
    .catch(e => {
        expect(e instanceof Error).toBeTruthy();
        expect(e.message).toEqual("The book does not exist in the database");
    });
});

test('get all books from DB', async () => {
    const allBooks = await book.getAllBooks(self);
    expect(allBooks.length > 0).toBeTruthy();
})

test('get book as object', () => {
    expect(book.getBookAsObject()).toEqual({
        isbn: '123',
        genre: 'adventure',
        author: 'az',
        name: 'johnny ludiq'
      })
});