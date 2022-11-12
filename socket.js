const { Server } = require("socket.io");
const { addToActiveUsers, getActiveUsers, removeFromActiveUser } = require("./utils/active_users");

function startSocket(httpServer) {
	const io = new Server(httpServer, {
		cors: {
			origin: "http://localhost:3000",
			methods: ["GET", "POST"],
		},
	});

	global.io = io;
	global.activeUser = [];

	io.on("connection", (socket) => {
		//take userId and socketId from user
		socket.on("addToActiveUsers", (userId) => {
			addToActiveUsers(userId, socket.id);
			console.log({ activeUser: global.activeUser });
			io.emit("getActiveUsers", global.activeUser);
		});
		socket.on("disconnect", () => {
			removeFromActiveUser(socket.id);
			io.emit("getActiveUsers", global.activeUser);
		});
	});
}

module.exports = { startSocket };
