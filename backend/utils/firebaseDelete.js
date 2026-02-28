const bucket = require("../config/firebase");

const deleteFromFirebase = async (fileUrl) => {
	try {
		if (!fileUrl) return;

		// Assume the public URL is in the following format:
		// https://storage.googleapis.com/<bucketName>/<fileName>
		const urlObj = new URL(fileUrl);
		const parts = urlObj.pathname.split("/");
		// Remove leading empty strings that may result from the URL splitting, and grab the file name.
		const fileName = parts.filter(Boolean).pop();

		// Delete the file from Firebase Storage
		await bucket.file(fileName).delete();
		console.log(`Deleted file ${fileName} from Firebase Storage`);
	} catch (error) {
		console.error("Error deleting file from Firebase:", error);
		// Depending on your requirements, you might decide to rethrow the error or handle it silently.
	}
};

module.exports = { deleteFromFirebase };
