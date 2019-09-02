/**
 *  Returns url to connect to mongodb
 * @param {string} [host = 'localhost'] - Host name
 * @param {number} [port = 27017] - Port
 * @param {string} [user] - Username
 * @param {string}  [password] - Password
 * @return {string} - connection url;
 */
module.exports.createUrl = function(host='localhost', port=27017, user, password) {
    if(user && password) {
        return `mongodb://${user}:${password}@${host}:${port}`;
    }
    return `mongodb://${host}:${port}`;
};
