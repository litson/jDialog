
;(function (window, document) {


/* concat from'\src\core.js' */
var win = window;
var doc = document;
var event;
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
    version: '0.9.3',
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
            msg: '',                // messages
            autoHide: 0,        // 自动销毁
            /**
             *  对话框class前缀，默认无
             *  强制使用BEM规范
             *  前缀在所有的dom结构上，均会被添加
             */
            prefix: "",
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

        this.actions = {};
        jDialog.event.root = this;
        this.renderDOM();

        // 只存活一个dialog
        if (jDialog.currentDialog) {
            jDialog.currentDialog.destory();
        }
        jDialog.currentDialog = this;
        return this;
    }
}

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
}

/**
 *
 * @type {{constructor: Function, init: Function}|jDialog.fn|*}
 */
jDialog.fn.init.prototype = jDialog.fn;

/* concat from'\src\helper.js' */
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

/* concat from'\src\event.js' */
/**
 *
 * @type {{add: Function, remove: Function, has: Function, fire: Function}}
 */
jDialog.event = {
    add: function (actionName, handler) {
        var self = this.root;
        if (!this.has(actionName)) {
            self.actions[actionName] = [];
        }
        if (self.isFunction(handler)) {
            self.actions[actionName].push(handler);
        }
    },
    remove: function (actionName) {
        var self = this.root;
        if (this.has(actionName)) {
            return delete self.actions[actionName];
        }
        console.warn(actionName + '不存在');
        return false;
    },
    has: function (actionName) {
        var self = this.root;
        return self.actions[actionName] ? true : false;
    },
    fire: function (actionName) {
        var self = this.root;
        if (this.has(actionName)) {
            var actions = self.actions[actionName];
            var length = actions.length;
            if (!length) {
                return false;
            }
            var i = 0;
            for (; i < length; i++) {
                actions[i].call(self);
            }
        }
    }
}

/* concat from'\src\operations.js' */
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
            //this.addButton('确定', 'apply', this.options.callBack);
        }

        this.addButton('取消', 'destory', function () {
            this.destory();
        });

        wrapper.addEventListener('click', this.eventRouter.bind(this), false);
        doc.body.appendChild(wrapper);

        // 计算位置
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

        this.toggleLockBody(true);
        return this;
    },

    /**
     *
     * @param useLock
     */
    toggleLockBody: function (useLock) {
        var height = "";
        var hiddenType = "";
        if (useLock) {
            height = "100%";
            hiddenType = "hidden";
        }
        doc.body.style.height = height;
        doc.body.style.overflow = hiddenType;
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
        jDialog.event.fire(actionName);
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
     *  获取dialog的DOM结构
     * @returns {HTMLElement|*|wrapper}
     */
    getWrapper: function () {
        if (!this.wrapper) {
            var prefix = this.options.prefix;
            this.wrapper = this._createElement('div', {
                className: prefix + 'dialog'
            });

            this.wrapper.style.zIndex = this.currentDOMIndex = 9;
        }

        return this.wrapper;
    },

    /**
     *  获取页头的DOM结构
     * @returns {HTMLElement|*|header}
     */
    getHeader: function () {
        if (!this.header) {
            var prefix = this.options.prefix;
            this.header = this._createElement('div', {
                className: prefix + 'dialog-header'
            });
        }
        return this.header;
    },

    /**
     * 隐藏页头
     * @returns {*}
     */
    hideHeader: function () {
        var header = this.getHeader();
        var height = header.offsetHeight;
        this.height(this.height() - height);
        header.style.display = 'none';
        return this;
    },

    /**
     * 获取当前dialog内容的DOM结构
     * @returns {HTMLElement|*|container}
     */
    getContainer: function () {
        if (!this.container) {
            var prefix = this.options.prefix;
            this.container = this._createElement('div', {
                className: prefix + 'dialog-body'
            });
        }
        return this.container;
    },

    /**
     * 获取页尾的dom结构
     * @returns {HTMLElement|*|footer}
     */
    getFooter: function () {
        if (!this.footer) {
            var prefix = this.options.prefix;
            this.footer = this._createElement('div', {
                className: prefix + 'dialog-footer'
            });
        }
        return this.footer;
    },

    /**
     * 隐藏页尾
     * @returns {*}
     */
    hideFooter: function () {
        var footer = this.getFooter();
        var height = footer.offsetHeight;
        this.height(this.height() - height);
        footer.style.display = 'none';
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
        var prefix = this.options.prefix;
        var element = this._createElement('a', {
            href: 'javascript:;',
            className: prefix + 'dialog-btn',
            innerHTML: text || '按钮'
        });
        if (actionName) {
            element.setAttribute('data-dialog-action', actionName);
            jDialog.event.add(actionName, handler);
        }
        //
        this.getFooter().appendChild(element);
        return this;
    },

    /**
     * 为当前dialog添加class
     * @param className
     * @returns {*}
     */
    addClass: function (className) {
        // 自动补齐前缀
        //var prefix = this.options.prefix;
        //var reg = new RegExp('^' + prefix, 'gi');
        //if (!reg.test(className)) {
        //    className = prefix + className;
        //}
        this.getWrapper().classList.add(className);
        return this;
    },

    /**
     * 为当前dialog添加remove
     * @param className
     */
    removeClass: function (className) {
        //var prefix = this.options.prefix;
        //var reg = new RegExp('^' + prefix, 'gi');
        //if (!reg.test(className)) {
        //    className = prefix + className;
        //}
        this.getWrapper().classList.remove(className);
    },

    /**
     * 设置自动隐藏时间
     * @param delay  为0，直接销毁；不设置，采用默认用户设置；
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
        this.toggleLockBody(false);
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
            //jDialog.event.fire('destory');
        }.bind(this);
        doc.body.appendChild(element);
        return element;
    },

    /**
     * 获取当前dialog的Modal的DOM结构
     * @returns {modal|*}
     */
    getModal: function () {
        if (!this.modal) {
            this.modal = this.createModal();
        }
        return this.modal;
    },

    /**
     * 隐藏当前dialog的Modal
     * @returns {*}
     */
    hideModal: function () {
        this.getModal().style.display = 'none';
        return this;
    },

    /**
     * 显示当前dialog的Modal
     * @returns {*}
     */
    showModal: function () {
        this.getModal().style.display = '';
        return this;
    }
});

/* concat from'\src\setting.js' */
/**
 *  设置类函数集
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
        this.wrapper.style.bottom = "";
        return this;
    }
});

/* concat from'\src\components.js' */
/**
 *  封装一些常用的dialog
 */
jDialog.extend({
    alert: function (message) {
        return jDialog(message);
    },
    toast: function (message, delay) {
        var dialog = jDialog(message);
        dialog.getContainer().style.textAlign = "center";
        dialog
            .hideFooter()
            .hideHeader()
            .hideModal()
            .addClass('dialog-toast')
            .autoHide(delay || 3);
        return dialog;
    },
    error: function (message, callBack) {
        return jDialog(message,callBack).addClass('dialog-error');
    }
});

 window.jDialog = jDialog;
})(window, window.document);

//# sourceMappingURL=../maps/jDialog.js.map