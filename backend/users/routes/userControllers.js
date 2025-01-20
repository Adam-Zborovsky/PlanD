const express = require("express");
const {
	registerUser,
	getUser,
	loginUser,
	updateUser,
} = require("../models/userAccessDataService");
const auth = require("../../auth/authService");
const { handleError } = require("../../utils/handleErrors");
const {
	validateRegistration,
	validateLogin,
} = require("../validation/userValidationService");
const router = express.Router();

router.post("/", async (req, res) => {
	try {
		const validateErrorMessage = validateRegistration(req.body);
		if (validateErrorMessage !== "") {
			return handleError(res, 400, "Validation" + validateErrorMessage);
		}
		let user = await registerUser(req.body);
		res.send(user);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

router.get("/:id", auth, async (req, res) => {
	try {
		const userInfo = req.user;
		let { id } = req.params;

		if (userInfo._id != id && !userInfo.isAdmin) {
			return res
				.status(403)
				.send(
					"Authorization Error: Only the same user or admin can get user info"
				);
		}

		let user = await getUser(id);
		res.send(user);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

router.post("/login", async (req, res) => {
	console.log(req.body);
	try {
		const validateErrorMessage = validateLogin(req.body);
		if (validateErrorMessage !== "") {
			return handleError(res, 400, "Validation" + validateErrorMessage);
		}

		let { email, password } = req.body;
		const token = await loginUser(email, password);
		res.send(token);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});
router.patch("/:id", auth, async (req, res) => {
	try {
		const userInfo = req.user;
		const { id } = req.params;
		if (userInfo._id !== id && !userInfo.isAdmin) {
			return res
				.status(403)
				.send(
					"Authorization Error: Only the same user or admin can update user info"
				);
		}

		if (!Object.keys(req.body).length) {
			return res.status(400).send("No data provided for update");
		}

		const updatedUser = await updateUser(id, req.body);
		res.status(200).json({ message: "User updated successfully", updatedUser });
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

module.exports = router;
