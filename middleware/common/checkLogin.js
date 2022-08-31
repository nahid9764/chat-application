const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const { getStandardResponse } = require("../../utils/helpers");

const checkLogin = (req, res, next) => {
	let token = req?.headers?.authorization ? req?.headers?.authorization : null;
	if (token) {
		try {
			// const token = cookies[process.env.COOKIE_NAME];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded;
			// pass user info to response locals
			if (res?.locals?.html) {
				res.locals.loggedInUser = decoded;
			}
			next();
		} catch (err) {
			if (res.locals.html) {
				res.redirect("/");
			} else {
				const errors = {
					common: {
						msg: "Authentication failed!",
					},
				};
				res.status(401).json(getStandardResponse(false, "Authentication failed!", { errors }));
			}
		}
	} else {
		if (res.locals.html) {
			res.redirect("/");
		} else {
			const errors = {
				common: {
					msg: "Authentication failed!",
				},
			};
			res.status(401).json(getStandardResponse(false, "Authentication failed!", { errors }));
		}
	}
};

// redirect already logged in user to inbox pabe
const redirectLoggedIn = function (req, res, next) {
	let token = req?.headers?.authorization ? req?.headers?.authorization : null;

	if (!token) {
		next();
	} else {
		res.redirect("/inbox");
	}
};

//guard to protect routes that need role based auhorization
function requireRole(role) {
	return function (req, res, next) {
		if (req.user.role && role.includes(req.user.role)) {
			next();
		} else {
			if (res.locals.html) {
				next(createHttpError(401, "You are not authorized to access this page!"));
			} else {
				const errors = {
					common: {
						msg: "You are not authorized!",
					},
				};
				res.json(getStandardResponse(false, "You are not authorized!", { errors }));
			}
		}
	};
}

module.exports = { checkLogin, requireRole };
