const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const authenticateGoogle = () => {
	const auth = new google.auth.GoogleAuth({
		keyFile: `${__dirname}/googlekey.json`,
		// credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS),
		scopes: "https://www.googleapis.com/auth/drive",
	});
	return auth;
};

const uploadToGoogleDrive = async (file, auth, onlyViewLink = false) => {
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

	if (onlyViewLink) return link;

	return { filename: file.originalname, id: String(id) };
};
const deleteToGoogleDrive = async (fileID, auth) => {
	const driveService = google.drive({ version: "v3", auth });
	const res = await driveService.files.delete({ fileId: fileID });
	return res;
};

const deleteFileFromLocal = (filename) => {
	fs.unlink(path.join(__dirname, `/../public/uploads/${filename}`), () => {});
};

module.exports = { authenticateGoogle, uploadToGoogleDrive, deleteFileFromLocal, deleteToGoogleDrive };
