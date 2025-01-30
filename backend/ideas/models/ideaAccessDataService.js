const User = require("../../users/models/mongodb/User");
const { createError } = require("../../utils/handleErrors");
const Idea = require("./mongodb/Idea");

const postIdea = async (ownerId, date, content) => {
	try {
		let idea = new Idea({ ownerId, date, content });
		await idea.save();

		return idea;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

const getIdeas = async (ideas) => {
	try {
		ideas.forEach(async (idea) => {
			const user = await User.findById(idea.ownerId);
			if (user.image) {
				idea = {
					...idea,
					profileImage: user.image,
				};
			}
		});
		return ideas;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

const getMostVotedIdea = async (ideas) => {
	try {
		let mostVotedIdea = ideas.reduce((max, current) =>
			current.votes.length > max.votes.length ? current : max
		);
		const user = await User.findById(mostVotedIdea.ownerId);

		if (user.image) {
			mostVotedIdea = {
				...mostVotedIdea._doc,
				profileImage: user.image,
			};
			console.log(mostVotedIdea);
		}
		return mostVotedIdea;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

const voteForIdea = async (idea, userId) => {
	try {
		if (idea.votes.includes(userId))
			idea.votes = idea.votes.filter((vote) => vote !== userId);
		else idea.votes.push(userId);
		await idea.save();

		return idea;
	} catch (error) {
		createError("Mongoose", error);
	}
};

const updateIdea = async (id, updateData) => {
	try {
		const idea = await Idea.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true, runValidators: true }
		);

		if (!idea) throw { status: 404, message: "User not found" };

		return idea;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || "Update failed",
		};
	}
};

const deleteIdea = async (id) => {
	try {
		const idea = await Idea.findByIdAndDelete(id);

		if (!idea) throw { status: 404, message: "User not found" };

		return idea;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || "Update failed",
		};
	}
};

module.exports = {
	postIdea,
	getIdeas,
	getMostVotedIdea,
	voteForIdea,
	updateIdea,
	deleteIdea,
};
