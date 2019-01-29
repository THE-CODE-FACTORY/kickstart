// @FIXME RangeError: Maximum call stack size exceeded
// weil kein timeout zwischne calls, args.pop not working -> recursiv call
// see /examples/example-1.js for workaround (setTimeout)
// @TODO improve args handling

function Middleware() {
    this.args = [];
};


Middleware.prototype.use = function (fn) {


    var self = this;

    this.go = (function (stack) {
        return function (next) {

            stack.call(self, function () {

                const args = self.args;
                args.push(next.bind(self));


                fn.apply(self, args);
                args.pop(); // --> ohne delay stack overflow, da zu langsam!?! -> !

            });

        }.bind(this);
    })(this.go);

};


Middleware.prototype.go = function (next) {
    next();
};


Middleware.prototype.start = function () {

    const self = this;

    const args = Array.prototype.slice.call(arguments);
    const final = args.pop();
    this.args = args;


    this.go(function () {
        final.apply(self, self.args);
    });

};


module.exports = Middleware;