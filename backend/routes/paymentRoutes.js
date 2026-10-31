const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createPayment,
    getPayments
} = require("../controllers/paymentController");

router.get("/", protect, getPayments);
router.post("/", protect, authorize("admin", "staff"), createPayment);

module.exports = router;