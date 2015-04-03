
jDialog.event = {
    actions: {},
    add: function (actionName, handler) {
        
        if (isFunction(handler)) {
            this.actions[actionName] = handler;
        }
        
        // if (!this.has(actionName)) {
        //     this.actions[actionName] = [];
        // }
        // if (isFunction(handler)) {
        //     this.actions[actionName].push(handler);
        // }
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
    fire: function (actionName, target) {
        if (this.has(actionName)) {
            
            this.actions[actionName].call(jDialog.currentDialog || jDialog(), target);
            
            // var actions = this.actions[actionName];
            // var length = actions.length;
            // if (length) {
            //     var i = 0;
            //     for (; i < length; i++) {
            //         actions[i].call(jDialog.currentDialog || jDialog(), target);
            //     }
            // }
        }
        return this;
    }
};
