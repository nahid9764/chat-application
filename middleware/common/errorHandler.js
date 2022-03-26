const creatErr = require("http-errors");

// 404 not found handler
function notFroundHandler(req, res, next) {
    next(creatErr(404, "Your request content not found!"));
}

// defalult error handler
function errorHanlder(err, req, res, next) {
    res.locals.error = process.env.NODE_ENV === "development" ? err : { message: err.message };
    res.status(err.status || 500);

    if (res.locals.html) {
        // html response
        res.render("err", {
            title: "Error page",
        });
    } else {
        // json response
        res.json(res.locals.error);
    }
}
module.exports = { notFroundHandler, errorHanlder };
