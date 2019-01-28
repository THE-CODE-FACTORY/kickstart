/*

// https://eggjs.org/en/core/cluster-and-ipc.html
// https://nodejs.org/dist/latest-v10.x/docs/api/events.html#events_emitter_removelistener_eventname_listener

@TODO local emit ?! same process


@TODO add function as parameter -> called 
-> stringyfi function body -> call/eval in events.on(function(data, fnc){
    // strinified function = fnc
    fnc();
})

*/

function Events() {
    this.childs = [];
}


Events.prototype.emit = function () {

    // convert <arguments> to array
    const args = Array.prototype.slice.call(arguments);

    const data = {
        origin: process.pid,
        event: args.shift(),
        data: args
    };

    if (process.send) {

        // we are child
        // send to master        

        process.send(data);

    } else {

        // me are master
        // send to child

        this.childs.forEach(function (child) {
            if (child.channel && child.connected) {

                // send to workers
                // (we are master)
                child.send(data);

            }
        }, this);

    }

};


Events.prototype.on = function (event, cb) {
    if (process.send) {

        // we are child
        // listen for messages from master

        process.on("message", (data) => {
            if (data.event === event) {

                // call cb with args
                cb.apply(data, data.args)

            }
        });

    } else {

        // we are master
        // listen for messages from child(s)

        this.childs.forEach(function (child) {
            if (child.channel && child.connected) {

                child.on("message", (data) => {
                    if (data.event === event) {

                        // call cb with args
                        cb.apply(data, data.args)

                    }
                });

            }
        }, this);

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