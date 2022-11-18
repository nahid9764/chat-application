// external imports
const express = require("express");

//internal import
const {
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

/**
 * @swagger
 * /create-account:
 *   post:
 *     tags:
 *     - Authentication
 *     description: Create a New user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schema/CreateUserInput'
 *     responses:
 *       200:
 *         description: User added successfully!
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schema/CreateUserResponse'
 *
 *       500:
 *         description: Internal Server error.
 */
router.post("/create-account", avatarUpload, addUserValidators, addUserValidationHandler, addUser);

/**
 * @swagger
 * /login:
 *   post:
 *      tags:
 *      - Authentication
 *      description: Log in user
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schema/LoginInput'
 *      responses:
 *        200:
 *          description: Successfully returned token and user details
 *          content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schema/LoginResponse'
 *        500:
 *          description: Failed to Login
 */
router.post("/login", loginValidators, loginValidationHandler, login);

/**
 * @swagger
 * /google-authURL:
 *   get:
 *      tags:
 *      - Authentication
 *      description: Return GoogleAuth URL
 *      responses:
 *        200:
 *          description: Successfully returned URL
 */
router.get("/google-authURL", createGoogleAuthURL);

/**
 * @swagger
 * /google-user:
 *   get:
 *      tags:
 *      - Authentication
 *      description: Returns all users
 *      responses:
 *        200:
 *          description: Successfully returned all user
 *        500:
 *          description: Failed to query for users
 */
router.get("/google-user", createUserByGoogle);

/**
 * @swagger
 * /validate-auth:
 *   get:
 *      tags:
 *      - Authentication
 *      description: Re-validate user by only token
 *      responses:
 *        200:
 *          description: User re-validate successful.
 *        500:
 *          description: Failed to user validate.
 */
router.get("/validate-auth", checkLogin, verifyUserByCookie);

// logout
router.delete("/logout", logout);

module.exports = router;
