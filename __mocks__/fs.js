const fs = jest.genMockFromModule('fs');

const files = {};

fs.__createMockFile = function (path, data) {
    if (typeof data === 'string') {
        files[path] = data;
    } else {
        files[path] =JSON.stringify(data);
    }
};

fs.readFileSync = function(path) {
    return files[path];
};

module.exports = fs;