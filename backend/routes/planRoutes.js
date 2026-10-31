const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createPlan,
    getPlans,
    deletePlan
} = require("../controllers/Plancontroller");

router.get("/", protect, getPlans);
router.post("/", protect, authorize("admin", "staff"), createPlan);
router.delete("/:id", protect, authorize("admin"), deletePlan);

module.exports = router;