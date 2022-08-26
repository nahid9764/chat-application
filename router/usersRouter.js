// external imports
const express = require("express");

//internal import
const { getUsers, addUser, deleteUser } = require("../controller/usersControllers");
const { checkLogin } = require("../middleware/common/checkLogin");
const decorateHtmlRes = require("../middleware/common/decorateHtmlRes");
const avatarUpload = require("../middleware/user/avatarUpload");
const { addUserValidators, addUserValidationHandler } = require("../middleware/user/userValidator");

const router = express.Router();

// users page
router.get("/allUsers", checkLogin, getUsers);

// add user
router.post("/create-account", checkLogin, avatarUpload, addUserValidators, addUserValidationHandler, addUser);

// delete user
router.delete("/delete-user/:id", checkLogin, deleteUser);

module.exports = router;
