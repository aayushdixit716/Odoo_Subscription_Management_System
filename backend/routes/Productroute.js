
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createProduct,
    getProducts,
    deleteProduct
} = require("../controllers/Productcontroller");

router.get("/", protect, getProducts);
router.post("/", protect, authorize("admin", "staff"), createProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

module.exports = router;
