// external imports
const express = require("express");

//internal import
const { getUserConversation, deleteUser, searchUser } = require("../controller/users_controllers");
const { checkLogin } = require("../middleware/common/check_login");

const router = express.Router();

// users page
router.get("/conversations", checkLogin, getUserConversation);

// search user for conversation
router.post("/searchUser", checkLogin, searchUser);

// delete user
router.delete("/delete-user/:id", checkLogin, deleteUser);

module.exports = router;
