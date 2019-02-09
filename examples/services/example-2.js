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

emitter.on("ACK-EVENT", function (data, cb) {

    // feedback
    console.log("ACK-EVENT, from master:", data);

    // modifie data
    data.dummy = false;

    // send back
    cb("seen @ " + Date.now(), data);

});