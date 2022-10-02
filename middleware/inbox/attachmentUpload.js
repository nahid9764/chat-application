const uploader = require("../../utils/multipleUploader");

function attachmentUpload(req, res, next) {
	const upload = uploader(
		"attachments",
		["image/jpeg", "image/jpg", "image/png", "application/pdf"],
		10000000000,
		2,
		"Only .jpg, .jpeg , .png and .pdf are allowed!"
	);

	// call the middleware function
	upload.any()(req, res, (err) => {
		if (err) {
			res.status(500).json({
				errors: {
					avatar: {
						msg: err.message,
					},
				},
			});
		} else {
			next();
		}
	});
}

module.exports = attachmentUpload;
