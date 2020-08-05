const express = require("express");
const auth = require("../middleware/auth");

const { bookRental, indexRental, returnRental } = require("../control/rental");

const router = express.Router();

router.route("/").post(auth, bookRental).get(auth, indexRental);
router.route("/return").post(auth, returnRental);

module.exports = router;
