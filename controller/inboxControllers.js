const Conversation = require("../models/Conversation");
const User = require("../models/People");
const createHttpError = require("http-errors");
const Message = require("../models/Message");
const { escape, getStandardResponse } = require("../utils/helpers");

// get inbox page
async function getInbox(req, res, next) {
	try {
		const conversations = await Conversation.find({
			$or: [{ "creator.id": req.user.userid }, { "participant.id": req.user.userid }],
		});
		res.send(conversations);
	} catch (err) {
		next(err);
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

// add Conversation
async function addConversation(req, res, next) {
	try {
		const newConversation = new Conversation({
			creator: {
				id: req.user.userid,
				name: req.user.username,
				avatar: req.user.avatar || null,
			},
			participant: {
				id: req.body.id,
				name: req.body.participant,
				avatar: req.body.avatar || null,
			},
		});

		const result = await newConversation.save();

		res.status(200).json(getStandardResponse(true, "Conversation was added successfully!", null));
	} catch (err) {
		const errors = {
			common: {
				msg: err.message,
			},
		};
		res.status(500).json(getStandardResponse(false, "An error occured", { errors }));
	}
}

// get messages of a conversation
async function getMessages(req, res, next) {
	try {
		const messages = await Message.find({
			connversation_id: req.params.connversation_id,
		}).sort("-createdAt");

		const { participant } = await Conversation.findById(req.params.connversation_id);

		const data = {
			messages,
			participant,
			user: req.user.userid,
			connversation_id: req.params.connversation_id,
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

			const newMessage = new Message({
				text: req.body.message,
				attachment: attachment,
				sender: {
					id: req.user.userid,
					name: req.user.username,
					avatar: req.user.avatar || null,
				},
				receiver: {
					id: req.body.receiverId,
					name: req.body.receiverName,
					avatar: req.body.avatar || null,
				},
				connversation_id: req.body.conversationId,
			});

			const result = await newMessage.save();

			// emit socket event
			global.io.emit("new_message", {
				message: {
					connversation_id: req.body.conversationId,
					sender: {
						id: req.user.userid,
						name: req.user.username,
						avatar: req.user.avatar || null,
					},
					message: req.body.message,
					attachment: attachment,
					date_time: result.date_time,
				},
			});

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
		res.status(500).json(getStandardResponse(false, "An error occured", { errors }));
	}
}
async function attachmentUpload(req, res, next) {}

module.exports = {
	getInbox,
	searchUser,
	addConversation,
	getMessages,
	sendMessage,
	attachmentUpload,
};
