const EMAIL = {
	type: String,
	required: true,
	lowercase: true,
	trim: true,
	unique: true,
	match: RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/),
};

const DEFAULT_VALIDATION = {
	type: String,
	required: true,
	minLength: 2,
	maxLength: 256,
	trim: true,
	lowercase: true,
};

module.exports = { EMAIL, DEFAULT_VALIDATION };
