const EventEmitter = require("events");

/*
// https://eggjs.org/en/core/cluster-and-ipc.html
// https://nodejs.org/dist/latest-v10.x/docs/api/events.html#events_emitter_removelistener_eventname_listener
*/

function Events() {
    this.childs = [];
    this.emitter = new EventEmitter();
}


Events.prototype.emit = function () {

    // convert <arguments> to array
    const args = Array.prototype.slice.call(arguments);
    const last = args.pop();
    var ack = null;

    if (last instanceof Function) {

        // timestamp
        ack = "ackCb-" + Date.now();

        if (process.send) {

            process.on("message", (data) => {
                if (data.ack === ack) {

                    last.apply(data, data.args);

                }
            });

        } else if (this.childs.length > 0) {


            this.childs.forEach(function (child) {
                if (child.channel && child.connected) {

                    child.on("message", (data) => {
                        if (data.ack === ack) {

                            // call cb with args
                            last.apply(data, data.args)

                        }
                    });

                }
            }, this);

        } else {

            this.emitter.on(ack, function (data) {
                last.apply(data, data.args);
            });

        }
    }

    const data = {
        origin: process.pid,
        event: args.shift(),
        args: args,
        ack
    };


    if (process.send) {

        // we are child
        // send to master        
        process.send(data);

    } else if (this.childs > 0) {

        // me are master
        // send to child

        this.childs.forEach(function (child) {
            if (child.channel && child.connected) {

                // send to workers
                // (we are master)
                child.send(data);

            }
        }, this);

    } else {

        // process local
        // send to our self

        this.emitter.emit.call(this.emitter, data.event, data);

    }

};


Events.prototype.on = function (event, cb) {

    const self = this;

    if (process.send) {

        // we are child
        // listen for messages from master

        process.on("message", (data) => {
            if (data.event === event) {

                // HANDLER FOR ACK CALLBACKS
                (function () {
                    if (data.ack !== null) {
                        data.args.push(function () {

                            console.log("ack called");

                            const args = Array.prototype.slice.call(arguments)

                            // ack function called when done
                            process.send({
                                origin: process.pid,
                                event: data.ack,
                                args: args,
                                ack: data.ack
                            });

                        });
                    }
                })();

                // call cb with args
                cb.apply(data, data.args)

            }
        });

    } else if (this.childs.lenght > 0) {

        // we are master
        // listen for messages from child(s)

        this.childs.forEach(function (child) {
            if (child.channel && child.connected) {

                child.on("message", (data) => {
                    if (data.event === event) {

                        // HANDLER FOR ACK CALLBACK
                        (function () {
                            if (data.ack !== null) {
                                data.args.push(function () {

                                    const args = Array.prototype.slice.call(arguments)

                                    // ack function called when done
                                    process.send({
                                        origin: process.pid,
                                        event: data.ack,
                                        data: args,
                                        ack: data.ack
                                    });

                                });
                            }
                        })();

                        // call cb with args
                        cb.apply(data, data.args)

                    }
                });

            }
        }, this);

    } else {

        this.emitter.on(event, function (data) {

            // HANDLER FOR ACK CALLBACK
            (function () {
                if (data.ack !== null) {
                    data.args.push(function () {


                        const args = Array.prototype.slice.call(arguments);

                        // ack function called when done

                        const ack = {
                            origin: process.pid,
                            event: data.ack,
                            args: args,
                            ack: data.ack
                        }

                        self.emitter.emit.call(self.emitter, ack.ack, ack);

                    });
                }
            })();

            cb.apply(data, data.args);

        });

    }
};


Events.prototype.once = function (event, cb) {
    if (process.send) {

        // we are child
        // listen for messages from master

        var called = false;
        process.on("message", function (data) {
            if (data.event === event && !called) {

                // call cb with args
                cb.apply(data, data.args);
                called = true;

            }
        });

    } else {

        // we are master
        // listen for messages from child(s)

        var called = false;
        this.childs.forEach(function (child) {
            if (child.channel && child.connected) {

                child.on("message", function (data) {
                    if (data.event === event && !called) {

                        // call cb with args
                        cb.apply(data, data.args)
                        called = true;

                    }
                });

            }
        }, this);

    }
};


module.exports = Events;