const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "../uploads"));
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);

		cb(null, `${req.body.email}${ext}`);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});
module.exports = upload;
