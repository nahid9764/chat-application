const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
	console.log(req.signedCookies);
	let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
	console.log({ cookies });
	if (cookies) {
		try {
			const token = cookies[process.env.COOKIE_NAME];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded;

			// pass user info to response locals
			if (res.locals.html) {
				res.locals.loggedInUser = decoded;
			}
			next();
		} catch (err) {
			if (res.locals.html) {
				res.redirect("/");
			} else {
				res.status(500).json({
					errors: {
						common: {
							msg: "Authentication failed!",
						},
					},
				});
			}
		}
	} else {
		if (res.locals.html) {
			res.redirect("/");
		} else {
			res.status(401).json({
				errors: {
					common: {
						msg: "Authentication failed!",
					},
				},
			});
		}
	}
};

module.exports = { checkLogin };