/**
 *
 * @param fn
 * @returns {boolean}
 */
function isFunction(fn) {
    return Object.prototype.toString.call(fn) === '[object Function]';
}

/**
 *
 * @param obj
 * @returns {boolean}
 */
function isPlainObject(obj) {
    if (obj === null || obj === undefined) {
        return false;
    }
    return obj.constructor == {}.constructor;
}

/**
 *
 * @param url
 * @returns {boolean}
 */
function isUrl(url) {
    var regexp =
        /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(url);
}

jDialog.extend({
    /**
     * 顶级缓存对象，目前没什么用
     */
    expando: "jDialog" + (version + Math.random()).replace(/\D/g, '')
});
