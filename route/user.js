const express = require("express");
const auth = require("../middleware/auth");

const { createUser, loginUser, logout } = require("../control/user");

const router = express.Router();

router.route("/").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").post(auth, logout);

module.exports = router;
