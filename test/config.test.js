const getConfigObject = require('../config').getConfigObject;

test('empty config object', () => {
    expect(getConfigObject()).toEqual({
        host: 'localhost',
        port: 27017,
        command: 'find',
        query: {},
        skip: 0,
        limit: 1000000,
        type: 'json',
        fields: [],
        collection: undefined,
        db: undefined,
        output: undefined,
        user: undefined,
        password: undefined
    })
});