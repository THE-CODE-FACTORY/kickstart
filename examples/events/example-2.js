const Events = require("../../lib.events.js");
const emitter = new Events();


emitter.on("acknowledge", function (data, cb) {

    // excpeted data = {super: "data"}
    console.log("ack event", data);

    // modifie & send back
    data.valid = true;
    cb(data);

});


emitter.emit("acknowledge", { super: "data" }, function (data) {

    // arguments[0] = {super: false}
    console.log("Confirmed.", data);

});