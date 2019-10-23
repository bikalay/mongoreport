/**
 * Capitalize string
 * @param {string} string
 * @return {string}
 */
module.exports.capitalize = function (string) {
    let strArr = string.split('.');
    strArr = strArr.map(s => {
        if (s === '_id') return 'Id';
        return s.charAt(0).toUpperCase() + s.slice(1);
    });
    return strArr.join('');
};
/**
 *
 * @param value
 * @return {boolean}
 */
module.exports.isArray = function (value) {
    return Object.prototype.toString.call(value) === '[object Array]';
};

/**
 *
 * @param value
 * @return {boolean}
 */
module.exports.isObject = function (value) {
    return Object.prototype.toString.call(value) === '[object Object]';
};

module.exports.getFieldValue = function (fieldName, obj) {
    return [obj].concat(fieldName.split('.')).reduce((prevVal, nextVal) => {
        debugger;
        return prevVal[nextVal];
    });
};