require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const connectToDB = require("./DB/dbService");
const router = require("./router/router");
const corsMiddleware = require("./middlewares/cors");
const { handleError } = require("./utils/handleErrors");
const chalk = require("chalk");
const { loggerMiddleware } = require("./logger/loggerService");
const path = require("path");

const cleanupExpiredDates = require("./utils/cleanupExpiredDates");
cleanupExpiredDates();

const app = express();
const PORT = process.env.PORT || 8181;
app.use(express.static("./public"));
app.use(corsMiddleware);
app.use(express.json());

app.use(loggerMiddleware());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(router);

app.use((err, req, res, next) => {
	const message = err || "Internal Server error";
	return handleError(res, 500, message);
});

app.listen(PORT, () => {
	console.log(chalk.bgGreen.green("Server lisening to port " + PORT));
	connectToDB();
});
