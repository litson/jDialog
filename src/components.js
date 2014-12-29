/**
 *  封装一些常用的dialog
 */
jDialog.extend({
    alert: function (message) {
        return jDialog(message);
    },
    toast: function (message, delay) {
        var dialog = jDialog(message);
        dialog.getContainer().style.textAlign = "center";
        dialog
            .hideFooter()
            .hideHeader()
            .hideModal()
            .addClass('dialog-toast')
            .autoHide(delay || 3);
        return dialog;
    },
    error: function (message, callBack) {
        return jDialog(message,callBack).addClass('dialog-error');
    }
});