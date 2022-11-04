const mongoose = require("mongoose");

const peopleSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		mobile: {
			type: String,
		},
		password: {
			type: String,
		},
		avatar: {
			type: String,
		},
		googleID: {
			type: String,
		},
		role: {
			type: String,
			enum: ["admin", "user"],
			default: "user",
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", peopleSchema);

module.exports = User;
