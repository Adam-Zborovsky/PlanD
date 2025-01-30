const express = require("express");
const {
	registerUser,
	getUser,
	loginUser,
	updateUser,
	deleteUser,
} = require("../models/userAccessDataService");
const auth = require("../../auth/authService");
const { handleError } = require("../../utils/handleErrors");
const {
	validateRegistration,
	validateLogin,
} = require("../validation/userValidationService");
const upload = require("../../middlewares/multer");
const router = express.Router();

router.post("/", upload.single("profilePicture"), async (req, res) => {
	try {
		const userData = {
			name: JSON.parse(req.body.name),
			email: req.body.email,
			password: req.body.password,
		};

		const validateErrorMessage = validateRegistration(userData);
		if (validateErrorMessage) {
			return handleError(res, 400, `Validation: ${validateErrorMessage}`);
		}
		if (req.file) {
			userData.image = {
				path: `/uploads/${req.file.filename}`,
				alt: `${userData.name.first} ${userData.name.last}`,
			};
		} else {
			userData.image = {
				path: "/uploads/default.webp",
				alt: "Default",
			};
		}

		const user = await registerUser(userData);
		res.status(201).send(user);
	} catch (error) {
		console.error("Error:", error);
		handleError(res, error.status || 400, error.message);
	}
});

router.post("/login", async (req, res) => {
	console.log(req.body);
	try {
		const validateErrorMessage = validateLogin(req.body);
		if (validateErrorMessage !== "") {
			return handleError(res, 400, "Validation: " + validateErrorMessage);
		}

		const { email, password } = req.body;
		const token = await loginUser(email, password);
		res.status(202).send(token);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

router.get("/:id", auth, async (req, res) => {
	try {
		const userInfo = req.user;
		const { id } = req.params;
		console.log(userInfo);
		console.log(id);

		if (userInfo._id !== id && !userInfo.isAdmin) {
			return res
				.status(403)
				.send(
					"Authorization Error: Only the same user or admin can get user info"
				);
		}

		const user = await getUser(id);
		res.status(200).send(user);
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
		res.status(200).send({ message: "User updated successfully", updatedUser });
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

router.delete("/:id", auth, async (req, res) => {
	try {
		const { id } = req.params;
		const deletedUser = await deleteUser(id);
		res.status(200).send(deletedUser);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

module.exports = router;
