const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const generateAuthToken = (user) => {
	const payload = {
		_id: user._id,
		name: user.name,
		isAdmin: user.isAdmin,
		isHome: user.isHome,
	};
	const token = jwt.sign(payload, JWT_SECRET);
	return token;
};

const verifyToken = (tokenFromClient) => {
	try {
		const payload = jwt.verify(tokenFromClient, JWT_SECRET);
		return payload;
	} catch (error) {
		return null;
	}
};

module.exports = { generateAuthToken, verifyToken };
