const connection = require("./test-database");
const util = require('./functions');
/*
beforeAll(async() => {
  const sql = `
        CREATE TABLE IF NOT EXISTS books(
            id BIGSERIAL PRIMARY KEY UNIQUE,
            isbn text UNIQUE,
            genre text,
            name text,
            author text
        )`;

  await connection.query(sql);
});

afterAll(async () => {
  const sql = `DROP TABLE IF EXISTS books`;

  await connection.query(sql);
});*/
/*
test('test select', async () => {
  const id = await util.insert(connection, {
          isbn: '123123',
          genre: 'adventure',
          author: 'nqkoi',
          name: 'HARRY POTTTER'
  });
  console.log("ID IS", id);
  await expect(util.select(connection, id)).resolves.toEqual([
          {
            id: id,
            isbn: '123123',
            genre: 'adventure',
            author: 'nqkoi',
            name: 'HARRY POTTTER'
          }
      ]
    );
  });
*/
test('test select', () => {
  const result = util.prepareSelect('books', '*', {id: 1, name: "Harry Potter"});
  console.log("RES1", result);
  const equality = `
    SELECT *
    FROM books
    WHERE id = $1 AND name = $2`;
  expect(result.query).toEqual(equality);
  expect(result.placeholders).toEqual([1, "Harry Potter"]);
})

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
/*
test('test update', async () => {
  const id = await util.insert(connection, {
          isbn: '123',
          genre: 'ooooo',
          author: 'nqkoi2',
          name: 'HARRY POTTTER2'
  });
  console.log("ID IS", id);

  await util.update(connection, {
    genre: "adventure",
    author: "The Book Author",
    name: "Harry Potter and the Chamber of secrets"
  }, {id: id, isbn: "123"})

  await expect(util.select(connection, id)).resolves.toEqual([
          {
            id: id,
            isbn: '123',
            genre: "adventure",
            author: "The Book Author",
            name: "Harry Potter and the Chamber of secrets"
          }
      ]
    );
  });
*/

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
})

test('fail update empty set', () => {
  const result = util.prepareUpdate('books', {}, {id: 1});
  expect(result).toEqual(undefined);
})

test('fail update empty where', () => {
  const result = util.prepareUpdate('books', {name: "123123"}, {});
  expect(result).toEqual(undefined);
})
/*
test('test delete', async () => {
  const id = await util.insert(connection, {
          isbn: '111',
          genre: 'ooooo',
          author: 'nqkoi2',
          name: 'HARRY POTTTER2'
  });

  expect(id).toBeDefined();

  await util.deleteBooks(connection, {id: id});

  await expect(util.select(connection, id)).resolves.toEqual([
      ]
    );
  });*/
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
})

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