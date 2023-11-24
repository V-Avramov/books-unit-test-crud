CREATE DATABASE books_db;

CREATE TABLE books (
        isbn text PRIMARY KEY UNIQUE,
        genre text,
        name text,
        author text
);

-- Below is the testing database
CREATE DATABASE books_db_test;