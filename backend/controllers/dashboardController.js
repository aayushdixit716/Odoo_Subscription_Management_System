const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");

const getDashboard = async (req, res) => {
    try {
        const totalCustomers = await User.countDocuments({ role: "customer" });

        const totalSubscriptions = await Subscription.countDocuments();
        const activeSubscriptions = await Subscription.countDocuments({
            status: "active"
        });

        const totalInvoices = await Invoice.countDocuments();
        const pendingInvoices = await Invoice.countDocuments({
            status: { $in: ["draft", "confirmed"] }
        });

        const overdueInvoices = await Invoice.countDocuments({
            status: { $in: ["draft", "confirmed"] },
            dueDate: { $lt: new Date() }
        });

        const revenueResult = await Payment.aggregate([
            { $match: { status: "completed" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.json({
            success: true,
            dashboard: {
                totalCustomers,
                totalSubscriptions,
                activeSubscriptions,
                totalInvoices,
                pendingInvoices,
                overdueInvoices,
                totalRevenue: revenueResult[0]?.total || 0
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getDashboard };