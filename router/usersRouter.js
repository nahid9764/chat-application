// external imports
const express = require("express");

//internal import
const { getUserConversation, addUser, deleteUser, searchUser } = require("../controller/usersControllers");
const { checkLogin } = require("../middleware/common/checkLogin");
const decorateHtmlRes = require("../middleware/common/decorateHtmlRes");
const avatarUpload = require("../middleware/user/avatarUpload");
const { addUserValidators, addUserValidationHandler } = require("../middleware/user/userValidator");

const router = express.Router();

// users page
router.get("/conversations", checkLogin, getUserConversation);

// search user for conversation
router.post("/searchUser", checkLogin, searchUser);

// delete user
router.delete("/delete-user/:id", checkLogin, deleteUser);

module.exports = router;
