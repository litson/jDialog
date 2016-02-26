/* 
https://github.com/litson/jDialog 
 */
;(function (window, document) {


    /* concat from"\src\core.js" */
    var win     = window;
    var doc     = document;
    var version = '1.1.0';
    var jDialog = function ( message, callBack ) {
        return new jDialog.fn.init( message, callBack );
    };
    
    jDialog.fn = jDialog.prototype = {
        constructor: jDialog,
    
        init: function ( message, callBack ) {
    
            this.options = {
                title      : '提示', // title
                modal      : true, //是否启用模式窗口
                content    : '', // messages
                autoHide   : 0, // 自动销毁
                fixed      : true,
                preventHide: false,
                callBack   : null
            };
    
            this.buttons = [];
    
            if ( isPlainObject( message ) ) {
                jDialog.extend( this.options, message );
    
            } else if ( /string|number|boolean/gi.test( typeof(message) ) ) {
                this.options.content = message;
                if ( isFunction( callBack ) ) {
                    this.options.callBack = callBack;
                }
            } else {
                return this;
            }
    
            return _renderDOM( this );
        }
    };
    
    jDialog.extend = jDialog.fn.extend = function () {
    
        var target  = arguments[0] || {};
        var options = arguments[1] || {};
        var name;
        var copy;
    
        if ( arguments.length === 1 ) {
            target  = this;
            options = arguments[0];
        }
    
        for ( name in options ) {
            copy = options[name];
            if ( copy !== undefined ) {
                target[name] = copy;
            }
        }
    
        return target;
    };
    
    jDialog.fn.init.prototype = jDialog.fn;
    
    /**
     *
     * @param jDialog
     * @private
     */
    function _renderDOM( jDialog ) {
        var self    = jDialog;
        var wrapper = self.getWrapper();
        var options = self.options;
    
        wrapper.appendChild( self.getHeader() );
        wrapper.appendChild( self.getContainer() );
        wrapper.appendChild( self.getFooter() );
    
        self.title( options.title );
        self.content( options.content );
        self.top( '10%' );
    
        self.addButton( '取消', function () {
            self.remove();
        } );
    
        //
        if ( options.modal ) {
            self.getModal();
        }
    
        //
        if ( options.fixed ) {
            wrapper.style.position = 'fixed';
        }
    
        //
        if ( options.autoHide ) {
            self.autoHide( options.autoHide );
        }
    
        //
        if ( options.callBack ) {
            self.addButton( '确定', options.callBack );
        }
    
        wrapper.addEventListener( 'click', _eventRouter, false );
        wrapper.addEventListener( 'touchstart', _toggleClass, false );
        wrapper.addEventListener( 'touchend', _toggleClass, false );
    
        doc.body.appendChild( wrapper );
    
        setTimeout( function () {
            self.addClass( 'dialog-zoom-in' );
        }, 50 );
    
        return self;
    }
    
    function _createElement( tagName, attrs ) {
        var element = doc.createElement( tagName );
        jDialog.extend( element, attrs );
        return element;
    }
    
    function _eventRouter( event ) {
        var target     = event.target;
        var actionName = target.getAttribute( 'data-dialog-action' );
        if ( !actionName ) {
            return;
        }
        jDialog.event.fire( actionName, target );
    }
    
    function _toggleClass( event ) {
        var target     = event.target;
        var actionName = target.getAttribute( 'data-dialog-action' );
        if ( !actionName ) {
            return;
        }
        target.classList.toggle( 'active' );
    }
    
    function _createModal( context ) {
        var element = _createElement( 'div' );
    
        element.style.cssText =
            ';background:rgba(0,0,0,0.3);width:100%;'
            + 'position:fixed;left:0;top:0;'
            + 'height:100%;z-index:'
            + (context.currentDOMIndex - 1);
    
        element.onclick = function () {
            if ( !context.options.preventHide ) {
                context.remove();
            }
        };
    
        return doc.body.appendChild( element );
    }
    
    win.jDialog = jDialog;

    /* concat from"\src\helper.js" */
    /**
     *
     * @param fn
     * @returns {boolean}
     */
    function isFunction( fn ) {
        return Object.prototype.toString.call( fn ) === '[object Function]';
    }
    
    /**
     *
     * @param obj
     * @returns {boolean}
     */
    function isPlainObject( obj ) {
        if ( obj === null || obj === undefined ) {
            return false;
        }
        return obj.constructor == {}.constructor;
    }

    /* concat from"\src\event.js" */
    jDialog.event = {
        actions: {},
        add    : function ( actionName, handler ) {
            this.actions[actionName] = handler;
            return this;
        },
        remove : function ( actionName ) {
            return delete this.actions[actionName];
        },
        has    : function ( actionName ) {
            return !!this.actions[actionName];
        },
        once   : function ( actionName ) {
            return this.has( actionName )
                && this.fire( actionName ).remove( actionName );
        },
        fire   : function ( actionName, context ) {
            this.has( actionName ) && this.actions[actionName].call( context || win );
            return this;
        }
    };

    /* concat from"\src\operations.js" */
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

    /* concat from"\src\setting.js" */
    /**
     *  设置函数集
     * @param number
     * @returns {*}
     */
    var addPixelUnit = function ( number ) {
        if ( !/em|px|rem|pt|%|auto/gi.test( number ) ) {
            number = number + 'px';
        }
        return number;
    };
    
    jDialog.fn.extend( {
    
        /**
         * 返回当前的title或为dialog设置title
         * @param text
         * @returns {*}
         */
        title: function ( value ) {
            if ( typeof value === 'undefined' ) {
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
        content: function ( value ) {
            if ( typeof value === 'undefined' ) {
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
        height: function ( value ) {
    
            if ( typeof value === 'undefined' ) {
                return this.height( this.getWrapper() );
            }
    
            if ( value.nodeType === 1 ) {
                return value.offsetHeight;
            }
    
            this.wrapper.style.height = addPixelUnit( value );
            return this;
        },
    
        /**
         * 返回当前dialog的宽度或为dialog设置宽度
         * @param value
         * @returns {*}
         */
        width: function ( value ) {
            if ( typeof value === 'undefined' ) {
                return this.width( this.getWrapper() );
            }
    
            if ( value.nodeType === 1 ) {
                return value.offsetWidth;
            }
    
            jDialog.extend( this.wrapper.style, {
                width     : addPixelUnit( value ),
                marginLeft: addPixelUnit( -(parseFloat( value ) / 2) )
            } );
    
            return this;
        },
    
        /**
         * 返回当前的z-index值或为dialog设置z-index
         * @param index
         * @returns {*}
         */
        index: function ( value ) {
            if ( typeof value === 'undefined' ) {
                return this.currentDOMIndex;
            }
            this.currentDOMIndex      = value;
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
        top: function ( value ) {
    
            if ( typeof value === 'undefined' ) {
                return win.getComputedStyle( this.getWrapper() ).top;
            }
    
            jDialog.extend( this.wrapper.style, {
                top      : addPixelUnit( value ),
                marginTop: ''
            } );
    
            return this;
        },
    
        /**
         *
         * @returns {preventHide}
         */
        preventHide: function () {
            this.options.preventHide = true;
            return this;
        }
    } );

    /* concat from"\src\components.js" */
    jDialog.extend( {
        toast: function ( message, delay ) {
            var dialog = jDialog( {
                content: message,
                modal:false
            } ).addClass( 'dialog-toast' );
    
            var container = dialog.getContainer();
            var height    = dialog.height( container );
    
            dialog.getContainer().style.textAlign = 'center';
    
            dialog
                .hideFooter()
                .hideHeader()
                .height( height )
                .autoHide( delay || 3 );
    
            return dialog;
        }
    } );

})(window, window.document);
