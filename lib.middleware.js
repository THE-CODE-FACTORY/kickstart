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

                const args = self.args;
                args.push(next.bind(self));

                fn.apply(self, args);
                args.pop();

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


/*
const m = new Middleware();

m.use(function (obj, next) {
    setTimeout(function () {

        console.log("use - 1", obj);
        obj.hello = "node";

        next();

    }, 1000);
});


m.use(function (obj, next) {
    setTimeout(function () {

        console.log("use - 2", obj);
        obj.string = "Hello World";
        next();

    }, 1000);
});

m.use(function (obj, next) {
    setTimeout(function () {

        console.log("use - 3", obj);
        obj.arr = Array;
        next();

    }, 1000);
});


m.use(function (obj, next) {
    setTimeout(function () {

        console.log("use - 4", obj);
        delete obj.string;
        next();

    }, 1000);
});


m.start({ hello: "world" }, function (obj) {

    console.log("Finla call", obj);

});
*/

module.exports = Middleware;