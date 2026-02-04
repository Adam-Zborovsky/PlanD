const cors = require("cors");

const corsMiddleware = cors({
	origin: [
		"<Add IP Address>",
	],
});
module.exports = corsMiddleware;
