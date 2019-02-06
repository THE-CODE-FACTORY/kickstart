const kickstart = require("../../../index.js");
const events = new kickstart.Events();

// feddback
console.log("Service/child forked %d", process.pid);

// pass some time after startup
setTimeout(function () {

    events.emit("hello", "Greetings");

}, process.pid);


events.on("hello", function (message) {
    console.log("[service - 2] We are %d, message from", process.pid, this.origin);
});