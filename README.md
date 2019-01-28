# bootstrap
#### Small Node.js helper librarie for applications


### Features
* Service management
  * start/stop/reload
* Eventemitter
  * over multiple processes
  * process local
* Middleware
  * for any function
  * for any module
* Pre/post hooks
  * for any function
  * for any module


### Use case
Your application running in independet services (processes) and communicate over ipc/network with each other.


### How to use
Split your application in individual services, spin them up with our `lib.services.js` module.
In each service `require()` our `lib.events.js` and you can simple pass events between all services/processes.

### Example (services)
##### index.js
```js
const {services} = require("bootstrap");

// where are the services located?
services.folder = "./services";

// fork a service/start them
services.startup("service-1.js");
services.startup("service-2.js");
services.startup("service-3.js");
```


##### services/service-(1-3).js
```js
const {emitter} = require("bootstrap");

emitter.on("event-1", function(){
    console.log("Event - 1, in process:%d", process.pid);
});

setTimeout(function(){
    emitter.emit("event-1");
}, process.pid);
```


### Example (middleware)
```js
const {middlware} = require("bootstrap");
const m = new middleware();

m.use(function (next) {
    setTimeout(function () {

        console.log("use - 1");
        next();

    }, 1000);
});

m.use(function (next) {
    setTimeout(function () {

        console.log("use - 2");
        next();

    }, 1000);
});

m.go(function () {
    console.log("final call");
});
```


### Example (hooks)
```js
const {hooks} = require("bootstrap");

const lib = {
    method: function (cb) {
        console.log("Method in lib");
        cb();
    }
};


const i = new hooks(lib, "method");

i.pre(function (next) {

    console.log("pre");
    next();

});

i.pre(function (next) {

    console.log("pre");
    next();

});

i.post(function (next) {

    console.log("post");
    next();

});

i.post(function (next) {

    console.log("post");
    next();

});

lib.method(function () {
    console.log("method in lib");
});
```

Licensed under: WTFPL