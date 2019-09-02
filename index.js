const yargs = require('yargs');
const writeFile = require('./write-file');

const argv = yargs
    .usage('Usage: $0 <command> [options]')
    .command('find', 'Find documents in database')
    .command('aggregate', 'MongoDB aggregation function')
    .example('$0 find -c users', 'users full list')
    .alias('d', 'database')
    .describe('d', 'Database name')
    .alias('h', 'host')
    .describe('h', 'Database host')
    .alias('p', 'port')
    .number('p')
    .describe('p', 'Database port')
    .alias('u', 'user')
    .describe('u', 'User name')
    .alias('w', 'password')
    .describe('w', 'User password')
    .alias('c', 'collection')
    .describe('c', 'Database collection name')
    .alias('q', 'query')
    .describe('q', 'Find query')
    .describe('queryFile', 'Path to JSON file with query')
    .alias('s', 'skip')
    .number('s')
    .describe('s', 'Number elements to skip')
    .alias('l', 'limit')
    .number('l')
    .describe('l', 'Output limit')
    .alias('f', 'fields')
    .describe('f', 'List of output fields')
    .alias('o', 'output')
    .describe('o', 'Output file')
    .alias('t', 'type')
    .describe('t', 'Output type')
    .describe('config', 'Path to json file with configuration')
    .describe('populate', 'Array of populated fields')
    .help('help')
    .epilog('Copyright ' + new Date().getFullYear()).argv;

const config = require('./config').getConfigObject(argv);
const connectionUrl = require('./connection-url').createUrl(config.host, config.port, config.user, config.password);
require('./query').exec(connectionUrl, config.db, config.collection, config.command, config.query,
    config.fields, config.skip, config.limit).then(cursor=> {
    return writeFile.csv('output.csv', cursor);
}).then(() => {
    console.info('Success!!!');
    process.exit(0);
}).catch(console.error);



