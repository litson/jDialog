jDialog.fn.extend({
    //
    isFunction: function (fn) {
        return Object.prototype.toString.call(fn) === '[object Function]';
    },
    //
    isPlainObject: function (obj) {
        if (obj === null) {
            return false;
        }
        return obj.constructor == {}.constructor;
    }
});