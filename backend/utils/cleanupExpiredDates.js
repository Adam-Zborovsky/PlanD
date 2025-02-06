const User = require("../users/models/mongodb/User");
const Idea = require("../ideas/models/mongodb/Idea");

function isDateExpired(dateString) {
	const date = new Date(dateString);
	const now = new Date();
	const diffInDays = (now - date) / (1000 * 60 * 60 * 24);
	return diffInDays > 3;
}

async function cleanupExpiredDates() {
	try {
		const users = await User.find({ "dates.0": { $exists: true } });
		for (let user of users) {
			user.dates = user.dates.filter((date) => !isDateExpired(date));
			if (user.dates.length === 0) {
				user.isHome = false;
			}
			await user.save();
		}

		const ideas = await Idea.find({ "dates.0": { $exists: true } });
		for (let idea of ideas) {
			idea.dates = idea.dates.filter((date) => !isDateExpired(date));
			await idea.save();
		}

		console.log("Expired dates cleanup completed successfully.");
	} catch (error) {
		console.error("Error cleaning up expired dates:", error);
	}
}

module.exports = cleanupExpiredDates;
