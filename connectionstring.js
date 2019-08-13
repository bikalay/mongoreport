module.exports.createUrl = function(host='localhost', port=27017, user, password) {
    if(user && password) {
      return `mongodb://${user}:${password}@${host}:${port}`
    }
    return `mongodb://${host}:${port}`
};
