
;(function (window, document) {

/* concat from'/Users/litsonzhang/workspace/jDialog/src/core.js' */
var win = window;
var doc = document;
var jDialog = function (message, callBack) {
    /**
     *
     */
    return new jDialog.fn.init(message, callBack);
}

/**
 *
 * @type {{constructor: Function, init: Function}}
 */
jDialog.fn = jDialog.prototype = {
    constructor: jDialog,

    /**
     *
     * @param message
     * @param callBack
     * @returns {jDialog}
     */
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
        if (jDialog.currentDialog) {
            jDialog.currentDialog.destory();
        }
        jDialog.currentDialog = this;
        return this;
    }
}

/**
 *
 * @returns {*|{}}
 */
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

/**
 *
 * @type {{constructor: Function, init: Function}|jDialog.fn|*}
 */
jDialog.fn.init.prototype = jDialog.fn;
/* concat from'/Users/litsonzhang/workspace/jDialog/src/helper.js' */
jDialog.fn.extend({

    /**
     *
     * @param fn
     * @returns {boolean}
     */
    isFunction: function (fn) {
        return Object.prototype.toString.call(fn) === '[object Function]';
    },

    /**
     *
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
/* concat from'/Users/litsonzhang/workspace/jDialog/src/event.js' */
jDialog.fn.extend({

    /**
     *
     * @returns {{}}
     */
    initEventSystem: function () {
        var self = this;
        var ret = {};

        function add(actionName, handler) {
            if (!self.events.has(actionName)) {
                self.events.actions[actionName] = [];
            }
            if (self.isFunction(handler)) {
                self.events.actions[actionName].push(handler);
            }

        }

        function remove(actionName) {
            if (self.events.has(actionName)) {
                return delete  self.events.actions[actionName];
            }
            console.warn(actionName + '不存在');
            return false;
        }

        function has(actionName) {
            return self.events.actions[actionName] ? true : false;
        }

        ret.actions = {
            destory: [
                function () {
                    self.destory();
                }
            ]
        };
        ret.add = add;
        ret.remove = remove;
        ret.has = has;
        return ret;
    }
});
/* concat from'/Users/litsonzhang/workspace/jDialog/src/operations.js' */
jDialog.fn.extend({

    /**
     *
     * @returns {*}
     */
    renderDOM: function () {
        this.wrapper = this._createElement('div', {
            className: 'dialog'
        });

        this.wrapper.style.zIndex = this.currentDOMIndex = 9;

        this.wrapper
            .appendChild(this.getHeader());
        this.wrapper
            .appendChild(this.getContainer());
        this.wrapper
            .appendChild(this.getFooter());

        //
        this.setTitle(this.options.title)
            .setMsg(this.options.msg);

        if (this.options.modal) {
            this.showModal();
        }

        if (this.options.callBack) {
            this.addButton('确定', 'apply', this.options.callBack);
        }
        this.addButton('取消', 'destory');

        this.wrapper.addEventListener('click', this.eventRouter.bind(this), false);
        doc.body.appendChild(this.wrapper);
        return this;
    },

    /**
     *
     * @param event
     */
    eventRouter: function (event) {
        var target = event.target;
        var actionName = target.getAttribute('data-dialog-action');
        if (!actionName) {
            return;
        }
        this.fireEvent(actionName);
    },

    /**
     *
     * @param tagName
     * @param attrs
     * @returns {HTMLElement}
     * @private
     */
    _createElement: function (tagName, attrs) {
        var element = doc.createElement(tagName);
        this.extend(element, attrs);
        return element;
    },

    /**
     *
     * @returns {HTMLElement|*|header}
     */
    getHeader: function () {
        if (!this.header) {
            this.header = this._createElement('div', {
                className: 'dialog-header'
            });
        }
        return this.header;
    },

    /**
     *
     * @returns {*}
     */
    hideHeader: function () {
        this.getHeader().style.display = 'none';
        return this;
    },

    /**
     *
     * @returns {HTMLElement|*|container}
     */
    getContainer: function () {
        if (!this.container) {
            this.container = this._createElement('div', {
                className: 'dialog-body'
            });
        }
        return this.container;
    },

    /**
     *
     * @returns {HTMLElement|*|footer}
     */
    getFooter: function () {
        if (!this.footer) {
            this.footer = this._createElement('div', {
                className: 'dialog-footer'
            });
        }
        return this.footer;
    },

    /**
     *
     * @returns {*}
     */
    hideFooter: function () {
        this.getFooter().style.display = 'none';
        return this;
    },

    /**
     *
     * @param text
     * @param actionName
     * @param handler
     * @returns {*}
     */
    addButton: function (text, actionName, handler) {
        var element = this._createElement('a', {
            href: 'javascript:;',
            className: 'dialog-btn',
            innerHTML: text || '按钮'
        });
        if (actionName) {
            element.setAttribute('data-dialog-action', actionName);
            this.events.add(actionName, handler);
        }
        //
        this.getFooter().appendChild(element);
        return this;
    },

    /**
     *
     * @returns {*}
     */
    autoHide: function () {
        return this;
    },

    /**
     *
     * @param actionName
     * @returns {*}
     */
    fireEvent: function (actionName) {
        if (this.events.has(actionName)) {
            var actions = this.events.actions[actionName];
            var length = actions.length;
            var i;
            var fn;
            if (!length) {
                return this;
            }
            //while ((fn = actions.shift())) {
            //    fn.call(this);
            //}

            for (i = 0; i < length; i++) {
                actions[i].call(this);
            }
        }
        return this;
    },

    /**
     *
     * @returns {*}
     */
    destory: function () {
        if (this.wrapper) {
            doc.body.removeChild(this.wrapper);
        }
        if (this.modal) {
            doc.body.removeChild(this.modal);
        }
        this.wrapper.removeEventListener('click', this.eventRouter, false);
        jDialog.currentDialog = null;
        return this;
    },

    /**
     *
     * @returns {HTMLElement}
     */
    createModal: function () {
        var element = this._createElement('div');
        element.style.cssText = ";background:rgba(0,0,0,0.3);width:100%;" + "height:100%;position:fixed;left:0;top:0;z-index:" + (this.currentDOMIndex - 1);
        element.onclick = function () {
            this.fireEvent('destory');
        }.bind(this);
        doc.body.appendChild(element);
        return element;
    },

    /**
     *
     * @returns {modal|*}
     */
    getModal: function () {
        if (!this.modal) {
            this.modal = this.createModal();
        }
        return this.modal;
    },

    /**
     *
     * @returns {*}
     */
    hideModal: function () {
        this.getModal().style.display = 'none';
        return this;
    },

    /**
     *
     * @returns {*}
     */
    showModal: function () {
        this.getModal().style.display = '';
        return this;
    }
});
/* concat from'/Users/litsonzhang/workspace/jDialog/src/setting.js' */
/**
 *
 * @param number
 * @returns {*}
 */
var addPixelUnit = function (number) {
    if (!/em|px|rem|pt/gi.test(number)) {
        number = number + 'px';
    }
    return number;
}

jDialog.fn.extend({

    /**
     *
     * @param text
     * @returns {*}
     */
    setTitle: function (text) {
        this.getHeader().innerHTML = text;
        return this;
    },

    /**
     *
     * @param msg
     * @returns {*}
     */
    setMsg: function (msg) {
        this.getContainer().innerHTML = msg;
        return this;
    },

    /**
     *
     * @param value
     * @returns {*}
     */
    setHeight: function (value) {
        this.wrapper.style.height = addPixelUnit(value);
        return this;
    },

    /**
     *
     * @param value
     * @returns {*}
     */
    setWidth: function (value) {
        this.wrapper.style.width = addPixelUnit(value);
        return this;
    },

    /**
     *
     * @param index
     * @returns {*}
     */
    setIndex: function (index) {
        this.currentDOMIndex = index || 9;
        this.wrapper.style.zIndex = this.currentDOMIndex;
        // 永远比wrapper小1
        this.getModal().style.zIndex = this.currentDOMIndex - 1;
        return this;
    },

    /**
     *
     * @param value
     * @returns {*}
     */
    setTop: function (value) {
        this.wrapper.style.top = addPixelUnit(value);
        return this;
    }
});

 window.jDialog = jDialog;
})(window, window.document);

//# sourceMappingURL=../maps/jDialog.js.map