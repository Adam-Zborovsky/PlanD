const mongoose = require("mongoose");
const Name = require("../../../helpers/mongodb/Name");
const EMAIL = require("../../../helpers/mongodb/mongooseValidators");

const userSchema = new mongoose.Schema({
	name: Name,
	email: EMAIL,
	password: {
		type: String,
		required: true,
		trim: true,
	},
	image: {
		url: {
			type: String,
			maxLength: 256,
			trim: true,
			lowercase: true,
		},
		alt: {
			type: String,
			maxLength: 256,
			trim: true,
			lowercase: true,
		},
	},
	dates: [
		{
			type: Date,
			required: true,
		},
	],
	ideas: [
		{
			date: { type: Date, required: true },
			content: { type: String, required: true },
			votes: { type: Number, default: 0 },
		},
	],
	isAdmin: { type: Boolean, default: false },
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const User = mongoose.model("user", userSchema);

module.exports = User;
