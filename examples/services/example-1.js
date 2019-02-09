const kickstart = require("../../index.js");
const kickstart = require("../../index.js");
const services = new kickstart.Services();
const emitter = new kickstart.Events();


// startup our services
// display child process pid
["1", "2", "3"].forEach((name) => {

    const child = services.startup(name);
    //console.log("Service %d forked", child.pid);

});


// "tell" event emitter we ware master
emitter.childs = Object.values(services.childs);


emitter.once("hello", function (message) {
    console.log("[MASTER] Service with lowest PID: %d (%s)", this.origin, message);
});


emitter.on("hello", function (message) {
    console.log("[MASTER] Hello From Service %d (%s)", this.origin, message);
});