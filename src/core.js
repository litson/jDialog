var win = window;
var doc = document;
var jDialog = function (message, callBack) {
    return new jDialog.fn.init(message, callBack);
}

//
jDialog.fn = jDialog.prototype = {
    constructor: jDialog,
    init: function (message, callBack) {

        if (!message) {
            return this;
        }
        this.options = {
            title: '提示', // title
            modal: true, //是否启用模式窗口
            msg: '', // messages
            autoHide: 0, // 自动销毁
            // 页面中只存活一个dialog，
            // 此选择表述dialog.destroy将执行隐藏操作
            // 而不销毁
            preventHide: false,
            callBack: null
        };

        if (this.isPlainObject(message)) {
            this.extend(this.options, message);

        } else if (typeof message === 'string') {
            this.options.msg = message;

            if (this.isFunction(callBack)) {
                this.options.callBack = callBack;
            }
        }

        this.events = this.initEventSystem();
        this.renderDOM();

        // 只存活一个dialog
        // TODO : options.preventHide;
        if (D.currentDialog) {
            D.currentDialog.destory();
        }
        D.currentDialog = this;
        return this;
    }
}

//
jDialog.fn.extend = function () {

    var target = arguments[0] || {};
    var options = arguments[1] || {};
    var name;
    var copy;

    if (arguments.length === 1) {
        target = this;
        options = arguments[0];
    }

    for (name in options) {
        copy = options[name];
        if (copy !== undefined) {
            target[name] = copy;
        }
    }

    return target;
}

//
jDialog.fn.init.prototype = jDialog.fn;

