const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema({
	ownerId: { type: String, required: true },
	date: { type: String, required: true },
	content: { type: String, required: true },
	votes: { type: Array, default: [] },
	favorite: { type: Boolean },
});

const Idea = mongoose.model("Idea", ideaSchema);

module.exports = Idea;
