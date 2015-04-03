var win = window;
var doc = document;
var version = '1.0.0';
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

        this.options = {
            title: '提示', // title
            modal: true, //是否启用模式窗口
            content: '', // messages
            autoHide: 0, // 自动销毁
            /**
             *  对话框class前缀，默认无
             *  强制使用BEM规范
             *  前缀在所有的dom结构上，均会被添加
             */
            prefix: '',
            fixed: true,
            /**
             *  点击modal不会销毁
             */
            preventHide: false,
            callBack: null,
            // iframe
            url: null
        };
        // this.actions = {};
        this.buttons = [];
        jDialog.event.root = this;
        // 只存活一个dialog
        if (jDialog.currentDialog) {
            jDialog.currentDialog.remove();
        }
        jDialog.currentDialog = this;

        if (isPlainObject(message)) {
            jDialog.extend(this.options, message);

        } else if (/string|number|boolean/gi.test(typeof(message))) {
            this.options.content = message;
            if (isFunction(callBack)) {
                this.options.callBack = callBack;
            }
        } else {
            return this;
        }

        _renderDOM(this);

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

/**
 *
 * @param jDialog
 * @private
 */
function _renderDOM(jDialog) {
    var self = jDialog;
    var wrapper = self.getWrapper();
    var options = self.options;

    wrapper
        .appendChild(self.getHeader());
    wrapper
        .appendChild(self.getContainer());
    wrapper
        .appendChild(self.getFooter());

    if (options.title === '') {
        self.hideHeader();
    }

    self.title(options.title);

    //

    if (options.url) {
        self.iframe(options.url);

    } else {
        self.content(options.content);

    }

    self.addButton('取消', 'destory', function () {
        self.remove();
    });

    //
    if (options.modal) {
        self.showModal();
    }

    if (options.autoHide) {
        self.autoHide(options.autoHide);
    }

    //
    if (options.callBack) {
        self.addButton('确定', 'apply', options.callBack);
    }

    wrapper.addEventListener('click', _eventRouter.bind(self), false);
    wrapper.addEventListener('touchstart', _toggleClass, false);
    wrapper.addEventListener('touchend', _toggleClass, false);

    doc.body.appendChild(wrapper);

    self.verticalInViewPort(options.fixed)
        .addClass('dialog-zoom-in');
    return self;
}

/**
 *
 * @param tagName
 * @param attrs
 * @returns {HTMLElement}
 * @private
 */
function _createElement(tagName, attrs) {
    var element = doc.createElement(tagName);
    jDialog.extend(element, attrs);
    return element;
}

/**
 *
 * @param event
 * @private
 */
function _eventRouter(event) {
    var target = event.target;
    var actionName = target.getAttribute('data-dialog-action');
    if (!actionName) {
        return;
    }
    jDialog.event.fire(actionName, target);
}

/**
 *
 * @param event
 * @private
 */
function _toggleClass(event) {
    var target = event.target;
    var actionName = target.getAttribute('data-dialog-action');
    if (!actionName) {
        return;
    }
    target.classList.toggle('active');
}

/**
 *
 * @param context
 * @returns {HTMLElement}
 * @private
 */
function _createModal(context) {
    var self = context;
    var element = _createElement('div');
    element.style.cssText =
        ';background:rgba(0,0,0,0.3);width:100%;'
        + 'position:absolute;left:0;top:0;'
        + 'height:'
        + Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight)
        + 'px;z-index:'
        + (self.currentDOMIndex - 1);

    element.onclick = function () {
        if (!self.options.preventHide) {
            jDialog.event.fire('destory');
        }
    };

    return doc.body.appendChild(element)
}

