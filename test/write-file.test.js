const writeFIle = require('../write-file');

test('get columns from flat object', () => {
    expect(writeFIle.processColumns({_id: 1, firstName: 'Ivan', lastName: 'Ivanov', age: 25})).toEqual({
        _id: {
            key: '_id',
            name: 'Id',
            order: 0
        },
        firstName: {
            key: 'firstName',
            name: 'FirstName',
            order: 1
        },
        lastName: {
            key: 'lastName',
            name: 'LastName',
            order: 2
        },
        age: {
            key: 'age',
            name: 'Age',
            order: 3
        }
    });
});

test('get additional columns', () => {
    const columns = writeFIle.processColumns({_id: 1, age: 25});
    expect(writeFIle.processColumns({_id: 1, firstName: 'Ivan', lastName: 'Ivanov', age: 25}, columns)).toEqual({
        _id: {
            key: '_id',
            name: 'Id',
            order: 0
        },
        firstName: {
            key: 'firstName',
            name: 'FirstName',
            order: 2
        },
        lastName: {
            key: 'lastName',
            name: 'LastName',
            order: 3
        },
        age: {
            key: 'age',
            name: 'Age',
            order: 1
        }
    });
});

test('get columns from deep object', () => {
    expect(writeFIle.processColumns({_id: 1, name: {first: 'Ivan', last: 'Ivanov'}, age: 25,
        member: {_id: 2, organization: {_id: 3, name: 'Test Organization'}}}))
        .toEqual({
            _id: {
                key: '_id',
                name: 'Id',
                order: 0
            },
            'name.first': {
                key: 'name.first',
                name: 'NameFirst',
                order: 1
            },
            'name.last': {
                key: 'name.last',
                name: 'NameLast',
                order: 2
            },
            age: {
                key: 'age',
                name: 'Age',
                order: 3
            },
            'member._id': {
                key: 'member._id',
                name: 'MemberId',
                order: 4
            },
            'member.organization._id': {
                key: 'member.organization._id',
                name: 'MemberOrganizationId',
                order: 5
            },
            'member.organization.name': {
                key: 'member.organization.name',
                name: 'MemberOrganizationName',
                order: 6
            }
        });
});

test('get additional columns from deep object', () => {
    const columns = writeFIle.processColumns({_id: 1, age: 25, member: {_id: 4} });
    expect(writeFIle.processColumns({_id: 1, name: {first: 'Ivan', last: 'Ivanov'}, age: 25,
        member: {_id: 2, organization: {_id: 3, name: 'Test Organization'}}}, columns))
        .toEqual({
            _id: {
                key: '_id',
                name: 'Id',
                order: 0
            },
            'name.first': {
                key: 'name.first',
                name: 'NameFirst',
                order: 3
            },
            'name.last': {
                key: 'name.last',
                name: 'NameLast',
                order: 4
            },
            age: {
                key: 'age',
                name: 'Age',
                order: 1
            },
            'member._id': {
                key: 'member._id',
                name: 'MemberId',
                order: 2
            },
            'member.organization._id': {
                key: 'member.organization._id',
                name: 'MemberOrganizationId',
                order: 5
            },
            'member.organization.name': {
                key: 'member.organization.name',
                name: 'MemberOrganizationName',
                order: 6
            }
        });
});

test('process float document', () => {
    const item = {_id: 1, firstName: 'Ivan', lastName: 'Ivanov', age: 25};
    const columns = writeFIle.processColumns(item);
    expect(writeFIle.generateCSVHeader(columns)).toBe('Id;FirstName;LastName;Age');
    expect(writeFIle.documentToCsvRow(item, columns)).toBe('"1";"Ivan";"Ivanov";"25"');
});

test('process nested document', () => {
    const item = {_id: 1, name: {first:'Ivan', last: 'Ivanov'}, age: 25};
    const columns = writeFIle.processColumns(item);
    expect(writeFIle.generateCSVHeader(columns)).toBe('Id;NameFirst;NameLast;Age');
    expect(writeFIle.documentToCsvRow(item, columns)).toBe('"1";"Ivan";"Ivanov";"25"');
});
