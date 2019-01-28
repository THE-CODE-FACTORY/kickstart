const Middleware = require("./lib.middleware.js");

/**
 * @TODO function arguments
 * @param {} obj 
 * @param {*} method 
 */

function Hooks(obj, name) {

    const self = this;
    this._fnc = obj[name];
    this._pre = new Middleware();
    this._post = new Middleware();
    this._obj = obj;



    this._obj[name] = function () {
        self._pre.go(function () {

            self._fnc(function () {
                self._post.go(function () {

                    // needed?!
                    // i dont think so...
                    //console.log("last post hook");

                });
            });

        });
    };

}




Hooks.prototype.pre = function (cb) {
    this._pre.use(cb);
};

Hooks.prototype.post = function (cb) {
    this._post.use(cb);
};


module.exports = Hooks;


const lib = {
    method: function (cb) {
        console.log("Method in lib");
        cb();
    }
};


const i = new Hooks(lib, "method");

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
