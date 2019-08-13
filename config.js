const fs = require('fs');

module.exports.getConfigObject = function(argv = {}) {
    const result = {};
    const {config} = argv;
    if (config) {
        const fileData = fs.readFileSync(config, 'utf8');
        const configData = JSON.parse(fileData);
        const keys = Object.keys(configData);
        keys.forEach(key => {
            result[key] = configData[key];
        });
    }
    result.db = argv.d || result.db;
    result.host = argv.h || result.host || 'localhost';
    result.port = argv.p || result.port || 27017;
    result.user = argv.u || result.user;
    result.password = argv.w || result.pwd;
    result.collection = argv.c || result.collection;
    if(argv._ && argv._.length) {
        result.command = argv._[0] || result.command;
    }
    result.command = result.command || 'find';
    if (argv.q) {
        result.query = JSON.parse(argv.q);
    } else if (argv.query) {
        const fileData = fs.readFileSync(argv, 'utf8');
        result.query = JSON.parse(fileData);
    }
    result.query = result.query || (result.command === 'aggregate' ? [] : {});
    result.skip = argv.s || (argv.s === 0 ? argv.s : result.skip) || 0;
    result.limit = argv.l || result.limit || 1000000;
    if (argv.fields) {
        const fields = argv.fields.split(',');
        result.fields = fields.length ? fields : result.fields;
    }
    result.fields = result.fields || [];
    result.output = argv.o || result.output;
    result.type = argv.t || result.type || 'json';
    return result;
};