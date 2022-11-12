const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const authenticateGoogle = () => {
	const auth = new google.auth.GoogleAuth({
		keyFilename: "googlekey.json",
		scopes: "https://www.googleapis.com/auth/drive",
	});
	return auth;
};

const uploadToGoogleDrive = async (file, auth, onlyViewLink = false) => {
	const fileMetadata = {
		name: file.originalname,
		parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Change it according to your desired parent folder id
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

	const link = `${process.env.GOOGLE_DRIVE_IMG_VIEW_LINK}${id}`;
	if (onlyViewLink) return link;

	return { filename: file.originalname, id: String(id) };
};
const deleteToGoogleDrive = async (fileID, auth) => {
	const driveService = google.drive({ version: "v3", auth });
	const res = await driveService.files.delete({ fileId: fileID });
	return res;
};

const deleteFileFromLocal = (filename) => {
	fs.unlink(path.join(__dirname, `/../public/uploads/${filename}`), () => {
		console.log("file deleted");
	});
};

module.exports = { authenticateGoogle, uploadToGoogleDrive, deleteFileFromLocal, deleteToGoogleDrive };
