const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectID = mongo.ObjectID;

module.exports.checkObjectIdValid = (id) => {
    if (ObjectID.isValid(id)) {
        return new ObjectID(id).toString() === id;
    }
    return false;
};

module.exports.processQuery = (query) => {
    if (Object.prototype.toString.call(query) === '[object Object]') {
        const keys = Object.keys(query);
        keys.forEach(key => {
            const value = query[key];
            if (Object.prototype.toString.call(value) === '[object Object]' || Object.prototype.toString.call(value) === '[object Array]') {
                this.processQuery(value);
            } else if (typeof value === 'string' && this.checkObjectIdValid(value)) {
                query[key] = new ObjectID(value);
            }
        });
    } else if (Object.prototype.toString.call(query) === '[object Array]') {
        query.forEach((value, index) => {
            if (Object.prototype.toString.call(value) === '[object Object]' || Object.prototype.toString.call(value) === '[object Array]') {
                this.processQuery(value);
            } else if (typeof value === 'string' && this.checkObjectIdValid(value)) {
                query[index] = new ObjectID(value);
            }
        });
    }
    return query;
};

/**
 *
 * @param { string } url
 * @param { string } dbName
 * @param { string } collectionName
 * @param { ('find'|'aggregate') } command
 * @param { Object } queryData
 * @param { Array } fields
 * @param { number } skip
 * @param { number } limit
 * @returns {Promise<Cursor>}
 */
module.exports.exec = function (url, dbName, collectionName, command = 'find', queryData = {}, fields = [], skip = 0, limit = 100000) {
    const query = this.processQuery(queryData);
    return MongoClient.connect(url).then(client => {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        switch (command) {
        case 'find':
            return find(collection, query, fields, skip, limit);
        case 'aggregate':
            return aggregate(collection, query, skip, limit);
        default:
            throw new Error('Unknown command: ' + command);
        }
    });
};

/**
 *
 * @param {Collection} collection
 * @param {Object} queryData
 * @param {Array<string>} fields
 * @param {number} skip
 * @param {number} limit
 * @returns {Cursor}
 */
function find(collection, queryData = {}, fields = [], skip = 0, limit = 100000) {
    let projection;
    if (fields.length > 0) {
        projection = {};
        fields.forEach(field => {
            projection[field] = 1;
        });
    }
    return collection.find(queryData, {skip, limit, projection});
}

/**
 *
 * @param {Collection} collection
 * @param {Array} pipeline
 * @param {number} skip
 * @param {number} limit
 * @returns {Promise<Cursor>}
 */
function aggregate(collection, pipeline = [], skip = 0, limit = 100000) {
    if (!pipeline.find(item => '$skip' in item)) {
        pipeline.push({$skip: skip});
    }
    if (!pipeline.find(item => '$limit' in item)) {
        pipeline.push({$limit: limit});
    }
    return new Promise((resolve, reject) => {
        return collection.aggregate(pipeline, {}, (err, cursor) => {
            if (err) {
                return reject(err);
            }
            resolve(cursor);
        });
    });
}