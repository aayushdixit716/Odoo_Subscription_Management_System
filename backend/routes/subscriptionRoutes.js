
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createSubscription,
    getSubscriptions
} = require("../controllers/subscriptionController");

router.post("/", protect, createSubscription);
router.get("/", protect, getSubscriptions);

module.exports = router;
