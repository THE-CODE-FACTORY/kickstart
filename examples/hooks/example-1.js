const Hooks = require("../../lib.hooks.js");



const lib = {
    "super": function (dat, cb) {

        console.log("in lib.super()", dat);
        setTimeout(function () {

            console.log("in lib.super, call cb");
            cb(null, { data: false, query: "* FROM users WHERE ID=..." });

        }, 1000);

    }
};



const hook = new Hooks(lib, "super");


hook.pre(function (obj, next) {
    console.log("pre, 1", obj);
    obj.file = "/path/nope......";
    next();
    //setTimeout(next, 1000);
});

hook.pre(function (obj, next) {
    console.log("pre, 2", obj);
    next();
    //setTimeout(next, 1000);
});

hook.post(function (err, result, next) {
    result.data = true;
    console.log("post, 1");
    next();
    //setTimeout(next, 1000);
});

hook.post(function (err, result, next) {
    console.log("post, 2");
    next();
    //setTimeout(next, 1000);
});





lib.super({
    file: "/temp/file/folder/dat.inc",
    blob: Buffer.alloc(255)
}, function (err, result) {

    console.log("final call", err, result)

});