const Joi = require("joi");

const loginValidation = (user) => {
	const schema = Joi.object({
		email: Joi.string()
			.ruleset.pattern(
				/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
			)
			.rule({ message: 'user "mail" mast be a valid mail' })
			.required(),
		password: Joi.string()
			.regex(/^(?=.*[A-Za-z])(?=.*\d)/)
			.message(
				'user "password" must be at least 6 characters long and contain at least one letter and one number'
			)
			.required(),
	});
	return schema.validate(user);
};

module.exports = loginValidation;
