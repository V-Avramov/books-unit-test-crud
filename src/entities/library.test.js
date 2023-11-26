'use strict';

const Book = require('./book');
const Library = require('./library');
const connection = require("../utilities/test-database");

var self = {};
var library;

beforeAll(async() => {
    self.db = connection;

    let sql = `
          CREATE TABLE IF NOT EXISTS libraries(
              id BIGSERIAL PRIMARY KEY UNIQUE,
              name text
          )`;
  
    await self.db.query(sql);

    sql = `
          CREATE TABLE IF NOT EXISTS books(
              isbn text PRIMARY KEY UNIQUE,
              genre text,
              name text,
              author text
          )`;
  
    await self.db.query(sql);

    sql = `
          CREATE TABLE IF NOT EXISTS library_book(
              id BIGSERIAL PRIMARY KEY UNIQUE,
              library_id bigint REFERENCES libraries(id),
              book_isbn text REFERENCES books(isbn)
          )`;
  
    await self.db.query(sql);
  });
  
afterAll(async () => {
    let sql = `DROP TABLE IF EXISTS library_book`;
    await self.db.query(sql);

    sql = `DROP TABLE IF EXISTS books`;  
    await self.db.query(sql);

    sql = `DROP TABLE IF EXISTS libraries`;
    await self.db.query(sql);

    self.db.end();
  });

beforeEach(() => {
  library = new Library('OfficialLib');
});

test('get name of library', () => {
  expect(library.getName()).toEqual('OfficialLib');
});

test('set new name of library', () => {
  expect(library.getName()).toEqual('OfficialLib');
  library.setName("O NO CRINGE");
  expect(library.getName()).toEqual('O NO CRINGE');
});

test('get books from library', () => {
  expect(library.getBooks()).toEqual([]);
});

test('add book to library', () => {
  const book = new Book('123', 'helpful stuff', 'the art of war', 'za zin zu')
  library.addBook(book);
});


test('add not a book to library', () => {
  try {
    library.addBook({isbn: '123', genre: 'adventure', name: 'the art of war', author: 'za zin zu'});
  } catch (e) {
    expect(e instanceof Error).toBeTruthy();
    expect(e.message).toEqual('This object is not an instance of book');
  }
});

test('prepareBooksForSave', () => {
  const book1 = new Book('1', 'g1', 'coolname', 'az');
  const book2 = new Book('2', 'g1', 'coolname', 'az');
  library.addBook(book1);
  library.addBook(book2);

  expect(library.prepareBooksForSave()).toEqual([
    book1.getBookAsObject(),
    book2.getBookAsObject()
  ]);
});

test('prepareLibraryBookForSave fail', () => {
  const book1 = new Book('1', 'g1', 'coolname', 'az');
  const book2 = new Book('2', 'g1', 'coolname', 'az');
  library.addBook(book1);
  library.addBook(book2);
  expect(() => library.prepareLibraryBooksForSave()).toThrow();
  expect(() => library.prepareLibraryBooksForSave()).toThrow("This library does not exist in the database yet");
});

// Below are integration tests
test('save library', async () => {
  const savedLibrary = await library.saveLibrary(self);
  expect(savedLibrary).toEqual({
    id: savedLibrary.id, // IDK how to test this
    name: 'OfficialLib'
  });
});


test('prepareLibraryBookForSave fail', async () => {
  const book1 = new Book('1', 'g1', 'coolname', 'az');
  const book2 = new Book('2', 'g1', 'coolname', 'az');
  library.addBook(book1);
  library.addBook(book2);
  
  const savedLibrary = await library.saveLibrary(self);

  expect(library.prepareLibraryBooksForSave()).toEqual([
    {
      book_isbn: book1.getISBN(),
      library_id: savedLibrary.id
    },
    {
      book_isbn: book2.getISBN(),
      library_id: savedLibrary.id
    }
  ]);
});

test('save books', async () => {

  const book1 = new Book('1', 'g1', 'coolname', 'az');
  const book2 = new Book('2', 'g1', 'coolname', 'az');
  library.addBook(book1);
  library.addBook(book2);
  
  const savedLibrary = await library.saveLibrary(self);

  expect(library.saveBooks(self)).resolves.toEqual([
    book1.getBookAsObject(),
    book2.getBookAsObject()
  ]);
});

test('save library books', async () => {
  const book1 = new Book('1', 'g1', 'coolname', 'az');
  const book2 = new Book('2', 'g1', 'coolname', 'az');
  library.addBook(book1);
  library.addBook(book2);

  const savedLibrary = await library.saveLibrary(self);

  const savedLibraryBooks = await library.saveLibraryBooks(self);

  expect(savedLibraryBooks).toEqual([
    {
      id: savedLibraryBooks[0].id,
      book_isbn: book1.getISBN(),
      library_id: savedLibrary.id
    },
    {
      id: savedLibraryBooks[1].id,
      book_isbn: book2.getISBN(),
      library_id: savedLibrary.id
    }
  ])
});