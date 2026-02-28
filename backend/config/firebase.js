const admin = require("firebase-admin");
const serviceAccount = require("../pland-ad9ad-firebase-adminsdk-fbsvc-cd541bd544.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();
module.exports = bucket;
