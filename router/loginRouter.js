// external imports
const express = require("express");

//internal import
const { getLogin } = require("../controller/loginController");
const decorateHtmlRes = require("../middleware/common/decorateHtmlRes");

const router = express.Router();

// login page
router.get("/", decorateHtmlRes("Login"), getLogin);

module.exports = router;
