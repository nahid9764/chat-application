function getStandardResponse(success, message, data) {
	return {
		success: success,
		message: message,
		data: data,
	};
}

const escape = (str) => {
	return str.replace(/[-\/\^$*+?.()|[\]{}]/g, "\\$&");
};

module.exports = {
	getStandardResponse,
	escape,
};
