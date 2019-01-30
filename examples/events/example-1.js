const Events = require("../../lib.events.js");
const emitter = new Events();


emitter.on("timestamp", function (timestamp) {
    console.log("Timestamp received: %s, from", timestamp, this.origin);
});


setInterval(function () {
    emitter.emit("timestamp", Date.now())
}, 1000);