const Conversation = require("../models/conversation");
const escape = require("../utils/escsape");
const User = require("../models/People");

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
			const users = await User.find({
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
			});
		}
	} catch (err) {}
}

// serach user
async function addConversation(req, res, next) {} // serach user
async function getMessages(req, res, next) {} // serach user
async function sendMessage(req, res, next) {}
async function attachmentUpload(req, res, next) {}

module.exports = {
	getInbox,
	searchUser,
	addConversation,
	getMessages,
	sendMessage,
	attachmentUpload,
};
