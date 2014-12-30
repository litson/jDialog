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
    var content;
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
