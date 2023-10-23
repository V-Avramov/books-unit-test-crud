const connection = require("./database");
const util = require('./functions');

test('test select', async () => {
    await expect(util.select(connection, 1)).resolves.toEqual([
            {
            id: '1',
            isbn: '123123',
            genre: 'adventure',
            author: 'nqkoi',
            name: 'HARRY POTTTER'
            }
        ]
      );
});