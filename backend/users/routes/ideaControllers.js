const express = require("express");
const auth = require("../../auth/authService");
const router = express.Router();
const { handleError } = require("../../utils/handleErrors");
const User = require("../models/mongodb/User");

// Add an idea to a specific date
router.post("/:userId", async (req, res) => {
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

router.get("/:date", async (req, res) => {
	try {
		const { date } = req.params;

		const users = await User.find({ "ideas.date": date });

		const ideasWithOwners = users.flatMap((user) =>
			user.ideas
				.filter((idea) => idea.date === date)
				.map((idea) => ({
					...idea.toObject(),
					ownerId: user._id.toString(),
				}))
		);

		res.status(200).send(ideasWithOwners);
	} catch (error) {
		handleError(res, 500, error.message);
	}
});


// Retrieve idea with most votes for a specific date, including user ID
router.get("/most-voted/:date", async (req, res) => {
	try {
		const { date } = req.params;
		console.log(date);


		const users = await User.find({ "ideas.date": date });

		const userIdeas = users.flatMap((user) =>
			user.ideas
				.filter((idea) => idea.date === date)
				.map((idea) => ({
					idea: idea.toObject(),
					owner: user._id.toString(),
				}))
		);

		if (userIdeas.length === 0) {
			return res.status(404).send({ message: "No ideas found for the given date." });
		}

		const mostVotedIdea = userIdeas.reduce((max, current) =>
			current.idea.votes > max.idea.votes ? current : max
		);

		res.status(200).send(mostVotedIdea);
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