/**
 * Capitalize string
 * @param {string} string
 * @return {string}
 */
module.exports.capitalize = function(string) {
    let strArr = string.split('.');
    strArr = strArr.map(s => {
        if(s === '_id') return 'Id';
        return s.charAt(0).toUpperCase() + s.slice(1);
    });
    return strArr.join('');
};