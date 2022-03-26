// external imports
const express = require("express");

//internal import
const { getInbox } = require("../controller/inboxControllers");
const decorateHtmlRes = require("../middleware/common/decorateHtmlRes");

const router = express.Router();

// inbox page
router.get("/", decorateHtmlRes("Inbox"), getInbox);

module.exports = router;
