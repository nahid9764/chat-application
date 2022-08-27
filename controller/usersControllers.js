//external imports
const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");

// internal imports
const User = require("../models/People");
const { getStandardResponse } = require("../utils/helpers");

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
		const result = await newUser.save();
		res.status(200).json(getStandardResponse(true, "User added successfully!", result));
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
	deleteUser,
};
