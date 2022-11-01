const { getStandardResponse } = require("../../utils/helpers");
const uploader = require("../../utils/multiple_uploader");

function attachmentUpload(req, res, next) {
	const upload = uploader(
		"attachments",
		["image/jpeg", "image/jpg", "image/png", "application/pdf"],
		10000000,
		2,
		"Only .jpg, .jpeg , .png and .pdf are allowed!"
	);

	// call the middleware function
	upload.any()(req, res, (err) => {
		if (err) {
			res.status(404).json(getStandardResponse(false, err.message, null));
		} else {
			next();
		}
	});
}

module.exports = attachmentUpload;
