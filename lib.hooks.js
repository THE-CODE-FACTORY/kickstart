const Middleware = require("./lib.middleware.js");

// @TODO fix in lib.middleware.js args handling
// @TODO improve argument handling (like middleware)


function Hooks(obj, method) {

    const self = this;

    this._fnc = obj[method];
    this._pre = new Middleware();
    this._post = new Middleware();

    // 1) original method calles
    // 2) pre hook stack execute
    // 3) method is called from us
    // 4) callback from original called
    // 5) execute post stack
    // 6) run callback

    obj[method] = function () {

        const args = Array.prototype.slice.call(arguments);
        const done = args.pop();

        args.push(function () {

            const args = Array.prototype.slice.call(arguments);
            args.push(function () {


                const args = Array.prototype.slice.call(arguments);
                args.push(function () {

                    const args = Array.prototype.slice.call(arguments);
                    done.apply(lib, args);

                });

                self._post.start.apply(self._post, args)
                args.pop();


            });

            self._fnc.apply(lib, args);
            args.pop();

        });


        // execute pre stack
        self._pre.start.apply(self._pre, args);
        args.pop();

    };

}


Hooks.prototype.pre = function (cb) {
    this._pre.use(cb);
};

Hooks.prototype.post = function (cb) {
    this._post.use(cb);
};




//////////////////////////
/*
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
    setTimeout(next, 1000);
});

hook.pre(function (obj, next) {
    console.log("pre, 2", obj);
    setTimeout(next, 1000);
});

hook.post(function (err, result, next) {
    result.data = true;
    console.log("post, 1");
    setTimeout(next, 1000);
});

hook.post(function (err, result, next) {
    console.log("post, 2");
    setTimeout(next, 1000);
});



lib.super({
    file: "/temp/file/folder/dat.inc"
}, function (err, result) {

    console.log("final call", err, result)

});*/