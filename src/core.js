var win = window;
var doc = document;
var version = '0.9.4';
var jDialog = function (message, callBack) {
    /**
     *
     */
    return new jDialog.fn.init(message, callBack);
};


jDialog.fn = jDialog.prototype = {
    constructor: jDialog,
    /**
     * @method init
     * @param message
     * @param callBack
     * @returns {jDialog}
     */
    init: function (message, callBack) {

        if (!message) {
            return this;
        }
        this.options = {
            title: '提示',          // title
            modal: true,        //是否启用模式窗口
            content: '',                // messages
            autoHide: 0,        // 自动销毁
            /**
             *  对话框class前缀，默认无
             *  强制使用BEM规范
             *  前缀在所有的dom结构上，均会被添加
             */
            prefix: '',
            fixed: true,
            /**
             *  点击modal不再隐藏
             */
            preventHide: false,
            callBack: null,
            // iframe
            url: null
        };

        if (jDialog.isPlainObject(message)) {
            jDialog.extend(this.options, message);

        } else if (/string|number|boolean/gi.test(typeof(message))) {
            this.options.content = message;
            if (jDialog.isFunction(callBack)) {
                this.options.callBack = callBack;
            }
        }

        this.actions = {};
        this.buttons = [];
        jDialog.event.root = this;
        _renderDOM(this);

        // 只存活一个dialog
        if (jDialog.currentDialog) {
            jDialog.currentDialog.destory();
        }
        jDialog.currentDialog = this;
        return this;
    }
};

/**
 * 浅copy
 * @returns {*|{}}
 */
jDialog.extend = jDialog.fn.extend = function () {

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
};

/**
 *
 * @type {{constructor: Function, init: Function}|jDialog.fn|*}
 */
jDialog.fn.init.prototype = jDialog.fn;