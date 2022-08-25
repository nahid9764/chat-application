// external imports
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookiesPareser = require("cookie-parser");

// internal imports
const { notFroundHandler, errorHanlder } = require("./middleware/common/errorHandler");
const logInRouter = require("./router/loginRouter");
const usersRouter = require("./router/usersRouter");
const inboxRouter = require("./router/inboxRouter");

const app = express();
const server = http.createServer(app);
dotenv.config();

// socket creation
const io = require("socket.io");
global.io = io;

// database connection
mongoose
	.connect(process.env.MONGO_CONNECTION, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connection success!"))
	.catch((err) => console.log(err));

// request parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

//parse cookies
app.use(cookiesPareser(process.env.COOKIE_SECRET));

//routing setup
app.use("/", logInRouter);
app.use("/users", usersRouter);
app.use("/inbox", inboxRouter);

// 404 not found handler
app.use(notFroundHandler);

// common error handler
app.use(errorHanlder);

app.listen(process.env.PORT, () => {
	console.log(`listening to port ${process.env.PORT}`);
});
