/**
 *  设置函数集
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
        if (typeof value === 'undefined') {
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
    content: function (value) {
        if (typeof value === 'undefined') {
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
    height: function (value) {

        if (typeof value === 'undefined') {
            return this.height(this.getWrapper());
        }

        if (value.nodeType === 1) {
            return value.offsetHeight;
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
        if (typeof value === 'undefined') {
            return this.width(this.getWrapper());
        }

        if (value.nodeType === 1) {
            return value.offsetWidth;
        }

        jDialog.extend(this.wrapper.style, {
            width: addPixelUnit(value),
            marginLeft: addPixelUnit(-(parseFloat(value) / 2))
        });

        return this;
    },

    /**
     * 返回当前的z-index值或为dialog设置z-index
     * @param index
     * @returns {*}
     */
    index: function (value) {
        if (typeof value === 'undefined') {
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

        if (typeof value === 'undefined') {
            return win.getComputedStyle(this.getWrapper()).top;
        }

        jDialog.extend(this.wrapper.style, {
            top: addPixelUnit(value),
            marginTop: ''
        });

        return this;
    },

    /**
     * 相对于视口，还是相对于文档流
     * @param isUse
     * @returns {*}
     */
    fixed: function (isUse) {
        var flag = true;
        if (!isUse || (typeof isUse !== "undefined")) {
            flag = false;
            this.getWrapper().style.position = 'absolute';
        }
        return this.verticalInViewPort(flag);
    },

    /**
     *
     * @returns {preventHide}
     */
    preventHide: function () {
        this.options.preventHide = true;
        return this;
    }
});
