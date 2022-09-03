function getStandardResponse(success, message, data) {
	return {
		success: success,
		message: message,
		data: data,
	};
}

function generateConversationId(a, b) {
	return a.slice(0, 12) + b.slice(-12);
}

const escape = (str) => {
	return str.replace(/[-\/\^$*+?.()|[\]{}]/g, "\\$&");
};

module.exports = {
	getStandardResponse,
	escape,
	generateConversationId,
};
