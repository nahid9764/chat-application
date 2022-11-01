const creatErr = require("http-errors");
const { getStandardResponse } = require("../../utils/helpers");

// 404 not found handler
function notFroundHandler(req, res, next) {
	res.status(404).json(getStandardResponse(false, "Your request content not found!", {}));
}

// defalult error handler
function errorHanlder(err, req, res, next) {
	res.locals.error = process.env.NODE_ENV === "development" ? err : { message: err.message };
	res.status(err.status || 500);

	if (res.locals.html) {
		// html response
		res.render("error", {
			title: "Error page",
		});
	} else {
		// json response
		res.json(getStandardResponse(false, "An error occured from error handler !", { errors: res.locals.error }));
	}
}
module.exports = { notFroundHandler, errorHanlder };
