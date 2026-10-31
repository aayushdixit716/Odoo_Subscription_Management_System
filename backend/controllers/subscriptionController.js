
const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");
const User = require("../models/User");

function calculateExpiry(startDate, frequency) {
    const date = new Date(startDate);

    if (frequency === "daily") date.setDate(date.getDate() + 1);
    if (frequency === "weekly") date.setDate(date.getDate() + 7);
    if (frequency === "monthly") date.setMonth(date.getMonth() + 1);
    if (frequency === "yearly") date.setFullYear(date.getFullYear() + 1);

    return date;
}

exports.createSubscription = async (req, res) => {
    try {
        const { planId, customerId, quantity = 1, startDate } = req.body;

        const plan = await Plan.findById(planId);

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }

        const customer = ["admin", "staff"].includes(req.user.role)
            ? await User.findById(customerId)
            : req.user;

        if (!customer || customer.role !== "customer") {
            return res.status(400).json({
                success: false,
                message: "Valid customer required"
            });
        }

        if (!Number.isInteger(quantity) || quantity < plan.minimumQuantity) {
            return res.status(400).json({
                success: false,
                message: `Minimum quantity is ${plan.minimumQuantity}`
            });
        }

        const start = startDate ? new Date(startDate) : new Date();

        if (Number.isNaN(start.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid start date"
            });
        }

        const expiry = calculateExpiry(start, plan.frequency);

        const subscription = await Subscription.create({
            subscriptionNumber: `SUB-${Date.now()}`,
            customer: customer._id,
            plan: plan._id,
            startDate: start,
            expiryDate: expiry,
            quantity,
            totalAmount: plan.price * quantity,
            status: "active"
        });

        res.status(201).json({
            success: true,
            message: "Subscription created successfully",
            subscription
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getSubscriptions = async (req, res) => {
    try {
        const filter = req.user.role === "customer"
            ? { customer: req.user._id }
            : {};

        const subscriptions = await Subscription.find(filter)
            .populate("customer", "name email")
            .populate("plan", "name price frequency")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: subscriptions.length,
            subscriptions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
