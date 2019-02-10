/*
// https://eggjs.org/en/core/cluster-and-ipc.html
// https://nodejs.org/dist/latest-v10.x/docs/api/events.html#events_emitter_removelistener_eventname_listener
*/

function Events() {

    var childs = [];
    const self = this;
    this._events = {};

    this._template = {
        origin: process.pid,
        event: null,
        args: null,
        ack: null
    };


    Object.defineProperty(this, "childs", {
        get: function () {
            return childs;
        },
        set: function (arr) {

            childs = arr;

            childs.forEach((child) => {
                child.on("message", (data) => {


                    // process local
                    if (self._events[data.event]) {
                        self._events[data.event].forEach((fnc) => {

                            if (data.ack) {
                                data.args.push(function () {

                                    const args = Array.prototype.slice.call(arguments);
                                    self.emit.apply(self, [data.ack].concat(args));

                                });
                            }

                            // call event listener
                            fnc.apply(data, data.args);

                        }, self);
                    }


                    // "hub" role
                    // broadcast to other childs
                    childs.forEach((sub) => {
                        if (sub.pid !== data.origin) {

                            sub.send(data);

                        }
                    });


                });
            });

        }
    });


    // we are: child
    // wait for messages from master
    process.on("message", (data) => {
        if (self._events[data.event]) {

            self._events[data.event].forEach((fnc) => {
                fnc.apply(data, data.args);
            }, self);

        }
    });

}


Events.prototype.emit = function emit() {

    const args = Array.prototype.slice.call(arguments);
    const event = args.shift();
    const last = args.pop();
    const self = this;

    var data = Object.assign({}, this._template, {
        args: args,
        event: event
    });


    if (last instanceof Function) {

        // symbols should be better
        // serialize to much...
        // @TODO ACK identifiere
        data.ack = Date.now();
        this.on(data.ack, last);

    } else {

        // last argument is no function
        // push it back to array
        args.push(last);

    }


    // we are: local
    // process local
    if (this._events[event]) {
        this._events[event].forEach((fnc) => {

            if (data.ack) {
                args.push(function () {

                    const args = Array.prototype.slice.call(arguments);
                    self.emit.apply(self, [data.ack].concat(args));

                });
            }

            // invoke function
            fnc.apply(data, args);

        }, this);
    }


    // we are: master
    // send to child processes
    this.childs.forEach((child) => {
        child.send(data)
    }, this);


    // we are: child
    // send to master (hub)
    if (process.send) {
        process.send(data);
    }


};


Events.prototype.on = function on(event, cb) {

    if (!this._events[event]) {
        this._events[event] = [];
    }

    this._events[event].push(cb);

};


Events.prototype.once = function once(event, cb) {


    if (!this._events[event]) {
        this._events[event] = [];
    }

    const self = this;
    const wrapper = function wrapper() {

        const args = Array.prototype.slice.call(arguments);
        const index = self._events[event].indexOf(wrapper);

        // remove after wrapper gets called
        self._events[event].splice(index, 1);
        cb.apply(this, args);

    };

    // add event listener
    this._events[event].push(wrapper);

};


Events.prototype.removeListener = function removeListener(event, cb) {
    if (this._events[event]) {

        const index = this._events[event].indexOf(cb);
        this._events[event].splice(index, 1);

    }
};


Events.prototype.removeAllListeners = function removeAllListeners(event) {
    this._events[event] = [];
};



module.exports = Events;