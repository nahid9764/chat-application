// external imports
const express = require("express");

//internal import
const {
	getConversationLists,
	addConversation,
	getMessages,
	sendMessage,
	updateSeenUnseen,
	uploadFile,
	deleteFile,
} = require("../controller/inbox_controllers");
const { checkLogin } = require("../middleware/common/check_login");
const decorateHtmlRes = require("../middleware/common/decorate_html_res");
const attachmentUpload = require("../middleware/inbox/attachment_upload");
const { updateSeenValidator, updateSeenValidatorHandler } = require("../middleware/inbox/update_seen_validators");

const router = express.Router();

// get conversations
router.get("/getConversationLists", decorateHtmlRes("Inbox"), checkLogin, getConversationLists);

// add conversation
router.post("/addConversation", checkLogin, addConversation);

// get messages of a conversation
router.get("/messages/:conversationId", checkLogin, getMessages);

// send message
router.post("/sendMessage", checkLogin, attachmentUpload, sendMessage);

router.post("/uploadFile", checkLogin, attachmentUpload, uploadFile);

router.delete("/deleteFile/:id", checkLogin, deleteFile);

router.post("/updateSeenUnseen", checkLogin, updateSeenValidator, updateSeenValidatorHandler, updateSeenUnseen);

module.exports = router;
