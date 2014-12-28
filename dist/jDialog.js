
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
    version: '0.9.1',
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

        } else if (/string|number|boolean/gi.test(typeof(message))) {
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

        var wrapper = this.getWrapper();

        wrapper
            .appendChild(this.getHeader());
        wrapper
            .appendChild(this.getContainer());
        wrapper
            .appendChild(this.getFooter());

        //
        this.title(this.options.title)
            .message(this.options.msg);

        if (this.options.modal) {
            this.showModal();
        }

        if (this.options.callBack) {
            this.addButton('确定', 'apply', this.options.callBack);
        }

        this.addButton('取消', 'destory');

        wrapper.addEventListener('click', this.eventRouter.bind(this), false);
        doc.body.appendChild(wrapper);

        // 计算top
        var clientHeight = doc.documentElement.clientHeight;
        // 如果dialog的高度大于视口的高度
        if (this.height() > clientHeight) {
            this.height(clientHeight - 30);
            this.getContainer().style.height =
                this.height()
                - (this.getHeader().offsetHeight + this.getFooter().offsetHeight)
                + 'px';
        } else {
            this.height(this.height());
        }
        this.extend(wrapper.style, {
            bottom: 0,
            top: 0
        });

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

    getWrapper: function () {
        if (!this.wrapper) {
            this.wrapper = this._createElement('div', {
                className: 'dialog'
            });

            this.wrapper.style.zIndex = this.currentDOMIndex = 9;
        }

        return this.wrapper;
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
     * @param className
     * @returns {*}
     */
    addClass: function (className) {
        this.getWrapper().classList.add(className);
        return this;
    },

    /**
     *
     * @param className
     */
    removeClass: function (className) {
        this.getWrapper().classList.remove(className);
    },

    /**
     *
     * @returns {*}
     */
    autoHide: function (delay) {

        // 0则自动销毁；
        if (delay == 0) {
            this.destory();
            return this;
        }

        //
        if (delay === undefined) {
            this.autoHide(this.options.autoHide);
            return this;
        }

        // 将会已最新的delay为准
        if (this.autoHideTimer) {
            clearTimeout(this.autoHideTimer);
        }

        this.autoHideTimer = setTimeout(function () {
            this.destory();
            clearTimeout(this.autoHideTimer);
            this.autoHideTimer = null;
        }.bind(this), delay * 1000);

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
            var i = 0;
            //var fn;
            if (!length) {
                return this;
            }
            //while ((fn = actions.shift())) {
            //    fn.call(this);
            //}

            for (; i < length; i++) {
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
            this.wrapper.removeEventListener('click', this.eventRouter, false);
            doc.body.removeChild(this.wrapper);
        }
        if (this.modal) {
            doc.body.removeChild(this.modal);
        }
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
    if (!/em|px|rem|pt|%/gi.test(number)) {
        number = number + 'px';
    }
    return number;
}

jDialog.fn.extend({

    /**
     * 返回当前的title或为dialog设置title
     * @param text
     * @returns {*}
     */
    title: function (value) {
        if (value === undefined) {
            return this.options.title;
        }
        this.getHeader().innerHTML = value;
        return this;
    },

    /**
     * 返回当前设置的message或设置message
     * @param value
     * @returns {*}
     */
    message: function (value) {
        if (value === undefined) {
            return this.options.msg;
        }
        this.getContainer().innerHTML = value;
        return this;
    },

    /**
     * 返回当前的height或为dialog设置height
     * @param value
     * @returns {*}
     */
    height: function (value) {
        if (value === undefined) {
            return this.getWrapper().offsetHeight;
        }
        this.wrapper.style.height = addPixelUnit(value);
        return this;
    },

    /**
     * 返回当前dialog的宽度或为dialog设置宽度
     * @param value
     * @returns {*}
     */
    width: function (value) {
        if (value === undefined) {
            return this.getWrapper().offsetWidth;
        }
        this.wrapper.style.width = addPixelUnit(value);
        return this;
    },

    /**
     * 返回当前的z-index值或为dialog设置z-index
     * @param index
     * @returns {*}
     */
    index: function (value) {
        if (value === undefined) {
            return this.currentDOMIndex;
        }
        this.currentDOMIndex = value;
        this.wrapper.style.zIndex = this.currentDOMIndex;
        // 永远比wrapper小1
        this.getModal().style.zIndex = this.currentDOMIndex - 1;
        return this;
    },

    /**
     *  返回当前的top值或者为dialog设置top
     * @param value
     * @returns {*}
     */
    top: function (value) {
        if (value === undefined) {
            return win.getComputedStyle(this.getWrapper()).top;
        }
        this.wrapper.style.top = addPixelUnit(value);
        return this;
    }
});

/* concat from'/Users/litsonzhang/workspace/jDialog/src/components.js' */
/**
 *
 */
//jDialog.extend({
//    alert: function (message, callBack) {
//        return jDialog(message, callBack);
//    },
//    toast: function (message, callBack) {
//        return jDialog(message, callBack).hideHeader().hideFooter().autoHide(1);
//    },
//    confirm: function (message, callBack) {
//        return jDialog(message).addButton('ȷ��', 'apply', callBack);
//    }
//});

 window.jDialog = jDialog;
})(window, window.document);

//# sourceMappingURL=../maps/jDialog.js.map