// internal imports
const User = require("../models/People");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { getStandardResponse } = require("../utils/helpers");
const { getGoogleAuthURL, getGoogleUser } = require("../utils/looginWithGoogle");
const { response } = require("express");

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

async function createGoogleAuthURL(req, res) {
	try {
		const authURL = await getGoogleAuthURL();
		if (authURL) {
			res.status(200).json(getStandardResponse(true, "", { authURL }));
		}
	} catch (error) {
		const errors = {
			common: {
				msg: err.message,
			},
		};
		res.status(401).json(getStandardResponse(false, "Get URL Failed!", { errors }));
	}
}

async function createUserByGoogle(req, res) {
	if (req.query) {
		const googleUser = await getGoogleUser({ code: req.query?.code });

		if (googleUser) {
			let userObj;
			const user = await User.findOne({ googleID: googleUser.id });
			if (user) {
				// userObj = { ...existUser, id: existUser._id };
				userObj = {
					id: user._id,
					googleID: user.id,
					name: user.name,
					mobile: user.mobile,
					email: user.email,
					avatar: user.avatar || null,
					role: "user",
				};
			} else {
				try {
					userObj = new User({
						googleID: googleUser.id,
						name: `${googleUser?.given_name} ${googleUser?.family_name}`,
						mobile: null,
						email: googleUser?.email ?? null,
						avatar: googleUser?.picture ?? null,
						role: "user",
					});
					// save user or send error
					userObj = await userObj.save();
				} catch (err) {
					const errors = {
						common: {
							msg: err.message,
						},
					};
					res.status(500).json(getStandardResponse(false, "An error occured!", { errors }));
				}
			}

			// generate token
			const token = jwt.sign(userObj, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
			// set cookie
			res.cookie(process.env.COOKIE_NAME, token, {
				maxAge: process.env.JWT_EXPIRY,
				httpOnly: true,
				signed: true,
			});
			res.status(200).json(getStandardResponse(true, "", { ...userObj, token }));
		}
	}

	// let user = await this.userModel.findOne({ githubId: String(googleUser.id) }).exec();

	// if (user) {
	// 	// Update their profile
	// }

	// if (!user) {
	// 	// Create the user in the database
	// 	user = new User();
	// }

	// // Generate a JWT, add it as a cookie

	// return user;
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
	createGoogleAuthURL,
	createUserByGoogle,
	login,
	verifyUserByCookie,
	logout,
};
