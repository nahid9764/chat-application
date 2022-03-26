// external imports
const express = require("express");

//internal import
const { getUsers, addUser } = require("../controller/usersControllers");
const decorateHtmlRes = require("../middleware/common/decorateHtmlRes");
const avatarUpload = require("../middleware/user/avatarUpload");
const { addUserValidators, addUserValidationHandler } = require("../middleware/user/userValidator");

const router = express.Router();

// users page
router.get("/", decorateHtmlRes("User"), getUsers);

// add user
router.post("/", avatarUpload, addUserValidators, addUserValidationHandler, addUser);

module.exports = router;
