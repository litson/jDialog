/**
 *
 * @param number
 * @returns {*}
 */
var addPixelUnit = function (number) {
    if (!/em|px|rem|pt/gi.test(number)) {
        number = number + 'px';
    }
    return number;
}

jDialog.fn.extend({

    /**
     *
     * @param text
     * @returns {*}
     */
    setTitle: function (text) {
        this.getHeader().innerHTML = text;
        return this;
    },

    /**
     *
     * @param msg
     * @returns {*}
     */
    setMsg: function (msg) {
        this.getContainer().innerHTML = msg;
        return this;
    },

    /**
     *
     * @param value
     * @returns {*}
     */
    setHeight: function (value) {
        this.wrapper.style.height = addPixelUnit(value);
        return this;
    },

    /**
     *
     * @param value
     * @returns {*}
     */
    setWidth: function (value) {
        this.wrapper.style.width = addPixelUnit(value);
        return this;
    },

    /**
     *
     * @param index
     * @returns {*}
     */
    setIndex: function (index) {
        this.currentDOMIndex = index || 9;
        this.wrapper.style.zIndex = this.currentDOMIndex;
        // 永远比wrapper小1
        this.getModal().style.zIndex = this.currentDOMIndex - 1;
        return this;
    },

    /**
     *
     * @param value
     * @returns {*}
     */
    setTop: function (value) {
        this.wrapper.style.top = addPixelUnit(value);
        return this;
    }
});