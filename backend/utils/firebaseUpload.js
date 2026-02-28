const bucket = require("../config/firebase");

const uploadToFirebase = (file, fileName) => {
	return new Promise((resolve, reject) => {
		const blob = bucket.file(fileName);
		const blobStream = blob.createWriteStream({
			metadata: {
				contentType: file.mimetype,
			},
		});

		blobStream.on("error", (error) => {
			reject(error);
		});

		blobStream.on("finish", async () => {
			try {
				// Make the file publicly accessible (optional)
				await blob.makePublic();
				const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
				resolve(publicUrl);
			} catch (err) {
				reject(err);
			}
		});

		blobStream.end(file.buffer);
	});
};

module.exports = { uploadToFirebase };
