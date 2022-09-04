const { Server } = require("socket.io");
const { addToActiveUsers, getActiveUsers, removeFromActiveUser } = require("./utils/activeUsers");

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
		console.log("a user connected!", socket.id);
		//take userId and socketId from user
		socket.on("addToActiveUsers", (userId) => {
			console.log("addToActiveUsers", userId);
			addToActiveUsers(userId, socket.id);
			io.emit("getActiveUsers", global.activeUser);
		});

		socket.on("disconnect", () => {
			console.log("a user disconnected!", socket.id);
			removeFromActiveUser(socket.id);
			io.emit("getActiveUsers", global.activeUser);
		});
	});
}

module.exports = { startSocket };
