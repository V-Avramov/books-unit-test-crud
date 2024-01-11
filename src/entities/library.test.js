'use strict';

const Library = require('./library');
const connection = require("../utilities/test-database");

var library;

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