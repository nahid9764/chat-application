function decorateHtmlRes(pgTitle) {
	return function (req, res, next) {
		res.locals.html = true;
		res.locals.title = `${pgTitle} - ${process.env.APP_NAME}`;
		next();
	};
}

module.exports = decorateHtmlRes;
