jDialog.fn.extend({
    setTitle: function (text) {
        this.getHeader().innerHTML = text;
        return this;
    },
    setMsg: function (msg) {
        this.getContainer().innerHTML = msg;
        return this;
    },
    setHeight: function (height) {
        if (!/em|px|rem|pt/gi.test(height)) {
            height = height + "px";
        }
        this.wrapper.style.height = height;
        return this;
    },
    setWidth: function (width) {
        if (!/em|px|rem|pt/gi.test(width)) {
            width = width + "px";
        }
        this.wrapper.style.width = width;
        return this;
    },
    setIndex: function (index) {
        this.currentDOMIndex = index || 9;
        this.wrapper.style.zIndex = this.currentDOMIndex;
        return this;
    },
    setTop: function (top) {
        if (!/em|px|rem|pt/gi.test(top)) {
            top = top + "px";
        }
        this.wrapper.style.top = top;
        return this;
    },
});