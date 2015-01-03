if (typeof define === "function" && define.amd) {
    define("jdialog", [], function() {
        return jDialog;
    });
} else {
    win.jDialog = jDialog;
}
