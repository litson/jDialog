
;(function (window, document) {


    /* concat from'\src\core.js' */
    var win = window;
    var doc = document;
    var version = '0.9.4';
    var jDialog = function (message, callBack) {
        /**
         *
         */
        return new jDialog.fn.init(message, callBack);
    };
    
    /**
     *
     * @type {{constructor: Function, init: Function}}
     */
    jDialog.fn = jDialog.prototype = {
        constructor: jDialog,
        version: version,
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

    /* concat from'\src\helper.js' */
    jDialog.extend({
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
            if (jDialog.isFunction(handler)) {
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
            if (self.constructor != jDialog
                || typeof actionName !== 'string'
                || !self.actions[actionName]) {
                return false;
            }
            return true;
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
    };

    /* concat from'\src\operations.js' */
    /**
     *
     * @param jDialog
     * @private
     */
    function _renderDOM(jDialog) {
        var self = jDialog;
        var wrapper = self.getWrapper();
        var options = self.options;
    
        // 没有title信息，则不显示header；
        if (self.title() !== '') {
            wrapper
                .appendChild(self.getHeader());
            self.title(options.title);
        }
    
        wrapper
            .appendChild(self.getContainer());
        wrapper
            .appendChild(self.getFooter());
    
        //
        var content = options.content;
        if (options.url) {
            var clientHeight = doc.documentElement.clientHeight;
            content = '<iframe style="width: 100%" height="'
            + clientHeight
            + '" frameborder="0" src="'
            + options.url
            + '"></iframe>';
        }
        self.content(content);
    
    
        //
        if (options.modal) {
            self.showModal();
        }
        //
        if (options.callBack) {
            self.addButton('确定', 'apply', options.callBack);
        }
        //
        self.addButton('取消', 'destory', function () {
            self.destory();
        });
        wrapper.addEventListener('click', _eventRouter.bind(self), false);
        doc.body.appendChild(wrapper);
        self.verticalInViewPort(options.fixed);
        return self;
    };
    
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
    };
    
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
        jDialog.event.fire(actionName);
    };
    
    /**
     *
     * @param context
     * @returns {HTMLElement}
     * @private
     */
    function _createModal(context) {
        var self = context;
        var element = _createElement('div');
        element.style.cssText = ';background:rgba(0,0,0,0.3);width:100%;'
        + 'height:100%;position:fixed;left:0;top:0;z-index:'
        + (self.currentDOMIndex - 1);
        element.onclick = function () {
            if (!self.options.preventHide) {
                jDialog.event.fire('destory');
            }
        };
        doc.body.appendChild(element);
        return element;
    }
    
    jDialog.fn.extend({
    
        /**
         * 保证 position:fixed 的dialog永远处于视口内；
         */
        verticalInViewPort: function (useFixed) {
            var docElement = doc.documentElement;
            var clientHeight = docElement.clientHeight;
            var dialogHeight = this.height();
    
            if (useFixed) {
    
                if (dialogHeight > clientHeight) {
                    dialogHeight = clientHeight - 30;
                    this.getContainer().style.height =
                        dialogHeight - (this.getHeader().offsetHeight + this.getFooter().offsetHeight) + 'px';
                }
                this.height(dialogHeight)
                    .toggleLockBody(true)
                    .extend(this.getWrapper().style, {
                        position: 'fixed',
                        bottom: 0,
                        top: 0
                    });
    
            } else {
    
                var scrollTop = docElement.scrollTop;
                var top = Math.max((clientHeight - dialogHeight) * 382 / 1000 + scrollTop, scrollTop);
    
                this.top(top)
                    .height('auto')
                    .toggleLockBody(false)
                    .getContainer().style.height = 'auto';
    
            }
    
            return this;
        },
    
        /**
         * 锁住body的scroll，不让其滚动；
         * @param useLock
         */
        toggleLockBody: function (useLock) {
            var height = '';
            var hiddenType = '';
            if (useLock) {
                height = '100%';
                hiddenType = 'hidden';
            }
            doc.body.style.height = height;
            doc.body.style.overflow = hiddenType;
            return this;
        },
    
        /**
         *  获取dialog的DOM结构
         * @returns {HTMLElement|*|wrapper}
         */
        getWrapper: function () {
            if (!this.wrapper) {
                var prefix = this.options.prefix;
                this.wrapper = _createElement('div', {
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
                this.header = _createElement('div', {
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
                this.container = _createElement('div', {
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
                this.footer = _createElement('div', {
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
         * 关于添加按钮及事件的模块，
         * 现在很不灵活。。。
         * @method addButton
         * @param text
         * @param actionName
         * @param handler
         * @returns {*}
         */
        addButton: function (text, actionName, handler) {
            var prefix = this.options.prefix;
            var element = _createElement('a', {
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
        addClass: function (className, context) {
            // 自动补齐前缀
            //var prefix = this.options.prefix;
            //var reg = new RegExp('^' + prefix, 'gi');
            //if (!reg.test(className)) {
            //    className = prefix + className;
            //}
            var context = context || this.getWrapper();
            if (context.nodeType === 1
                && typeof className === 'string') {
                context.classList.add(className);
            }
            return this;
        },
    
        /**
         * 为当前dialog添加remove
         * @param className
         */
        removeClass: function (className, context) {
            //var prefix = this.options.prefix;
            //var reg = new RegExp('^' + prefix, 'gi');
            //if (!reg.test(className)) {
            //    className = prefix + className;
            //}
            var context = context || this.getWrapper();
            if (context.nodeType === 1
                && typeof className === 'string') {
                context.classList.remove(className);
            }
            return this;
        },
    
        /**
         * 设置自动隐藏时间
         * @param delay  为0，直接销毁；不设置，采用默认用户设置；
         * @returns {*}
         */
        autoHide: function (delay) {
    
            // 0则自动销毁；
            if (delay == 0) {
                return this.destory();
            }
    
            //
            if (delay === undefined) {
                return this.autoHide(this.options.autoHide);
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
                this.wrapper.removeEventListener('click', _eventRouter, false);
                doc.body.removeChild(this.wrapper);
            }
            if (this.modal) {
                this.modal.onclick = null;
                doc.body.removeChild(this.modal);
            }
            this.toggleLockBody(false);
            jDialog.currentDialog = null;
            return this;
        },
    
        /**
         * 获取当前dialog的Modal的DOM结构
         * @returns {modal|*}
         */
        getModal: function () {
            if (!this.modal) {
                this.modal = _createModal(this);
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
     *  设置函数集
     * @param number
     * @returns {*}
     */
    var addPixelUnit = function (number) {
        if (!/em|px|rem|pt|%|auto/gi.test(number)) {
            number = number + 'px';
        }
        return number;
    };
    
    jDialog.fn.extend({
    
        /**
         * 返回当前的title或为dialog设置title
         * @param text
         * @returns {*}
         */
        title: function (value) {
            if (typeof value === 'undefined') {
                return this.options.title;
            }
            this.getHeader().innerHTML = value;
            return this;
        },
    
        /**
         * 返回当前设置的content或设置content
         * @param value
         * @returns {*}
         */
        content: function (value) {
            if (value === undefined) {
                return this.options.content;
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
         * 返回当前的top值或者为dialog设置top
         * @param value
         * @returns {*}
         */
        top: function (value) {
            if (value === undefined) {
                return win.getComputedStyle(this.getWrapper()).top;
            }
            this.wrapper.style.top = addPixelUnit(value);
            this.wrapper.style.bottom = '';
            return this;
        },
    
        /**
         * 相对于视口，还是相对于文档流
         * @param useAbsolute
         * @returns {*}
         */
        fixed: function (useAbsolute) {
            if (!useAbsolute) {
                this.getWrapper().style.position = 'fixed';
            } else {
                this.getWrapper().style.position = 'absolute';
            }
            this.verticalInViewPort(!useAbsolute);
            return this;
        },
        /**
         *
         */
        preventHide: function () {
            this.options.preventHide = true;
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
            dialog.getContainer().style.textAlign = 'center';
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

    /* concat from'\src\compatibleAMD.js' */
    if (typeof define === "function" && define.amd) {
        define("jdialog", [], function () {
            return jDialog;
        });
    } else {
        win.jDialog = jDialog;
    }

})(window, window.document);

//# sourceMappingURL=../maps/jDialog.js.map