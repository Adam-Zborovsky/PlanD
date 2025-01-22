const express = require("express");
const auth = require("../../auth/authService");
const router = express.Router();
const { handleError } = require("../../utils/handleErrors");
const User = require("../models/mongodb/User");
const { getUser } = require("../models/userAccessDataService");

// Add a date to a user's list of available dates
router.post("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const { date } = req.body;
		console.log(date);


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

//get dates of a user
router.get("/:userId", auth, async (req, res) => {
	try {
		const { userId } = req.params;

		const user = await getUser(userId);
		if (!user) return res.status(404).send("User not found");

		res.status(201).send(user.dates);
	} catch (error) {
		handleError(res, 500, error.message);
	}
});

// Update dates of a user
router.patch("/:userId", auth, async (req, res) => {
	try {
		const { userId } = req.params;
		const dateToDel = req.body.date;


		const user = await getUser(userId);
		if (!user) return res.status(404).send("User not found");

		user.dates = user.dates.filter((date) => date !== dateToDel);
		await user.save();

		res.status(200).send(user.dates);
	} catch (error) {
		handleError(res, 500, error.message);
	}
});

module.exports = router;
