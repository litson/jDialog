jDialog.fn.extend({
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