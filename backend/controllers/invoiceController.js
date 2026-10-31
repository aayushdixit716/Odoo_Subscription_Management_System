const Invoice = require("../models/Invoice");
const Subscription = require("../models/Subscription");

const createInvoice = async (req, res) => {
    try {
        const { subscriptionId, tax = 0, dueDate } = req.body;

        const subscription = await Subscription.findById(subscriptionId);

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }

        // Customer can only create invoice for own subscription
        if (
            req.user.role === "customer" &&
            subscription.customer.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const amount = subscription.totalAmount;
        const totalAmount = amount + Number(tax);

        const invoice = await Invoice.create({
            invoiceNumber: `INV-${Date.now()}`,
            subscription: subscription._id,
            customer: subscription.customer,
            amount,
            tax: Number(tax),
            totalAmount,
            dueDate
        });

        res.status(201).json({
            success: true,
            message: "Invoice created successfully",
            invoice
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getInvoices = async (req, res) => {
    try {
        const filter = req.user.role === "customer"
            ? { customer: req.user._id }
            : {};

        const invoices = await Invoice.find(filter)
            .populate("customer", "name email")
            .populate("subscription")
            .sort({ createdAt: -1 });

        res.json({ success: true, invoices });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateInvoiceStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowed = ["confirmed", "paid", "cancelled"];

        if (!allowed.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid invoice status"
            });
        }

        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }

        if (
            req.user.role === "customer" &&
            (status !== "paid" ||
             invoice.customer.toString() !== req.user._id.toString())
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        invoice.status = status;
        if (status === "paid") invoice.paidAt = new Date();

        await invoice.save();

        res.json({
            success: true,
            message: "Invoice updated",
            invoice
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createInvoice,
    getInvoices,
    updateInvoiceStatus
};