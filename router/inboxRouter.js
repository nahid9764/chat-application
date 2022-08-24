// external imports
const express = require("express");

//internal import
const {
	getInbox,
	searchUser,
	addConversation,
	getMessages,
	attachmentUpload,
	sendMessage,
} = require("../controller/inboxControllers");
const { checkLogin } = require("../middleware/common/checkLogin");
const decorateHtmlRes = require("../middleware/common/decorateHtmlRes");

const router = express.Router();

// inbox page
router.get("/", decorateHtmlRes("Inbox"), checkLogin, getInbox);

// search user for conversation
router.post("/searchUser", checkLogin, searchUser);

// add conversation
router.post("/addConversation", checkLogin, addConversation);

// get messages of a conversation
router.get("/messages/:conversationId", checkLogin, getMessages);

// send message
router.post("/sendMessage", checkLogin, attachmentUpload, sendMessage);

module.exports = router;
