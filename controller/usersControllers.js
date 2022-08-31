//external imports
const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");

// internal imports
const User = require("../models/People");
const createHttpError = require("http-errors");
const { escape, getStandardResponse } = require("../utils/helpers");

async function getUsers(req, res, next) {
	try {
		const users = await User.find();
		res.status(200).json(getStandardResponse(true, "", { users }));
	} catch (err) {
		next(err);
	}
}

// add user
async function addUser(req, res, next) {
	let newUser;
	const hashedPassword = await bcrypt.hash(req.body.password, 10);

	if (req.files && req.files.length > 0) {
		newUser = new User({
			...req.body,
			avatar: req.files[0].filename,
			password: hashedPassword,
		});
	} else {
		newUser = new User({
			...req.body,
			password: hashedPassword,
		});
	}

	// save user or send error
	try {
		await newUser.save();
		delete newUser.password;
		console.log(newUser);
		res.status(200).json(getStandardResponse(true, "User added successfully!", newUser));
	} catch (err) {
		const errors = {
			common: {
				msg: err.message,
			},
		};
		res.status(500).json(getStandardResponse(false, "An error occured!", { errors }));
	}
}

// serach user
async function searchUser(req, res, next) {
	const user = req.body.user;
	const searchQuery = user.replace("+88", "");

	const name_search_regex = new RegExp(escape(serchQuery), "i");
	const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
	const email_search_regex = new RegExp("^" + escape("+88" + searchQuery) + "$", "i");

	try {
		if (searchQuery !== "") {
			const users = await User.find(
				{
					$or: [
						{
							name: name_search_regex,
						},
						{
							mobile: mobile_search_regex,
						},
						{
							email: email_search_regex,
						},
					],
				},
				"name avatar"
			);

			res.json(getStandardResponse(true, "", { users }));
		} else {
			throw createHttpError("You must provide some text to search!");
		}
	} catch (err) {
		const errors = {
			common: {
				msg: err.message,
			},
		};
		res.status(500).json(getStandardResponse(false, "An error occured", { errors }));
	}
}

// delete user
async function deleteUser(req, res, next) {
	try {
		const user = await User.findByIdAndDelete({ _id: req.params.id });
		if (user.avatar) {
			unlink(path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`), (err) => {
				if (err) console.log(err);
			});
		}

		res.status(200).json(getStandardResponse(true, "User Deleted Successfully!", {}));
	} catch (error) {
		const errors = {
			common: {
				msg: "Could not delete the user!",
			},
		};
		res.status(500).json(getStandardResponse(false, "An error occured", { errors }));
	}
}

module.exports = {
	getUsers,
	addUser,
	searchUser,
	deleteUser,
};
