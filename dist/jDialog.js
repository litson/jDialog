/* 
https://github.com/litson/jDialog 
 */
;(function (window, document) {


    /* concat from"\src\core.js" */
    var win = window;
    var doc = document;
    var version = '1.0.0';
    var jDialog = function(message, callBack) {
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
        init: function(message, callBack) {
    
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
            this.actions = {};
            this.buttons = [];
            jDialog.event.root = this;
            // 只存活一个dialog
            if (jDialog.currentDialog) {
                jDialog.currentDialog.remove();
            }
            jDialog.currentDialog = this;
    
            if (jDialog.isPlainObject(message)) {
                jDialog.extend(this.options, message);
    
            } else if (/string|number|boolean/gi.test(typeof(message))) {
                this.options.content = message;
                if (jDialog.isFunction(callBack)) {
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
    jDialog.extend = jDialog.fn.extend = function() {
    
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

    /* concat from"\src\helper.js" */
    jDialog.extend({
        /**
         * is function
         * @param fn
         * @returns {boolean}
         */
        isFunction: function(fn) {
            return Object.prototype.toString.call(fn) === '[object Function]';
        },
    
        /**
         * 简单高效
         * @param obj
         * @returns {boolean}
         */
        isPlainObject: function(obj) {
            if (obj === null || obj === undefined) {
                return false;
            }
            return obj.constructor == {}.constructor;
        },
    
        isUrl: function(url) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            return regexp.test(url);
        },
    
        /**
         * 顶级缓存对象，目前没什么用
         */
        expando: "jDialog" + (version + Math.random()).replace(/\D/g, '')
    
    });

    /* concat from"\src\event.js" */
    /**
     *
     * @type {{add: Function, remove: Function, has: Function, fire: Function}}
     */
    jDialog.event = {
        getRoot: function () {
            return this.root || jDialog.currentDialog || jDialog();
        },
        add: function (actionName, handler) {
            var root = this.getRoot();
            if (!this.has(actionName)) {
                root.actions[actionName] = [];
            }
            if (jDialog.isFunction(handler)) {
                root.actions[actionName].push(handler);
            }
            return this;
        },
        remove: function (actionName) {
            var root = this.getRoot();
            if (this.has(actionName)) {
                return delete root.actions[actionName];
            }
            console.warn(actionName + '不存在');
            return false;
        },
        has: function (actionName) {
            var root = this.getRoot();
            if (typeof actionName !== 'string' || !root.actions[actionName]) {
                return false;
            }
            return true;
        },
        once: function (actionName) {
            if (this.has(actionName)) {
                this.fire(actionName)
                    .remove(actionName);
            }
    
            return this;
        },
        fire: function (actionName, target) {
            var root = this.getRoot();
            if (this.has(actionName)) {
                var actions = root.actions[actionName];
                var length = actions.length;
                if (length) {
                    var i = 0;
                    for (; i < length; i++) {
                        actions[i].call(root, target);
                    }
                }
            }
            return this;
        }
    };

    /* concat from"\src\operations.js" */
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
        doc.body.appendChild(element);
        return element;
    }
    
    jDialog.fn.extend({
    
        /**
         * 保证 position:fixed 的dialog永远处于视口内；
         * @param useFixed
         * @returns {*}
         */
        verticalInViewPort: function (useFixed) {
            var docElement = doc.documentElement;
            var clientHeight = docElement.clientHeight;
            var dialogHeight = this.height();
    
            if (useFixed) {
    
                if (dialogHeight > clientHeight) {
                    dialogHeight = 0.75 * clientHeight;
                    this.getContainer().style.height =
                        dialogHeight - (this.height(this.getHeader()) + this.height(this.getFooter())) + 'px';
                }
                this.height(dialogHeight)
                    .toggleLockBody(true)
                    .extend(this.getWrapper().style, {
                        position: 'fixed',
                        marginTop: (-dialogHeight / 2) + "px",
                        top: "50%"
                    });
    
            } else {
    
                // 矫情，明知道webkit取scrollTop是从body取，还要这么做
                var scrollTop = Math.max(doc.body.scrollTop, docElement.scrollTop);
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
    
            var header = this.getHeader();
            var footer = this.getFooter();
            var modal = this.getModal();
            var ev = 'ontouchmove';
    
            if (useLock) {
                header[ev] = footer[ev] = modal[ev] = function () {
                    return false;
                };
                //doc.body.onscroll = function()
            } else {
                header[ev] = footer[ev] = modal[ev] = null;
            }
    
            //        var height = '';
            //        var hiddenType = '';
            //        if (useLock) {
            //            height = '100%';
            //            hiddenType = 'hidden';
            //        }
            //        doc.body.style.height = height;
            //        doc.body.style.overflow = hiddenType;
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
    
                this.wrapper.style.zIndex = this.currentDOMIndex = 614;
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
            var height = this.height(header);
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
            var height = this.height(footer);
            this.height(this.height() - height);
            footer.style.display = 'none';
            return this;
        },
    
        /**
         * 添加按钮及事件
         * @method addButton
         * @param text
         * @param actionName
         * @param handler
         * @returns {*}
         */
        addButton: function (text, actionName, handler) {
    
            // 模拟重载
            var fnKey = ("jDialog" + Math.random()).replace(/\D/g, '');
            var defaultText = '确定';
            // 如果第一个参数是一个function
            if (jDialog.isFunction(text)) {
                return this.addButton(defaultText, actionName || fnKey, text);
            }
    
            if (jDialog.isFunction(actionName)) {
                return this.addButton(text, fnKey, actionName);
            }
    
            var prefix = this.options.prefix;
            var element = _createElement('a', {
                href: 'javascript:;',
                className: prefix + 'dialog-btn',
                innerHTML: text || defaultText
            });
    
            if (!actionName) {
                actionName = "destory";
            } else {
                jDialog.event.add(actionName, handler);
            }
            element.setAttribute('data-dialog-action', actionName);
    
            var footer = this.getFooter();
            if (this.buttons.length) {
                this.addClass("dialog-btn-primary", element);
                footer.insertBefore(element, footer.childNodes.item(0));
            } else {
                footer.appendChild(element);
            }
            this.buttons.push(element);
    
            return this;
        },
    
        /**
         * 如果保证每个按钮对应队里的action，则可放心移除button
         * @param index
         * @returns {*}
         */
        delButton: function (index) {
            var button = this.getButton(index);
            var actionName;
            if (button) {
                actionName = button.getAttribute('data-dialog-action');
                (actionName != 'destory') && jDialog.event.remove(actionName);
                this.getFooter().removeChild(button);
                var i = this.buttons.indexOf(button);
                this.buttons.splice(i, 1);
            }
            return this;
        },
    
        /**
         *
         * @param index
         * @returns {*}
         */
        getButton: function (index) {
            var buttons = this.buttons.slice().reverse();
            if (buttons[index]) {
                return buttons[index];
            } else {
                return null;
            }
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
            context = context || this.getWrapper();
            if (context.nodeType === 1 && typeof className === 'string') {
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
            context = context || this.getWrapper();
            if (context.nodeType === 1 && typeof className === 'string') {
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
            if (!jDialog.currentDialog) {
                return this;
            }
    
            // 0则自动销毁；
            if (delay == 0) {
                return this.remove();
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
                this.remove();
                clearTimeout(this.autoHideTimer);
                this.autoHideTimer = null;
            }.bind(this), delay * 1000);
    
            return this;
        },
    
        /**
         *
         * @returns {*}
         */
        remove: function () {
            this.toggleLockBody(false);
            if (this.wrapper) {
                this.wrapper.removeEventListener('click', _eventRouter, false);
                doc.body.removeChild(this.wrapper);
            }
            if (this.modal) {
                this.modal.onclick = null;
                doc.body.removeChild(this.modal);
            }
            if (this.autoHideTimer) {
                clearTimeout(this.autoHideTimer);
            }
    
            this.actions = [];
            jDialog.event.root
                = jDialog.currentDialog
                = this.buttons
                = this.container
                = this.footer
                = this.header
                = this.options
                = this.wrapper
                = this.modal
                = null;
    
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
        },
        /**
         *
         * @param url
         * @returns {*}
         */
        iframe: function (url) {
            var self = this;
            var iframeSrc = url || self.options.url;
            var callBack = null;
            if (jDialog.isPlainObject(url)) {
                iframeSrc = url.url;
                callBack = url.callBack;
            }
            if (!jDialog.isUrl(iframeSrc)) {
                return self.content(iframeSrc + '不是一个有效的地址');
            }
            var container = self.getContainer();
            var clientHeight = doc.documentElement.clientHeight;
            var loadingElement = _createElement('div');
            loadingElement.style.cssText = 'height:5px;width:10%;opacity:1;' +
            'margin-bottom:1em;background:#1abc9c;' +
            '-webkit-transition:width ease-in 2s';
            container.appendChild(loadingElement);
            var iframe = _createElement('iframe', {
                width: '100%',
                height: clientHeight
            });
            iframe.frameborder = 0;
            iframe.onload = function () {
                loadingElement.style.width = "100%";
                //loadingElement.style.opacity = 0;
                callBack && callBack.call(self, true);
                iframe.onload = loadingElement = null;
            };
            iframe.onerror = function () {
                self.content('加载' + iframeSrc + '时发生错误');
                iframe.onload = loadingElement = null;
            };
            container.appendChild(iframe);
            iframe.src = iframeSrc;
            return self;
        }
    });

    /* concat from"\src\setting.js" */
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
            this.getHeader().innerHTML = this.options.title = value;
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
            this.getContainer().innerHTML = this.options.content = value;
            return this;
        },
    
        /**
         * 返回当前的height或为dialog设置height
         * @param value
         * @returns {*}
         */
        height: function (value) {
    
            if (value === undefined) {
                return this.height(this.getWrapper());
            }
    
            if (value.nodeType === 1) {
                return value.offsetHeight;
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
                return this.width(this.getWrapper());
            }
    
            if (value.nodeType === 1) {
                return value.offsetWidth;
            }
            jDialog.extend(this.wrapper.style, {
                width: addPixelUnit(value),
                marginLeft: addPixelUnit(-(parseFloat(value) / 2))
            });
            //.width = addPixelUnit(value);
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
            jDialog.extend(this.wrapper.style,{
                top:addPixelUnit(value),
                marginTop:''
            });
            //this.wrapper.style.top = addPixelUnit(value);
            //this.wrapper.style.bottom = '';
            return this;
        },
    
        /**
         * 相对于视口，还是相对于文档流
         * @param isUse
         * @returns {*}
         */
        fixed: function (isUse) {
            var flag = true;
            if (!isUse || (typeof isUse !== "undefined")) {
                flag = false;
                this.getWrapper().style.position = 'absolute';
            }
            return this.verticalInViewPort(flag);
        },
    
        // 为了防止歧义而存在
        absolute: function () {
            return this.fixed(false);
        },
    
        /**
         *
         */
        preventHide: function () {
            this.options.preventHide = true;
            return this;
        }
    });

    /* concat from"\src\components.js" */
    /**
     *  封装一些常用的dialog
     */
    jDialog.extend({
        alert: function (message) {
            return jDialog(message);
        },
        toast: function (message, delay) {
            var dialog = jDialog(message)
                .addClass('dialog-toast');
            var container = dialog.getContainer();
            var height = dialog.height(container);
            dialog.getContainer().style.textAlign = 'center';
            dialog
                .hideFooter()
                .hideHeader()
                .hideModal()
                .height(height)
                .autoHide(delay || 3);
            return dialog;
        },
        error: function (message, callBack) {
            return jDialog(message, callBack).addClass('dialog-error');
        }
    });

    /* concat from"\src\compatibleAMD.js" */
    if (typeof define === "function" && define.amd) {
        define("jdialog", [], function() {
            return jDialog;
        });
    } else {
        win.jDialog = jDialog;
    }

})(window, window.document);

//# sourceMappingURL=jDialog.js.map