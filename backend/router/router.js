const express = require("express");
const router = express.Router();
const userRouterController = require("../users/routes/userControllers.js");
const dateRouterController = require("../users/routes/dateControllers.js");
const ideaRouterController = require("../ideas/routes/ideaControllers.js");
const { handleError } = require("../utils/handleErrors");

router.use("/users", userRouterController);
router.use("/dates", dateRouterController);
router.use("/ideas", ideaRouterController);

router.use((req, res) => {
	handleError(res, 404, "Path not found");
});

module.exports = router;
