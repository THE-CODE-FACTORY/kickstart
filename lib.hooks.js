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

        // get arguments passed to lib.method(...args)
        // pop callback function from arguments
        var args = Array.prototype.slice.call(arguments);
        const done = args.pop();

        const pre = self._pre.start;
        const post = self._post.start;


        // does not work beacuse args = const
        args = [].concat(args, [function () {


            // get arguments passed to 
            // @NOTE, needed?!
            // args = original args (scope drüber)
            var args = Array.prototype.slice.call(arguments);


            // create args array to apply
            // with custom callback as last argument
            args = [].concat(args, [function () {


                var args = Array.prototype.slice.call(arguments);
                args = [].concat(args, [function () {

                    const args = Array.prototype.slice.call(arguments);
                    done.apply(obj, args);

                }]);


                // execute post stack
                // after original function has called
                post.apply(self._post, args);


            }]);


            // execute original function
            // with (or without) modified arguments from pre stack
            self._fnc.apply(obj, args);


        }]);


        // execute pre stack
        pre.apply(self._pre, args);

    };

}


Hooks.prototype.pre = function (cb) {
    this._pre.use(cb);
};

Hooks.prototype.post = function (cb) {
    this._post.use(cb);
};

module.exports = Hooks;