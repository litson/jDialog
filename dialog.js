!function () {

    var DEFAULT = {
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
    var noop = function () {
    };
    var win = this;
    var doc = win.document;
    var D = function (message, callBack) {
        return new D.fn.init(message, callBack);
    }

    // 基础原形
    D.fn = D.prototype = {
        constructor: D,
        options: DEFAULT,
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
        },
        //
        init: function (message, callBack) {

            if (!message) {
                return this;
            }

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
        },
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
    };

    // 浅copy
    D.fn.extend = function () {

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

    // 借尸还魂
    D.fn.init.prototype = D.fn;

    //其他模块、方法
    D.fn.extend({
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
        eventRouter: function (event) {
            var target = event.target;
            var actionName = target.getAttribute('data-dialog-action');
            if (!actionName) {
                return;
            }
            this.fireEvent(actionName);
        },
        _createElement: function (tagName, attrs) {
            var element = doc.createElement(tagName);
            this.extend(element, attrs);
            return element;
        },
        getHeader: function () {
            if (!this.header) {
                this.header = this._createElement('div', {
                    className: 'dialog-header'
                });
            }
            return this.header;
        },
        getContainer: function () {
            if (!this.container) {
                this.container = this._createElement('div', {
                    className: 'dialog-body'
                });
            }
            return this.container;
        },
        getFooter: function () {
            if (!this.footer) {
                this.footer = this._createElement('div', {
                    className: 'dialog-footer'
                });
            }
            return this.footer;
        },
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
        setTitle: function (text) {
            this.getHeader().innerHTML = text;
            return this;
        },
        setMsg: function (msg) {
            this.getContainer().innerHTML = msg;
            return this;
        },
        setHeight: function (height) {
            if (!/em|px|rem|pt/gi.test(height)) {
                height = height + "px";
            }
            this.wrapper.style.height = height;
            return this;
        },
        setWidth: function (width) {
            if (!/em|px|rem|pt/gi.test(width)) {
                width = width + "px";
            }
            this.wrapper.style.width = width;
            return this;
        },
        setIndex: function (index) {
            this.currentDOMIndex = index || 9;
            this.wrapper.style.zIndex = this.currentDOMIndex;
            return this;
        },
        setTop: function (top) {
            if (!/em|px|rem|pt/gi.test(top)) {
                top = top + "px";
            }
            this.wrapper.style.top = top;
            return this;
        },
        autoHide: function () {
            return this;
        },
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
        destory: function () {
            if (this.wrapper) {
                doc.body.removeChild(this.wrapper);
            }
            if (this.modal) {
                doc.body.removeChild(this.modal);
            }
            this.wrapper.removeEventListener('click', this.eventRouter, false);
            D.currentDialog = null;
            return this;
        },
        createModal: function () {
            var element = this._createElement('div');
            element.style.cssText = ";background:rgba(0,0,0,0.3);width:100%;"
            + "height:100%;position:fixed;left:0;top:0;z-index:"
            + (this.currentDOMIndex - 1);
            element.onclick = function () {
                this.fireEvent('destory');
            }.bind(this);
            doc.body.appendChild(element);
            return element;
        },
        hideModal: function () {
            if (!this.modal) {
                this.modal = this.createModal();
            } else {
                this.modal.style.display = "none";
            }
            return this;
        },
        showModal: function () {
            if (!this.modal) {
                this.modal = this.createModal();
            } else {
                this.modal.style.display = "";
            }
            return this;
        }
    });
    //D.currentDialog;

    this.jDialog = D;

}.call(this);

