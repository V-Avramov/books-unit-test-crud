'use strict';

const app = require("./api");

describe('User Endpoints', () => {

    it('GET /create-book should show all users', async () => {
        const res = await request(app).post('/create-book', {
            isbn: "126",
            genre:"adventure",
            name:"Harry Potter",
            author:null
        });
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty('name')
    });
  
  });