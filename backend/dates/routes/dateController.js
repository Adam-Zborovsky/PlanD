const express = require("express");
const auth = require("../../auth/authService");
const router = express.Router();
const { handleError } = require("../../utils/handleErrors");
const User = require("../../users/models/mongodb/User");

router.post("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const { date } = req.body;

		const user = await User.findById(userId);
		if (!user) return res.status(404).send("User not found");

		if (user.dates.includes(date)) {
			return res.status(400).send("Date already added");
		}

		user.dates.push(date);
		await user.save();

		res.status(200).send(user.dates);
	} catch (error) {
		handleError(res, 500, error.message);
	}
});

router.post("/:userId/idea", auth, async (req, res) => {
	try {
		const { userId } = req.params;
		const { date, content } = req.body;

		const user = await User.findById(userId);
		if (!user) return res.status(404).send("User not found");

		user.ideas.push({ date, content, votes: 0 });
		await user.save();

		res.status(201).send(user.ideas);
	} catch (error) {
		handleError(res, 500, error.message);
	}
});

module.exports = router;
