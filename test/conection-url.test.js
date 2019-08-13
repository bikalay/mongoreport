const createUrl = require('../connection-url').createUrl;

test('default connection url', () => {
    expect(createUrl()).toBe('mongodb://localhost:27017');
});

test('connection with custom port', ()  => {
    expect(createUrl(undefined, 27018)).toBe('mongodb://localhost:27018');
});

test('connection with custom host', () => {
    expect(createUrl('127.0.0.1')).toBe('mongodb://127.0.0.1:27017');
});

test('connection with host and port', () => {
    expect(createUrl('127.0.0.1', 27018)).toBe('mongodb://127.0.0.1:27018');
});

test('connection with username and password', () => {
    expect(createUrl(undefined, undefined, 'admin', 'adminPassword'))
        .toBe('mongodb://admin:adminPassword@localhost:27017');
});

test('connection with host, port, username and password', () => {
    expect(createUrl('127.0.0.1', 27018, 'admin', 'adminPassword'))
        .toBe('mongodb://admin:adminPassword@127.0.0.1:27018');
});
