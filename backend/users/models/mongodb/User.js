const mongoose = require("mongoose");
const { DEFAULT_VALIDATION } = require("../../../helpers/defaultValidator");

const userSchema = new mongoose.Schema({
	name: {
		first: DEFAULT_VALIDATION,
		middle: {
			...DEFAULT_VALIDATION,
			required: false,
			minLength: 0,
		},
		last: DEFAULT_VALIDATION,
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		trim: true,
		unique: true,
		lowercase: true,
		validate: {
			validator: (value) =>
				/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(
					value
				),
			message: "Invalid email format",
		},
	},
	password: {
		type: String,
		required: true,
		trim: true,
	},
	image: {
		path: {
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
			type: String,
			required: true,
		},
	],
	isAdmin: { type: Boolean, default: false },
	isHome: { type: Boolean, default: false },
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const User = mongoose.model("user", userSchema);

module.exports = User;
