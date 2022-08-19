const uploader = require("../../utils/singleUploader");

function avatarUpload(req, res, next) {
	const upload = uploader(
		"avatars",
		["image/jpeg", "image/jpg", "image/png"],
		1000000,
		"Only .jpg, jpeg or .png formate allowed!"
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

	return upload;
}

module.exports = avatarUpload;
