// https://gist.github.com/darrenscerri/5c3b3dcbe4d370435cfa

/**
 * @TODO function arguments
 */

function Middleware() {

};

Middleware.prototype.use = function (fn) {
    var self = this;

    this.go = (function (stack) {
        return function (next) {
            stack.call(self, function () {
                fn.call(self, next.bind(self));
            });
        }.bind(this);
    })(this.go);
};

Middleware.prototype.go = function (next) {
    next();
};



/*
const m = new Middleware();

m.use(function (next) {
    setTimeout(function () {

        console.log("use - 1");
        next();

    }, 1000);
});

m.use(function (next) {
    setTimeout(function () {

        console.log("use - 2");
        next();

    }, 1000);
});

m.go(function () {
    console.log("Finla call");
});*/

module.exports = Middleware;