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
} = require("../controller/login_controller");
const decorateHtmlRes = require("../middleware/common/decorate_html_res");
const { loginValidators, loginValidationHandler } = require("../middleware/login/login_validators");
const { checkLogin } = require("../middleware/common/check_login");
const avatarUpload = require("../middleware/user/avatar_upload");
const { addUserValidators, addUserValidationHandler } = require("../middleware/user/user_validator");
const { addUser } = require("../controller/users_controllers");

const router = express.Router();

// login page
router.get("/", getLogin);

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
