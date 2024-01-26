'use strict';

const request = require("supertest");
const baseURL = 'http://127.0.0.1:9000';

describe('User Endpoints', () => {

    it('GET /create-book should show all users', async () => {
        const res = await request(baseURL).post('/create-book').send({
            isbn: "128",
            genre:"adventure",
            name:"Harry Potter",
            author:null
        });
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty('name')

        await request(baseURL).post('/delete-book').send({
            isbn: "128"
        });
    });
  
  });