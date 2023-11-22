const connection = require("./test-database");
const util = require('./functions');
const config = require("./config");

test('test select', () => {
  const result = util.prepareSelect('books', '*', {id: 1, name: "Harry Potter"});
  const equality = `
    SELECT *
    FROM books
    WHERE id = $1 AND name = $2`;
  expect(result.query).toEqual(equality);
  expect(result.placeholders).toEqual([1, "Harry Potter"]);
});

test('test insert', () => {
  const result = util.prepareInsert('books', {
      isbn: '123',
      genre: 'ooooo',
      author: 'nqkoi2',
      name: 'HARRY POTTTER2'
  });
  const equalityQuery = `
    INSERT INTO books(isbn,genre,author,name)
    VALUES ($1,$2,$3,$4)
    RETURNING *`;
  expect(result.query).toEqual(equalityQuery);
  expect(result.placeholders).toEqual(['123', 'ooooo', 'nqkoi2', 'HARRY POTTTER2']);
});

test ('test update', () => {
  const result = util.prepareUpdate('books', {
      genre: "adventure",
      author: "The Book Author",
      name: "Harry Potter and the Chamber of secrets"
    }, 
    {id: 1, isbn: "123"});
  const equalityQuery = `
    UPDATE books
    SET genre = $1,author = $2,name = $3
    WHERE id = $4 AND isbn = $5`;

  expect(result.query).toEqual(equalityQuery);
  expect(result.placeholders).toEqual(["adventure", "The Book Author", "Harry Potter and the Chamber of secrets", 1, "123"]);
});

test('fail update empty set', () => {
  const result = util.prepareUpdate('books', {}, {id: 1});
  expect(result).toEqual(undefined);
});

test('fail update empty where', () => {
  const result = util.prepareUpdate('books', {name: "123123"}, {});
  expect(result).toEqual(undefined);
});

test('test delete', () => {
  const result = util.prepareDeleteBooks('books', {id: 1})
  const equalityQuery = `
    DELETE
    FROM books
    WHERE id = $1`;
  
  expect(result.query).toEqual(equalityQuery);
  expect(result.placeholders).toEqual([1])
});

test('fail delete empty where', () => {
  const result = util.prepareDeleteBooks('books', {});
  expect(result).toEqual(undefined);
});

test('test template', () => {

  const book = {
    name: "The best book name",
    author: "Someone",
    isbn: "123123"
  };

  const template = util.getReplaceTemplate("The book is called$name$,it costs 11$ which is not much $,written by $author$, isbn: $isbn$", book);
  let symbolsNumb = 0;
  for(const char of template) {
    if (char === ' ' || char === '\n') {
      symbolsNumb = 0;
    }
    if (char === '$') {
      expect(++symbolsNumb === 2).toBeFalsy();
    }
  }
});

test('test assert', () => {
  expect(util.ASSERT(true)).toBeUndefined();
});

test('test assert fail', () => {
  try {
    util.ASSERT(false);
  } catch(e) {
    expect(e instanceof Error).toBeTruthy();
    expect(e.message).toEqual(config.APP_ERROR);
  };
});

test('test assert fail with message', () => {
  try {
    util.ASSERT(false, "OOPS MSG");
  } catch(e) {
    expect(e instanceof Error).toBeTruthy();
    expect(e.message).toEqual("OOPS MSG");
  };
});