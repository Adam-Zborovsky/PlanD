const cors = require("cors");

const corsMiddleware = cors({
	origin: [
		"http://127.0.0.1:5500",
		"http://localhost:5173",
		"http://localhost:3000",
		"https://pland.onrender.com",
		"http://192.168.1.117:3000",
	],
});
module.exports = corsMiddleware;
