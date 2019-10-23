jest.mock('fs');
const getConfigObject = require('../config').getConfigObject;

test('empty config object', () => {
    expect(getConfigObject()).toEqual({
        host: 'localhost',
        port: 27017,
        command: 'find',
        query: {},
        skip: 0,
        limit: 1000000,
        type: 'csv',
        fields: [],
        collection: undefined,
        db: undefined,
        output: 'output.csv',
        user: undefined,
        password: undefined
    });
});

test('config with pass configuration object', () => {
    const argv = {
        h: '127.0.0.1',
        p: 27018,
        _: ['aggregate'],
        q: '[]',
        s: 100,
        l: 100,
        t: 'csv',
        f: 'name, age',
        c: 'users',
        d: 'test_db',
        o: 'report.csv',
        u: 'admin',
        w: 'adminPassword',
        populate: 'member:Members,company:Organizations'
    };
    expect(getConfigObject(argv)).toEqual({
        host: '127.0.0.1',
        port: 27018,
        command: 'aggregate',
        query: [],
        skip: 100,
        limit: 100,
        type: 'csv',
        fields: ['name', 'age'],
        collection: 'users',
        db: 'test_db',
        output: 'report.csv',
        user: 'admin',
        password: 'adminPassword',
        populate: {member: 'Members', company: 'Organizations'}
    });
});

test('config from config file', () => {
    require('fs').__createMockFile('config.json', {
        host: '127.0.0.1',
        port: 27018,
        db: 'test_db',
        output: 'report.js',
        query: {privilege: 'admin'},
        collection: 'users',
        fields: ['name', 'age'],
        type: 'csv'
    });
    expect(getConfigObject({_: ['find'], u:'admin', w: 'adminPassword', o: 'report.csv', config: 'config.json'})).toEqual({
        host: '127.0.0.1',
        port: 27018,
        command: 'find',
        query: {privilege: 'admin'},
        skip: 0,
        limit: 1000000,
        type: 'csv',
        fields: ['name', 'age'],
        collection: 'users',
        db: 'test_db',
        output: 'report.csv',
        user: 'admin',
        password: 'adminPassword'
    });
});

test('query from file', () => {
    require('fs').__createMockFile('query.json', [
        {$match: {}},
        {$group: {_id:'$privilege'}}
    ]);
    expect(getConfigObject({_: ['aggregate'], c:'users', d:'test_db', u:'admin', w: 'adminPassword', o: 'report.csv', queryFile: 'query.json'})).toEqual({
        host: 'localhost',
        port: 27017,
        command: 'aggregate',
        query: [
            {$match: {}},
            {$group: {_id:'$privilege'}}
        ],
        skip: 0,
        limit: 1000000,
        type: 'csv',
        fields: [],
        collection: 'users',
        db: 'test_db',
        output: 'report.csv',
        user: 'admin',
        password: 'adminPassword'
    });
});