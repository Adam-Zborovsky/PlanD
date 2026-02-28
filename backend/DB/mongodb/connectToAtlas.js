const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const connectToAtlasDb = async () => {
	try {
		await mongoose.connect(MONGO_URI);
		console.log("Connected to MongoDB in Atlas");
	} catch (error) {
		console.error("Could not connect to MongoDB", error);
	}
};

module.exports = connectToAtlasDb;
