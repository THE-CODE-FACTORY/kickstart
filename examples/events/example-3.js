
const kickstart = require("../../index.js");
const events = new kickstart.Events();


/**
 * Intercept event emitter
 * register events.on as middleware
 * execute middleware when events.emit get called
 */
events.emit = function () {

    // create middleware for event
    const middleware = new kickstart.Middleware();

    // create argument array & get event
    const args = Array.prototype.slice.call(arguments);
    const event = args.shift();

    // attach event listener as middleware
    if (this._events[event]) {
        this._events[event].forEach(function (cb) {
            middleware.use(cb);
        });
    }

    // start middleware
    middleware.start.apply(middleware, args);

};



events.on("startup", function (obj, next) {
    console.log("startup - 1", obj);
    obj.success = false;
    setTimeout(next, 1000);
});


events.on("startup", function (obj, next) {
    console.log("startup - 2", obj);
    obj.date = Date.now();
    setTimeout(next, 2000);
});


events.on("startup", function (obj, next) {
    console.log("startup - 3", obj);
    next();
});


setTimeout(function () {
    events.emit("startup", { date: Date.now() }, function (obj) {

        // obj = same as first argument
        console.log("Startup middleware finish");

    });
}, 1000);