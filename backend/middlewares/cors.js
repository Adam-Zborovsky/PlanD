const cors = require("cors");

const corsMiddleware = cors({
	origin: [
		"https://pland.adamzborovsky.com",
		"http://localhost:3000",
		"http://localhost:5173",
		"http://192.168.1.117:3000",
	],
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
});
module.exports = corsMiddleware;
