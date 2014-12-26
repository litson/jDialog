jDialog.fn.extend({

    /**
     *
     * @returns {{}}
     */
    initEventSystem: function () {
        var self = this;
        var ret = {};

        function add(actionName, handler) {
            if (!self.events.has(actionName)) {
                self.events.actions[actionName] = [];
            }
            if (self.isFunction(handler)) {
                self.events.actions[actionName].push(handler);
            }

        }

        function remove(actionName) {
            if (self.events.has(actionName)) {
                return delete  self.events.actions[actionName];
            }
            console.warn(actionName + '不存在');
            return false;
        }

        function has(actionName) {
            return self.events.actions[actionName] ? true : false;
        }

        ret.actions = {
            destory: [
                function () {
                    self.destory();
                }
            ]
        };
        ret.add = add;
        ret.remove = remove;
        ret.has = has;
        return ret;
    }
});