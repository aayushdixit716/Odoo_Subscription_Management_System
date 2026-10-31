const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");

const createPayment = async (req, res) => {
    try {
        const { invoiceId, amount, paymentMethod, transactionId } = req.body;

        const invoice = await Invoice.findById(invoiceId);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }

        if (
            req.user.role === "customer" &&
            invoice.customer.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        if (invoice.status === "paid" || invoice.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Invoice cannot be paid"
            });
        }

        if (Number(amount) !== invoice.totalAmount) {
            return res.status(400).json({
                success: false,
                message: "Payment amount must match invoice total"
            });
        }

        const payment = await Payment.create({
            invoice: invoice._id,
            customer: invoice.customer,
            amount,
            paymentMethod,
            transactionId,
            status: "completed"
        });

        invoice.status = "paid";
        invoice.paidAt = new Date();
        await invoice.save();

        res.status(201).json({
            success: true,
            message: "Payment successful",
            payment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getPayments = async (req, res) => {
    try {
        const filter = req.user.role === "customer"
            ? { customer: req.user._id }
            : {};

        const payments = await Payment.find(filter)
            .populate("invoice")
            .populate("customer", "name email")
            .sort({ createdAt: -1 });

        res.json({ success: true, payments });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { createPayment, getPayments };