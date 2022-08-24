const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
	{
		creator: {
			id: mongoose.Types.ObjectId,
			name: String,
			avatar: String,
		},
		participant: {
			id: mongoose.Types.ObjectId,
			name: String,
			avatar: String,
		},
		lastUpdate: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
