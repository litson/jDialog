jDialog.fn.extend( {

    hide: function () {
        this.getWrapper().style.display = 'none';
        this.hideModal();
        return this;
    },

    show: function () {
        this.getWrapper().style.display = '';
        this.showModal();
        return this;
    },

    /**
     *  获取dialog的DOM结构
     * @returns {HTMLElement|*|wrapper}
     */
    getWrapper: function () {
        if ( !this.wrapper ) {

            this.wrapper = _createElement( 'div', {
                className: 'dialog'
            } );

            this.wrapper.style.zIndex = this.currentDOMIndex = 614;
        }

        return this.wrapper;
    },

    /**
     *  获取页头的DOM结构
     * @returns {HTMLElement|*|header}
     */
    getHeader: function () {
        return this.header ? this.header : this.header = _createElement( 'div', {
            className: 'dialog-header'
        } );
    },

    /**
     * 隐藏页头
     * @returns {*}
     */
    hideHeader: function () {
        this.getHeader().style.display = 'none';
        return this;
    },

    /**
     * 获取当前dialog内容的DOM结构
     * @returns {HTMLElement|*|container}
     */
    getContainer: function () {
        return this.container ? this.container : this.container = _createElement( 'div', {
            className: 'dialog-body'
        } );
    },

    /**
     * 获取页尾的dom结构
     * @returns {HTMLElement|*|footer}
     */
    getFooter: function () {
        return this.footer ? this.footer : this.footer = _createElement( 'div', {
            className: 'dialog-footer'
        } );
    },

    /**
     * 隐藏页尾
     * @returns {*}
     */
    hideFooter: function () {
        this.getFooter().style.display = 'none';
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
    addButton: function ( text, actionName, handler ) {

        // 模拟重载
        var fnKey = ("jDialog" + Math.random()).replace( /\D/g, '' );

        var defaultText = '确定';

        // 如果第一个参数是一个function
        if ( isFunction( text ) ) {
            return this.addButton( defaultText, actionName || fnKey, text );
        }

        if ( isFunction( actionName ) ) {
            return this.addButton( text, fnKey, actionName );
        }

        var element = _createElement( 'a', {
            href     : 'javascript:;',
            className: 'dialog-btn',
            innerHTML: text || defaultText
        } );

        actionName = actionName || fnKey;

        jDialog.event.add( actionName, handler );

        element.setAttribute( 'data-dialog-action', actionName );

        var footer = this.getFooter();
        footer.appendChild( element );
        this.buttons.push( element );

        return element;
    },
    /**
     * 为当前dialog添加class
     * @param className
     * @returns {*}
     */
    addClass : function ( className, context ) {

        context = context || this.getWrapper();

        if ( context.nodeType === 1 && typeof className === 'string' ) {
            context.classList.add( className );
        }

        return this;
    },

    /**
     * 设置自动隐藏时间
     * @param delay  为0，直接销毁；不设置，采用默认用户设置；
     * @returns {*}
     */
    autoHide: function ( delay ) {

        // 0则自动销毁；
        if ( delay == 0 ) {
            return this.remove();
        }

        //
        if ( delay === undefined ) {
            return this.autoHide( this.options.autoHide );
        }

        // 将会已最新的delay为准
        if ( this.autoHideTimer ) {
            clearTimeout( this.autoHideTimer );
        }

        this.autoHideTimer = setTimeout( function () {
            this.remove();
            clearTimeout( this.autoHideTimer );
            this.autoHideTimer = null;
        }.bind( this ), delay * 1000 );

        return this;
    },

    /**
     *
     * @returns {*}
     */
    remove: function () {

        if ( this.wrapper ) {
            this.wrapper.removeEventListener( 'click', _eventRouter, false );
            this.wrapper.removeEventListener( 'touchstart', _toggleClass, false );
            this.wrapper.removeEventListener( 'touchend', _toggleClass, false );
            doc.body.removeChild( this.wrapper );
        }

        if ( this.modal ) {
            this.modal.onclick = null;
            doc.body.removeChild( this.modal );
        }

        if ( this.autoHideTimer ) {
            clearTimeout( this.autoHideTimer );
        }

        this.buttons.forEach( function ( btn ) {
            jDialog.event.remove( btn.getAttribute( 'data-dialog-action' ) );
        } );

        this.buttons
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
        if ( !this.modal ) {
            this.modal = _createModal( this );
        }
        return this.modal;
    },

    /**
     * 隐藏当前dialog的Modal
     * @returns {*}
     */
    hideModal: function () {
        if ( this.modal ) {
            this.modal.style.display = 'none';
        }
        return this;
    },

    /**
     * 显示当前dialog的Modal
     * @returns {*}
     */
    showModal: function () {
        if ( this.modal ) {
            this.modal.style.display = '';
        }
        return this;
    }
} );
