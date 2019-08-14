const fs = require('fs');
const utils = require('./utils');
const prependFile = require('prepend-file');



/**
 *
 * @param {Object} item
 * @param {Object} [columns = {}]
 * @param {string} [parentKey]
 */
module.exports.processColumns = (item, columns = {}, parentKey) => {
    const keys = Object.keys(item);
    keys.forEach(key => {
        const value = item[key];
        if (parentKey) {
            key = parentKey + '.' + key;
        }
        if (Object.prototype.toString.call(value) === '[object Object]' && value._bsontype !== "ObjectID") {
            this.processColumns(value, columns, key);
        } else if (!columns[key]) {
            columns[key] = {
                key,
                name: utils.capitalize(key),
                order: Object.keys(columns).length
            }
        }

    });
    return columns;
};

module.exports.generateCSVHeader = (columns) => {
    const keys = Object.keys(columns);
    return keys.map(key => columns[key].name).join(';')
};

/**
 *
 * @param {Object} item
 * @param {Object} columns
 * @return {string}
 */
module.exports.documentToCsvRow =  (item, columns) => {
    const arr = Array(Object.keys(columns).length).fill('');
    const processItem = (item, arr, parentKey) => {
        const keys = Object.keys(item);
        keys.forEach(key => {
            const value = item[key];
            if (parentKey) {
                key = parentKey + '.' + key;
            }
            if (Object.prototype.toString.call(value) === '[object Object]' && value._bsontype !== "ObjectID") {
                processItem(value, arr, key);
            } else {
                const column = columns[key];
                if (column) {
                    arr[column.order] = value;
                }
            }
        })
    };
    processItem(item, arr);
    return arr.join(';');
};

/**
 *  Creates csv file
 * @param {string} fileName - output filename
 * @param {Cursor} cursor
 */
module.exports.csv =  (fileName, cursor) => {
    let columns = {};
    const stream = fs.createWriteStream(fileName, 'utf8');
    return new Promise((resolve, reject) => {
        stream.once('open', (fd) => {
            const processItem = (item) => {
                if(item) {
                    columns = this.processColumns(item, columns);
                    const row = this.documentToCsvRow(item, columns);
                    stream.write(row + '\n');
                    return Promise.resolve(cursor.next().then(processItem));
                }
            };
            resolve(cursor.next().then(processItem));
        })
    }).then(() => {
        stream.end();
        return new Promise((resolve, reject) => {
            prependFile(fileName, this.generateCSVHeader(columns) + '\n', function (err) {
                if (err) {
                    return reject (err);
                }
                return resolve();
            });
        })
    })
};



