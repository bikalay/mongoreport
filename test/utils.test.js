const {isArray, isObject, capitalize, getFieldValue} = require('../utils');

test('capitalize simple field', () => {
    expect(capitalize('field')).toBe('Field');
});

test('capitalize _id', () => {
    expect(capitalize('_id')).toBe('Id');
});

test('capitalize complex field', () => {
    expect(capitalize('name.first')).toBe('NameFirst');
});

test('capitalize complex field with _id', () => {
    expect(capitalize('member._id')).toBe('MemberId');
});

test('is object', () => {
    expect(isObject({a: 2})).toBe(true);
    expect(isObject({})).toBe(true);
    expect(isObject({a: 2, b: []})).toBe(true);
    expect(isObject({a: '12', c: null})).toBe(true);
});

test('is not object', () => {
    expect(isObject(new Date())).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject(123)).toBe(false);
});

test('is array', () => {
    expect(isArray([])).toBe(true);
    expect(isArray([1, [], {}])).toBe(true);
    expect(isArray(new Array())).toBe(true);
});

test('is not array', () => {
    expect(isArray({})).toBe(false);
    expect(isArray({'0': 1, '1': 2})).toBe(false);
    expect(isArray('1,2,3,4')).toBe(false);
});

test('get field', () => {
    expect(getFieldValue('a.b.c', {a: {b: {c: 5}}})).toBe(5);
});