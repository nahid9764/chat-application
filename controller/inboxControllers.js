const Conversation = require("../models/Conversation");
const escape = require("../utils/escsape");
const User = require("../models/People");
const createHttpError = require("http-errors");
const Message = require("../models/Message");

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

			res.json(users);
		} else {
			throw createHttpError("You must provide some text to search!");
		}
	} catch (err) {
		res.status(500).json({
			errors: {
				common: {
					msg: err.message,
				},
			},
		});
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

		res.status(200).json({
			message: "Conversation was added successfully!",
		});
	} catch (err) {
		res.status(500).json({
			errors: {
				common: {
					msg: err.message,
				},
			},
		});
	}
}

// get messages of a conversation
async function getMessages(req, res, next) {
	try {
		const messages = await Message.find({
			connversation_id: req.params.connversation_id,
		}).sort("-createdAt");

		const { participant } = await Conversation.findById(req.params.connversation_id);

		res.status(200).json({
			data: {
				messages,
				participant,
			},
			user: req.user.userid,
			connversation_id: req.params.connversation_id,
		});
	} catch (err) {
		res.status(500).json({
			errors: {
				common: {
					msg: "Unknows error occured!",
				},
			},
		});
	}
}

// send new messages
async function sendMessage(req, res, next) {
	if (req.body.message || (req.files && req.files.length > 0)) {
		try {
			// save message text/attachem
		} catch (err) {}
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
