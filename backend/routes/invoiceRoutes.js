const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createInvoice,
    getInvoices,
    updateInvoiceStatus
} = require("../controllers/invoiceController");

router.get("/", protect, getInvoices);
router.post("/", protect, authorize("admin", "staff"), createInvoice);
router.patch("/:id/status", protect, updateInvoiceStatus);

module.exports = router;