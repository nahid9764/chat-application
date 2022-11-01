const { mongo } = require("mongoose");
const Conversation = require("../models/conversation");
const Message = require("../models/message");
const { getActiveUsers } = require("../utils/active_users");
const { getStandardResponse, generateConversationId } = require("../utils/helpers");
const {
	uploadToGoogleDrive,
	authenticateGoogle,
	deleteFileFromLocal,
	deleteToGoogleDrive,
} = require("../utils/upload_to_google_drive");

// get inbox page
async function getConversationLists(req, res, next) {
	try {
		const conversations = await Conversation.find({
			$or: [{ "creator.id": req.user.id }, { "participant.id": req.user.id }],
		});
		res.status(200).json(getStandardResponse(true, "", conversations));
	} catch (err) {
		next(err);
	}
}

// add Conversation
async function addConversation(req, res, next) {
	try {
		const customId = generateConversationId(req.user.id, req.body.id);
		const isExistBefore = await Conversation.findById(customId);
		let result;

		if (isExistBefore) {
			result = isExistBefore;
		} else {
			const customId2 = generateConversationId(req.body.id, req.user.id);
			const isExistBefore2 = await Conversation.findById(customId2);

			if (isExistBefore2) {
				result = isExistBefore2;
			} else {
				const newConversation = new Conversation({
					_id: mongo.ObjectId(customId),
					creator: {
						id: req.user.id,
						name: req.user.name,
						mobile: req.user.mobile,
						avatar: req.user.avatar || null,
					},
					lastSenderId: req.user.id,
					participant: {
						id: req.body.id,
						name: req.body.name,
						mobile: req.body.mobile,
						avatar: req.body.avatar || null,
					},
					unseenMsgCount: 0,
				});

				result = await newConversation.save();
			}
		}

		res.status(200).json(getStandardResponse(true, "Conversation was added successfully!", result));
	} catch (err) {
		const errors = {
			common: {
				msg: err.message,
			},
		};
		res.status(500).json(getStandardResponse(false, "Failed to add conversation!", { errors }));
	}
}

// get messages of a conversation
async function getMessages(req, res, next) {
	try {
		const messages = await Message.find({
			conversationId: req.params.conversationId,
		});

		const conversation = await Conversation.findById(req.params.conversationId);
		const data = {
			messages,
			participant: conversation?.participant,
			userId: req.user.id,
			conversationId: req.params.conversationId,
		};

		res.status(200).json(getStandardResponse(true, "", data));
	} catch (err) {
		const errors = {
			common: {
				msg: err.message,
			},
		};
		res.status(500).json(getStandardResponse(false, "An error occured", { errors }));
	}
}

// Upload file to google drive
async function uploadFile(req, res, next) {
	if (req.body.message || (req.files && req.files.length > 0)) {
		try {
			// save message text/attachment in database
			let fileIds = [];

			if (req.files && req.files.length > 0) {
				const auth = authenticateGoogle();
				for (let i = 0; i < req.files.length; i++) {
					const result = await uploadToGoogleDrive(req.files[i], auth);
					deleteFileFromLocal(`attachments/${req.files[i].filename}`);
					fileIds[i] = result;
				}
				res.status(200).json(getStandardResponse(true, "", fileIds));
			}
		} catch (err) {
			const errors = {
				common: {
					msg: err.message,
				},
			};
			res.status(500).json(getStandardResponse(false, "An error occured!", { errors }));
		}
	} else {
		const errors = {
			common: {
				msg: "Message text or attachment is required!",
			},
		};
		res.status(500).json(getStandardResponse(false, "Message text or attachment is required!", { errors }));
	}
}

async function deleteFile(req, res, next) {
	if (req.params.id) {
		try {
			const auth = authenticateGoogle();
			const result = await deleteToGoogleDrive(req.params.id, auth);
			res.status(200).json(getStandardResponse(true, "", result));
		} catch (err) {
			const errors = {
				common: {
					msg: err.message,
				},
			};
			res.status(401).json(getStandardResponse(false, err.message, { errors }));
		}
	} else {
		const errors = {
			common: {
				msg: "Message text or attachment is required!",
			},
		};
		res.status(500).json(getStandardResponse(false, "Message text or attachment is required!", { errors }));
	}
}

// send new messages
async function sendMessage(req, res, next) {
	if (req.body.message || (req.body?.attachment && req.body?.attachment[0])) {
		try {
			// save message text/attachem in database
			const newMessage = new Message({
				conversationId: req.body.conversationId,
				text: req.body?.message,
				attachment: req.body?.attachment,
				isSeen: false,
				sender: {
					id: req.user.id,
					name: req.user.name,
					avatar: req.user.avatar || null,
				},
				receiver: {
					id: req.body.receiverId,
					name: req.body.receiverName,
					avatar: req.body.avatar || null,
				},
			});

			const result = await newMessage.save();
			// update last sernder id
			await Conversation.updateOne({ _id: req.body.conversationId }, { $set: { lastSenderId: req.user.id } });
			// emit socket event
			const user = getActiveUsers(req.body.receiverId);
			if (user?.socketId) {
				const r = await global.io.to(user.socketId).emit("new_message", result);
			} else {
				// increment unseenCount, if particepent not active
				const doc = await Conversation.findById(req.body.conversationId);
				await Conversation.updateOne(
					{ _id: req.body.conversationId },
					{ $set: { unseenMsgCount: doc.unseenMsgCount + 1 } }
				);
			}
			res.status(200).json(getStandardResponse(true, "", result));
		} catch (err) {
			const errors = {
				common: {
					msg: err.message,
				},
			};
			res.status(500).json(getStandardResponse(false, "An error occured!", { errors }));
		}
	} else {
		const errors = {
			common: {
				msg: "Message text or attachment is required!",
			},
		};
		res.status(500).json(getStandardResponse(false, "Message text or attachment is required!", { errors }));
	}
}

// Update seen-unseen
async function updateSeenUnseen(req, res, next) {
	const { conversationId, type, msgIDs } = req.body;
	if (conversationId && type) {
		try {
			const doc = await Conversation.findById(conversationId);
			if (type === "UNSEEN") {
				doc.unseenMsgCount = doc.unseenMsgCount + 1;
			} else if (type === "SEEN") {
				doc.unseenMsgCount = 0;
				if (msgIDs.length > 0) {
					const result = await Message.updateMany(
						{ _id: { $in: msgIDs } },
						{ $set: { isSeen: true } },
						{ multi: true }
					);
					// Find Receiver Id
					const F_R_I =
						doc?.creator?.id.toString() === req.user.id
							? doc?.participant?.id.toString()
							: doc?.creator?.id.toString();

					const receiver = getActiveUsers(F_R_I.toString());
					if (receiver?.socketId) {
						const r = await global.io.to(receiver.socketId).emit("msg_seen", req.body);
					}
				}
			}
			const saveUpdate = await doc.save();
			res.status(200).json(getStandardResponse(true, "", req.body));
		} catch (error) {
			const errors = {
				common: {
					msg: error.message,
				},
			};
			res.status(500).json(getStandardResponse(false, "Couldn't update!", { errors }));
		}
	} else {
		const errors = {
			common: {
				msg: "'conversationId' and 'type' is required!",
			},
		};
		res.status(500).json(getStandardResponse(false, "Proper req.body not found!", { errors }));
	}
}

module.exports = {
	getConversationLists,
	addConversation,
	getMessages,
	sendMessage,
	updateSeenUnseen,
	uploadFile,
	deleteFile,
};
