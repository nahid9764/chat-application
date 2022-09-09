const { check, validationResult } = require("express-validator");

const updateSeenValidator = [
	check("conversationId").isLength({ min: 1 }).withMessage("Conversation-Id is require"),
	check("type").isLength({ min: 1 }).withMessage("Update type is require"),
];

const updateSeenValidatorHandler = (req, res, next) => {
	const mappedErrors = validationResult(req).mapped();
	if (Object.keys(mappedErrors).length === 0) {
		next();
	} else {
		// response the errors
		res.status(404).json(
			getStandardResponse(false, "Failed to update!", {
				errors: mappedErrors,
			})
		);
	}
};

module.exports = {
	updateSeenValidator,
	updateSeenValidatorHandler,
};
