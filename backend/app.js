require("dotenv").config();

const express = require("express");
const connectToDB = require("./DB/dbService");
const router = require("./router/router");
const corsMiddleware = require("./middlewares/cors");
const { loggerMiddleware } = require("./logger/loggerService");
const { handleError } = require("./utils/handleErrors");
const chalk = require("chalk");

const cleanupExpiredDates = require("./utils/cleanupExpiredDates");
setInterval(cleanupExpiredDates, 24 * 60 * 60 * 1000);
cleanupExpiredDates();

const app = express();
const PORT = process.env.PORT || 8181;
app.use(express.static("./public"));
app.use(corsMiddleware);
app.use(express.json());

app.use(loggerMiddleware());

app.use(router);

app.use((err, req, res, next) => {
	const message = err || "Internal Server error";
	return handleError(res, 500, message);
});

app.listen(PORT, () => {
	console.log(chalk.bgGreen.green("Server listening to port " + PORT));
	connectToDB();
});
