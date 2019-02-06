const child = require("child_process");
const path = require("path");

function Services() {
    this.folder = "./services";
    this.childs = {};
};


//
// https://stackoverflow.com/questions/10021373/what-is-the-windows-equivalent-of-process-onsigint-in-node-js
// @TODO start/stopped events -> inherit eventemitter
//


Services.prototype.startup = function (name) {
    if (this.childs[name]) {

        // process allready running
        // do nothing, perhaps do something here
        // or not, or?, perhaps. just perhaps...

    } else {

        // pass the service name as args
        // process.argv[2]; = service name

        const location = path.resolve(this.folder, `service.${name}.js`);
        const forked = this.childs[name] = child.fork(location, [name]);


        forked.on("exit", function (code) {
            if (forked.killed) {

                // shutdown called on process
                // assume we want that the process should exit

            } else {

                // process exited 
                // job done or crashed?!

            }
        });


        return forked;

    }
};


Services.prototype.shutdown = function (name, signal, cb) {

    if (signal instanceof Function && !cb) {
        cb = signal;
        signal = null;
    }

    if (this.childs[name] && this.childs[name].connected) {

        const process = this.childs[name];

        process.on("exit", function (code) {



        });

        // send STRG+C (gracefull shutdown)
        process.kill(signal || "SIGINT");

    } else {

        // clean up
        // in case the process is disconnected
        delete this.childs[name];

    }

};


module.exports = Services;