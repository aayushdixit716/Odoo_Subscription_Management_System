
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const User = require("../models/User");

router.get("/", protect, authorize("admin", "staff"), async (req, res) => {
  try {
    const customers = await User.find({ role: "customer", isActive: true })
      .select("name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
