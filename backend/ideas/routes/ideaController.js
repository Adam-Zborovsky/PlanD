const express = require("express");
const auth = require("../../auth/authService");
const router = express.Router();
const { handleError } = require("../../utils/handleErrors");
const User = require("../../users/models/mongodb/User");

// Retrieve ideas for a specific date
router.get("/:date", async (req, res) => {
	try {
		const { date } = req.params;

		const users = await User.find({ "ideas.date": date });
		const ideas = users.flatMap((user) =>
			user.ideas.filter((idea) => idea.date === date)
		);

		res.status(200).send(ideas);
	} catch (error) {
		handleError(res, 500, error.message);
	}
});

// Vote for an idea
router.post("/:ideaId/vote", async (req, res) => {
	try {
		const { ideaId } = req.params;

		const user = await User.findOne({ "ideas._id": ideaId });
		if (!user) return res.status(404).send("Idea not found");

		const idea = user.ideas.id(ideaId);
		idea.votes += 1;

		await user.save();

		res.status(200).send(idea);
	} catch (error) {
		handleError(res, 500, error.message);
	}
});

module.exports = router;
