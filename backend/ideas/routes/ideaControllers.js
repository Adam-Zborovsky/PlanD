const express = require("express");
const auth = require("../../auth/authService");
const router = express.Router();
const { handleError } = require("../../utils/handleErrors");
const User = require("../../users/models/mongodb/User");
const Idea = require("../models/mongodb/Idea");
const { verifyToken } = require("../../auth/providers/jwt");
const {
	postIdea,
	getIdeas,
	getMostVotedIdea,
	voteForIdea,
	updateIdea,
	deleteIdea,
} = require("../models/ideaAccessDataService");

router.post("/:ownerId", auth, async (req, res) => {
	try {
		const { ownerId } = req.params;
		const { date, content } = req.body;

		const user = await User.findById(ownerId);
		if (!user) return res.status(404).send("User not found");

		let idea = await postIdea(ownerId, date, content);
		res.status(201).send(idea);
	} catch (error) {
		handleError(res, 500, error.message);
	}
});

router.get("/:date", async (req, res) => {
	try {
		const { date } = req.params;

		const ideas = await Idea.find({ date: date });
		if (ideas.length === 0) return res.status(404).send("No ideas found, Yet!");

		let ideasWithProfile = await getIdeas(ideas);
		console.log(ideasWithProfile);

		res.status(200).send(ideasWithProfile);
	} catch (error) {
		handleError(res, 500, error.message);
	}
});

router.get("/most-voted/:date", async (req, res) => {
	try {
		const { date } = req.params;

		const ideas = await Idea.find({ date: date });
		if (ideas.length === 0)
			return res.status(404).send("No ideas found for the given date.");

		const mostVotedIdea = await getMostVotedIdea(ideas);
		console.log(mostVotedIdea);

		res.status(200).send(mostVotedIdea);
	} catch (error) {
		handleError(res, 500, error.message);
	}
});

// Vote for an idea
router.patch("/:ideaId/vote", auth, async (req, res) => {
	try {
		const { ideaId } = req.params;

		const idea = await Idea.findById(ideaId);
		const userId = verifyToken(req.headers["x-auth-token"])._id;

		if (!idea) return res.status(404).send("No ideas with the given ID found.");

		let votedIdea = await voteForIdea(idea, userId);
		res.status(200).send(votedIdea);
	} catch (error) {
		handleError(res, 500, error.message);
	}
});

router.patch("/:ideaId", auth, async (req, res) => {
	try {
		const { ideaId } = req.params;
		const updateData = req.body;

		const idea = await updateIdea(ideaId, updateData);
		res.status(200).send(idea);
	} catch (error) {
		handleError(res, 500, error.message);
	}
});

router.delete("/:ideaId", auth, async (req, res) => {
	try {
		const { ideaId } = req.params;

		const idea = await deleteIdea(ideaId);
		res.status(200).send(idea);
	} catch (error) {
		handleError(res, 500, error.message);
	}
});

module.exports = router;
