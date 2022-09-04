const addToActiveUsers = (userId, socketId) => {
	!global.activeUser.some((user) => user.userId === userId) && global.activeUser.push({ userId, socketId });
};

const removeFromActiveUser = (socketId) => {
	global.activeUser = global.activeUser.filter((user) => user.socketId !== socketId);
};

const getActiveUsers = (userId) => {
	console.log(global.activeUser);
	return global.activeUser.find((user) => user.userId === userId);
};

module.exports = { addToActiveUsers, removeFromActiveUser, getActiveUsers };
