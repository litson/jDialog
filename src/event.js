/**
 *
 * @type {{add: Function, remove: Function, has: Function, fire: Function}}
 */
jDialog.event = {
    getRoot: function() {
        return this.root || jDialog.currentDialog || jDialog();
    },
    add: function(actionName, handler) {
        var root = this.getRoot();
        if (!this.has(actionName)) {
            root.actions[actionName] = [];
        }
        if (jDialog.isFunction(handler)) {
            root.actions[actionName].push(handler);
        }
        return this;
    },
    remove: function(actionName) {
        var root = this.getRoot();
        if (this.has(actionName)) {
            return delete root.actions[actionName];
        }
        console.warn(actionName + '不存在');
        return false;
    },
    has: function(actionName) {
        var root = this.getRoot();
        if (typeof actionName !== 'string' || !root.actions[actionName]) {
            return false;
        }
        return true;
    },
    once: function(actionName) {
        if (this.has(actionName)) {
            this.fire(actionName)
                .remove(actionName);
        }

        return this;
    },
    fire: function(actionName) {
        var root = this.getRoot();
        if (this.has(actionName)) {
            var actions = root.actions[actionName];
            var length = actions.length;
            if (length) {
                var i = 0;
                for (; i < length; i++) {
                    actions[i].call(root);
                }
            }
        }
        return this;
    }
};
