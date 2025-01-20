const mongoose = require("mongoose");

const dateSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, required: true },
	dates: { type: [String], required: true },
});

const Date = mongoose.model("date", dateSchema);
module.exports = Date;
