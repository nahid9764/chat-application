const { mongo } = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { getActiveUsers } = require("../utils/activeUsers");
const { getStandardResponse, generateConversationId } = require("../utils/helpers");

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
					participant: {
						id: req.body.id,
						name: req.body.name,
						mobile: req.body.mobile,
						avatar: req.body.avatar || null,
					},
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

// send new messages
async function sendMessage(req, res, next) {
	if (req.body.message || (req.files && req.files.length > 0)) {
		try {
			// save message text/attachem in database
			let attachment = null;
			if (req.files && req.files.length > 0) {
				attachment = [];
				req.files.forEach((file) => {
					attachment.push(file.filename);
				});
			}
			console.log(req.body.conversationId);
			const newMessage = new Message({
				conversationId: req.body.conversationId,
				text: req.body.message,
				attachment: attachment,
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
			// emit socket event
			// global.io.emit("new_message", result);
			//send and get message
			const user = getActiveUsers(req.body.receiverId);
			console.log({ user });
			global.io.to(user.socketId).emit("new_message", result);

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
module.exports = {
	getConversationLists,
	addConversation,
	getMessages,
	sendMessage,
};
