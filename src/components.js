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
