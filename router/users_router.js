// external imports
const express = require("express");

//internal import
const { getUserConversation, addUser, deleteUser, searchUser } = require("../controller/users_controllers");
const { checkLogin } = require("../middleware/common/check_login");
const decorateHtmlRes = require("../middleware/common/decorate_html_res");
const avatarUpload = require("../middleware/user/avatar_upload");
const { addUserValidators, addUserValidationHandler } = require("../middleware/user/user_validator");

const router = express.Router();

// users page
router.get("/conversations", checkLogin, getUserConversation);

// search user for conversation
router.post("/searchUser", checkLogin, searchUser);

// delete user
router.delete("/delete-user/:id", checkLogin, deleteUser);

module.exports = router;
