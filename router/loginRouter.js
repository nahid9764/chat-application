// external imports
const express = require("express");

//internal import
const { getLogin, login, logout } = require("../controller/loginController");
const decorateHtmlRes = require("../middleware/common/decorateHtmlRes");
const { loginValidators, loginValidationHandler } = require("../middleware/login/loginValidators");

const router = express.Router();

// login page
router.get("/", decorateHtmlRes("Login"), getLogin);

// process login
router.post("/", loginValidators, loginValidationHandler, login);

// logout
router.delete("/logout", logout);

module.exports = router;
