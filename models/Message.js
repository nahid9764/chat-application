const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
	{
		text: {
			type: String,
		},
		attachment: [{ fileName: String, gDriveID: String }],
		sender: {
			id: mongoose.Types.ObjectId,
			name: String,
			avatar: String,
		},
		receiver: {
			id: mongoose.Types.ObjectId,
			name: String,
			avatar: String,
		},
		date_time: {
			type: Date,
			default: Date.now,
		},
		isSeen: {
			type: Boolean,
			default: false,
		},
		conversationId: {
			type: mongoose.Types.ObjectId,
			require: true,
		},
	},
	{
		timestamps: true,
	}
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
