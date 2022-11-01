const { default: fetch } = require("cross-fetch");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");

const oauth2Client = new google.auth.OAuth2({
	clientId: "1060202304069-h9or95mi7qenfpgsvhul83546fik8nuh.apps.googleusercontent.com",
	clientSecret: "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",
	redirectUri: "http://localhost:3000/login",
});

async function getGoogleAuthURL() {
	// Generate a url that asks permissions to the user's email and profile

	const scopes = [
		"https://www.googleapis.com/auth/userinfo.profile",
		"https://www.googleapis.com/auth/userinfo.email",
	];

	const url = await oauth2Client.generateAuthUrl({
		redirect_uri: "http://localhost:3000/login",
		access_type: "offline",
		prompt: "consent",
		scope: scopes,
		// include_granted_scopes: true,
	});
	return url;
}

async function getGoogleUser({ code }) {
	// Fetch the user's profile with the access token and bearer
	try {
		const { tokens } = await oauth2Client.getToken(code);
		oauth2Client.setCredentials(tokens);
		const googleUser = await fetch(
			`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
			{
				method: "GET",
				headers: {
					Authorization: `${tokens.token_type} ${tokens.access_token}`,
				},
			}
		)
			.then((res) => {
				return res.json();
			})
			.catch((err) => {
				throw new Error(err.message);
			});
		return googleUser;
	} catch (error) {
		console.log(error);
		return false;
	}
}

module.exports = { getGoogleAuthURL, getGoogleUser };
