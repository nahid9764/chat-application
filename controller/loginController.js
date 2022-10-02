// internal imports
const User = require("../models/People");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { getStandardResponse } = require("../utils/helpers");

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
					id: user._id,
					name: user.name,
					mobile: user.mobile,
					email: user.email,
					avatar: user.avatar || null,
					role: "user",
				};

				// generate token
				const token = jwt.sign(userObj, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
				// set cookie
				res.cookie(process.env.COOKIE_NAME, token, {
					maxAge: process.env.JWT_EXPIRY,
					httpOnly: true,
					signed: true,
				});

				// set logged in user local identifier
				res.locals.loggedInUser = userObj;
				res.status(200).json(getStandardResponse(true, "", { ...userObj, token }));
			} else {
				throw createError("Invalid Password!");
			}
		} else {
			throw createError("No user id found!");
		}
	} catch (err) {
		const errors = {
			common: {
				msg: err.message,
			},
		};
		res.status(401).json(getStandardResponse(false, "Authentication Failed!", { errors }));
	}
}

function verifyUserByCookie(req, res) {
	if (req.user) {
		const { id, name, mobile, email, role, avatar } = req.user;
		const userObj = {
			id,
			name,
			mobile,
			email,
			avatar,
			role,
		};
		const token = jwt.sign(userObj, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
		res.status(200).json(getStandardResponse(true, "", { ...userObj, token }));
	}
}

function logout(req, res) {
	res.clearCookie(process.env.COOKIE_NAME);
	res.send("looged out");
}

module.exports = {
	getLogin,
	login,
	verifyUserByCookie,
	logout,
};
