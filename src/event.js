jDialog.event = {
    actions: {},
    add: function (actionName, handler) {

        if (isFunction(handler)) {
            this.actions[actionName] = handler;
        }

        return this;
    },
    remove: function (actionName) {
        if (this.has(actionName)) {
            return delete this.actions[actionName];
        }
        console.warn(actionName + '不存在');
        return false;
    },
    has: function (actionName) {
        if (typeof actionName !== 'string' || !this.actions[actionName]) {
            return false;
        }
        return true;
    },
    once: function (actionName) {
        if (this.has(actionName)) {
            this.fire(actionName)
                .remove(actionName);
        }
        return this;
    },
    fire: function (actionName, context) {
        if (this.has(actionName)) {
            this.actions[actionName].call(context || win);
        }
        return this;
    }
};
