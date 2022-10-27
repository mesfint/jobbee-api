const express = require("express");
const router = express.Router();

const { getUserProfile } = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middlewares/auth");

router.route("/me").get(isAuthenticatedUser, getUserProfile);

module.exports = router;
