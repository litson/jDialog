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
