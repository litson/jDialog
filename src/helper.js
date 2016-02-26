/**
 *
 * @param fn
 * @returns {boolean}
 */
function isFunction( fn ) {
    return Object.prototype.toString.call( fn ) === '[object Function]';
}

/**
 *
 * @param obj
 * @returns {boolean}
 */
function isPlainObject( obj ) {
    if ( obj === null || obj === undefined ) {
        return false;
    }
    return obj.constructor == {}.constructor;
}