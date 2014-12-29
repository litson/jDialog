/**
 *  设置类函数集
 * @param number
 * @returns {*}
 */
var addPixelUnit = function (number) {
    if (!/em|px|rem|pt|%|auto/gi.test(number)) {
        number = number + 'px';
    }
    return number;
};

jDialog.fn.extend({

    /**
     * 返回当前的title或为dialog设置title
     * @param text
     * @returns {*}
     */
    title: function (value) {
        if (value === undefined) {
            return this.options.title;
        }
        this.getHeader().innerHTML = value;
        return this;
    },

    /**
     * 返回当前设置的message或设置message
     * @param value
     * @returns {*}
     */
    message: function (value) {
        if (value === undefined) {
            return this.options.msg;
        }
        this.getContainer().innerHTML = value;
        return this;
    },

    /**
     * 返回当前的height或为dialog设置height
     * @param value
     * @returns {*}
     */
    height: function (value) {
        if (value === undefined) {
            return this.getWrapper().offsetHeight;
        }
        this.wrapper.style.height = addPixelUnit(value);
        return this;
    },

    /**
     * 返回当前dialog的宽度或为dialog设置宽度
     * @param value
     * @returns {*}
     */
    width: function (value) {
        if (value === undefined) {
            return this.getWrapper().offsetWidth;
        }
        this.wrapper.style.width = addPixelUnit(value);
        return this;
    },

    /**
     * 返回当前的z-index值或为dialog设置z-index
     * @param index
     * @returns {*}
     */
    index: function (value) {
        if (value === undefined) {
            return this.currentDOMIndex;
        }
        this.currentDOMIndex = value;
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
    top: function (value) {
        if (value === undefined) {
            return win.getComputedStyle(this.getWrapper()).top;
        }
        this.wrapper.style.top = addPixelUnit(value);
        this.wrapper.style.bottom = "";
        return this;
    },

    /**
     * 相对于视口，还是相对于文档流
     * @param useAbsolute
     * @returns {*}
     */
    fixed: function (useAbsolute) {
        if (!useAbsolute) {
            this.getWrapper().style.position = "fixed";
        } else {
            this.getWrapper().style.position = "absolute";
        }
        this.verticalInViewPort(!useAbsolute);
        return this;
    }
});