# kickstart
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

### ToDo's
- API documentation
- Release v1.0.0 (stable)


### Use case
Your application running in independet services (processes) and communicate over ipc/network with each other.


### How to use
Split your application in individual services, spin them up with our `lib.services.js` module.
In each service `require()` our `lib.events.js` and you can simple pass events between all services/processes.


### Example usage
----
(See ```example``` folder for more)

#### Services
##### index.js
```js
const kickstart = require("kickstart");
const services = new kickstart.Service();

// where are the services located?
//services.folder = "./services"; // (default)

// fork a service/start them
services.startup("service-1.js");
services.startup("service-2.js");
services.startup("service-3.js");
```


##### services/service-(1-3).js
```js
const kickstart = require("kickstart");
const events = new kickstart.Events();

events.on("event-1", function(){
    console.log("Event - 1, in process:%d", process.pid);
});

setTimeout(function(){
    events.emit("event-1");
}, process.pid);
```


### Middleware
```js
const kickstart = require("kickstart");
const middleware = new kickstart.Middleware();

middleware.use(function (next) {
    setTimeout(function () {

        console.log("use - 1");
        next();

    }, 1000);
});

middleware.use(function (next) {
    setTimeout(function () {

        console.log("use - 2");
        next();

    }, 1000);
});

middleware.start(function () {
    console.log("final call");
});
```


### Hooks
```js
const kickstart = require("kickstart");

const lib = {
    method: function (cb) {
        console.log("Method in lib");
        cb();
    }
};


const hook = new kickstart.Hooks(lib, "method");

hook.pre(function (next) {

    console.log("pre");
    next();

});

hook.pre(function (next) {

    console.log("pre");
    next();

});

hook.post(function (next) {

    console.log("post");
    next();

});

hook.post(function (next) {

    console.log("post");
    next();

});

lib.method(function () {
    console.log("method in lib");
});
```

Licensed under: MIT