/**
 *
 * @type {{add: Function, remove: Function, has: Function, fire: Function}}
 */
jDialog.event = {
    add: function (actionName, handler) {
        var self = this.root;
        if (!this.has(actionName)) {
            self.actions[actionName] = [];
        }
        if (jDialog.isFunction(handler)) {
            self.actions[actionName].push(handler);
        }
    },
    remove: function (actionName) {
        var self = this.root;
        if (this.has(actionName)) {
            return delete self.actions[actionName];
        }
        console.warn(actionName + '不存在');
        return false;
    },
    has: function (actionName) {
        var self = this.root;
        if (self.constructor != jDialog
            || typeof actionName !== 'string'
            || !self.actions[actionName]) {
            return false;
        }
        return true;
    },
    fire: function (actionName) {
        var self = this.root;
        if (this.has(actionName)) {
            var actions = self.actions[actionName];
            var length = actions.length;
            if (!length) {
                return false;
            }
            var i = 0;
            for (; i < length; i++) {
                actions[i].call(self);
            }
        }
    }
};