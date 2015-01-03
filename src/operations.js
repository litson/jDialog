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

    if (options.url) {
        self.iframe(options.url);

    } else {
        self.content(options.content);

    }

    self.addButton('取消', 'destory', function() {
        self.destory();
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
    element.style.cssText = ';background:rgba(0,0,0,0.3);width:100%;' + 'height:100%;position:fixed;left:0;top:0;z-index:' + (self.currentDOMIndex - 1);
    element.onclick = function() {
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
    verticalInViewPort: function(useFixed) {
        var docElement = doc.documentElement;
        var clientHeight = docElement.clientHeight;
        var dialogHeight = this.height();

        if (useFixed) {

            if (dialogHeight > clientHeight) {
                dialogHeight = clientHeight - 30;
                this.getContainer().style.height =
                    dialogHeight - (this.height(this.getHeader()) + this.height(this.getFooter())) + 'px';
            }
            this.height(dialogHeight)
                .toggleLockBody(true)
                .extend(this.getWrapper().style, {
                    position: 'fixed',
                    bottom: 0,
                    top: 0
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
    toggleLockBody: function(useLock) {
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
    getWrapper: function() {
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
    getHeader: function() {
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
    hideHeader: function() {
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
    getContainer: function() {
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
    getFooter: function() {
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
    hideFooter: function() {
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
    addButton: function(text, actionName, handler) {
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

    // 如果保证每个按钮对应队里的action，则可放心移除button
    delButton: function(index) {
        var button = this.getButton(index);
        var actionName;
        if (button) {
            actionName = button.getAttribute('data-dialog-action');
            jDialog.event.remove(actionName);
            this.getFooter().removeChild(button);
            var i = this.buttons.indexOf(button);
            this.buttons.splice(i, 1);
        }
        return this;
    },

    getButton: function(index) {
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
    addClass: function(className, context) {
        // 自动补齐前缀
        //var prefix = this.options.prefix;
        //var reg = new RegExp('^' + prefix, 'gi');
        //if (!reg.test(className)) {
        //    className = prefix + className;
        //}
        var context = context || this.getWrapper();
        if (context.nodeType === 1 && typeof className === 'string') {
            context.classList.add(className);
        }
        return this;
    },

    /**
     * 为当前dialog添加remove
     * @param className
     */
    removeClass: function(className, context) {
        //var prefix = this.options.prefix;
        //var reg = new RegExp('^' + prefix, 'gi');
        //if (!reg.test(className)) {
        //    className = prefix + className;
        //}
        var context = context || this.getWrapper();
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
    autoHide: function(delay) {
        if (!jDialog.currentDialog) {
            return this;
        }

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

        this.autoHideTimer = setTimeout(function() {
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
    destory: function() {
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
        this.toggleLockBody(false);
        this.actions = [];
        jDialog.event.root = jDialog.currentDialog = null;
        return this;
    },

    /**
     * 获取当前dialog的Modal的DOM结构
     * @returns {modal|*}
     */
    getModal: function() {
        if (!this.modal) {
            this.modal = _createModal(this);
        }
        return this.modal;
    },

    /**
     * 隐藏当前dialog的Modal
     * @returns {*}
     */
    hideModal: function() {
        this.getModal().style.display = 'none';
        return this;
    },

    /**
     * 显示当前dialog的Modal
     * @returns {*}
     */
    showModal: function() {
        this.getModal().style.display = '';
        return this;
    },
    iframe: function(url) {
        var self = this;
        var url = url || self.options.url;
        if (!jDialog.isUrl(url)) {
            return self.content(url + '不是一个有效的地址');
        }

        var container = self.getContainer();
        var clientHeight = doc.documentElement.clientHeight;


        container.style.position = 'relative';
        this.content('<div ' +
            'style="text-align: center;background-color: rgba(255,255,255,0.5);' +
            'position:absolute;' +
            'left:0;top:0;width:100%;height:100%">' +
            'loading...</div>');

        var iframe = _createElement('iframe', {
            frameborder: 0,
            width: '100%',
            height: clientHeight
        });

        iframe.onload = function() {
            var parent = this.parentNode;
            var loadingElement = parent.getElementsByTagName('div')[0];
            parent.removeChild(loadingElement);
            iframe.onload = null;
        }
        iframe.onerror = function() {
            // ,<a href="#nogo" onclick="">重新加载</a>
            self.content('加载' + url + '时发生错误');
            iframe.onerror = null;
        }

        container.appendChild(iframe);
        iframe.src = url;
        return self;
    }
});
