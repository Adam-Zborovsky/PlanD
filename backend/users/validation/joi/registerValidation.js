const Joi = require("joi");

const registerValidation = (user) => {
	const schema = Joi.object({
		name: Joi.object()
			.keys({
				first: Joi.string().min(2).max(256).required(),
				middle: Joi.string().min(2).max(256).allow(""),
				last: Joi.string().min(2).max(256).required(),
			})
			.required(),
		email: Joi.string()
			.pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
			.message('user "email" must be a valid email')
			.required(),
		password: Joi.string()
			.regex(/^(?=.*[A-Za-z])(?=.*\d)/)
			.message(
				'user "password" must be at least 6 characters long and contain at least one letter and one number'
			)
			.required(),
		image: Joi.object()
			.keys({
				url: Joi.string()
					.uri()
					.message("user image must be a valid URL")
					.allow("")
					.optional(),
				alt: Joi.string().min(2).max(256).allow("").optional(),
			})
			.optional(),
		isAdmin: Joi.boolean().default(false).optional(),
	});

	return schema.validate(user);
};

module.exports = registerValidation;
