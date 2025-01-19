const express = require("express");
const router = express.Router();
const userRouterController = require("../users/routes/userControllers.js");
const dateController = require("../dates/routes/dateController.js");
const { handleError } = require("../utils/handleErrors");

router.use("/users", userRouterController);
router.use("/dates", dateController);

router.use((req, res) => {
	handleError(res, 404, "Path not found");
});

module.exports = router;
