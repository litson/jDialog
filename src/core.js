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