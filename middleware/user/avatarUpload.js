const { getStandardResponse } = require("../../utils/helpers");
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
			const errors = {
				avatar: {
					msg: err.message,
				},
			};
			res.status(500).json(getStandardResponse(false, "Authentication failed!", { errors }));
		} else {
			next();
		}
	});

	return upload;
}

module.exports = avatarUpload;
