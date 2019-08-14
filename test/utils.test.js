const utils = require('../utils');

test('capitalize simple field', ()  => {
    expect(utils.capitalize('field')).toBe('Field');
});

test('capitalize _id', () => {
    expect(utils.capitalize('_id')).toBe('Id')
});

test('capitalize complex field', () => {
   expect(utils.capitalize('name.first')).toBe('NameFirst')
});

test('capitalize complex field with _id', () => {
    expect(utils.capitalize('member._id')).toBe('MemberId')
});

