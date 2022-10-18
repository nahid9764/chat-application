// external imports
const express = require("express");

//internal import
const {
	getLogin,
	login,
	logout,
	verifyUserByCookie,
	createUserByGoogle,
	createGoogleAuthURL,
} = require("../controller/loginController");
const decorateHtmlRes = require("../middleware/common/decorateHtmlRes");
const { loginValidators, loginValidationHandler } = require("../middleware/login/loginValidators");
const { checkLogin } = require("../middleware/common/checkLogin");
const avatarUpload = require("../middleware/user/avatarUpload");
const { addUserValidators, addUserValidationHandler } = require("../middleware/user/userValidator");
const { addUser } = require("../controller/usersControllers");

const router = express.Router();

// login page
router.get("/", decorateHtmlRes("Login"), getLogin);

// register user
router.post("/create-account", avatarUpload, addUserValidators, addUserValidationHandler, addUser);

// process login
router.post("/login", loginValidators, loginValidationHandler, login);

router.get("/google-authURL", createGoogleAuthURL);

router.get("/google-user", createUserByGoogle);

// re-validate user by only token
router.get("/validate-auth", checkLogin, verifyUserByCookie);

// logout
router.delete("/logout", logout);

module.exports = router;
