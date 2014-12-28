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
