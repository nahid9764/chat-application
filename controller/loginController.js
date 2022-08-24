// internal imports
const User = require("../models/People");
const bcrypt = require("bcrypt");
const jtw = require("jsonwebtoken");
const createError = require("http-errors");

// get login page
function getLogin(req, res, next) {
	res.render("index");
}

// login controller
async function login(req, res, next) {
	try {
		// find a user who has this email/username
		const user = await User.findOne({
			$or: [{ email: req.body.username }, { mobile: req.body.username }],
		});

		if (user && user._id) {
			const isValidPss = await bcrypt.compare(req.body.password, user.password);

			if (isValidPss) {
				// prepare the user object to generate token
				const userObj = {
					name: user.name,
					mobile: user.mobile,
					email: user.email,
					role: "user",
				};

				// generate token
				const token = jtw.sign(userObj, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
				// set cookie
				res.cookie(process.env.COOKIE_NAME, token, {
					maxAge: process.env.JWT_EXPIRY,
					httpOnly: true,
					signed: true,
				});

				// set logged in user local identifier
				res.locals.loggedInUser = userObj;
				res.send(userObj);
			} else {
				throw createError("Invalid Password!");
			}
		} else {
			throw createError("No user id found!");
		}
	} catch (err) {
		res.send({
			errors: {
				common: {
					msg: err.message,
				},
			},
		});
	}
}

function logout(req, res) {
	res.clearCookie(process.env.COOKIE_NAME);
	res.send("looged out");
}

module.exports = {
	getLogin,
	login,
	logout,
};
