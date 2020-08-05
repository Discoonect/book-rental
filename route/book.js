const express = require("express");
const auth = require("../middleware/auth");

const { getBook } = require("../control/book");

const router = express.Router();

router.route("/").get(getBook);

module.exports = router;
