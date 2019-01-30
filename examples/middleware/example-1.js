const Middleware = require("../../lib.middleware.js");
const middleware = new Middleware();


middleware.use(function (obj, next) {

    console.log("middleware - 1", obj);

    //setTimeout(function () {

    obj.hook1 = true;
    next();

    //});

});


middleware.use(function (obj, next) {

    console.log("middleware - 2", obj);

    //setTimeout(function () {

    obj.hook2 = true;
    next();

    //});

});


middleware.use(function (obj, next) {

    console.log("middleware - 3", obj);

    //setTimeout(function () {

    obj.hook3 = { badum: "tss" };
    next();

    //});

});


middleware.use(function (obj, next) {

    console.log("middleware - 4", obj);

    //setTimeout(function () {

    //delete obj.hook3;
    next();

    //});

});


middleware.start({
    hook1: false,
    string: "whoo"
}, function (obj) {

    console.log("final call", obj);

});