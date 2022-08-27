// external imports
const express = require("express");

//internal import
const { getLogin, login, logout, verifyUserByCookie } = require("../controller/loginController");
const decorateHtmlRes = require("../middleware/common/decorateHtmlRes");
const { loginValidators, loginValidationHandler } = require("../middleware/login/loginValidators");
const { checkLogin } = require("../middleware/common/checkLogin");

const router = express.Router();

// login page
router.get("/", decorateHtmlRes("Login"), getLogin);

// process login
router.post("/login", loginValidators, loginValidationHandler, login);

// re-validate user by only token
router.get("/validate-auth", checkLogin, verifyUserByCookie);

// logout
router.delete("/logout", logout);

module.exports = router;
