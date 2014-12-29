jDialog.fn.extend({
    /**
     * is function
     * @param fn
     * @returns {boolean}
     */
    isFunction: function (fn) {
        return Object.prototype.toString.call(fn) === '[object Function]';
    },

    /**
     * 简单高效
     * @param obj
     * @returns {boolean}
     */
    isPlainObject: function (obj) {
        if (obj === null) {
            return false;
        }
        return obj.constructor == {}.constructor;
    }
});