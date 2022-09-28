const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const authenticateGoogle = () => {
	const auth = new google.auth.GoogleAuth({
		keyFile: `${__dirname}/googlekey.json`,
		scopes: "https://www.googleapis.com/auth/drive",
	});
	return auth;
};

const uploadToGoogleDrive = async (file, auth) => {
	const fileMetadata = {
		name: file.originalname,
		parents: ["1P_Jskc2WosWUJh-rqYS57JvOa07Oiuoz"], // Change it according to your desired parent folder id
	};

	const media = {
		mimeType: file.mimetype,
		body: fs.createReadStream(file.path),
	};

	const driveService = google.drive({ version: "v3", auth });

	const {
		data: { id },
	} = await driveService.files.create({
		requestBody: fileMetadata,
		media: media,
		fields: "id",
	});
	const link = `https://drive.google.com/uc?export=view&id=${id}`;
	return id;
};

const deleteFile = (filename) => {
	fs.unlink(path.join(__dirname, `/../public/uploads/${filename}`), () => {
		console.log("file deleted");
	});
};

module.exports = { authenticateGoogle, uploadToGoogleDrive, deleteFile };
