
const Plan = require("../models/Plan");

exports.createPlan = async (req, res) => {
    try {
        const { name, price, frequency, minimumQuantity } = req.body;

        if (!name || price == null || !frequency) {
            return res.status(400).json({
                success: false,
                message: "Name, price and frequency are required"
            });
        }

        const plan = await Plan.create(req.body);

        res.status(201).json({
            success: true,
            message: "Plan created successfully",
            plan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getPlans = async (req, res) => {
    try {
        const plans = await Plan.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: plans.length,
            plans
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        const plan = await Plan.findByIdAndDelete(req.params.id);

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }

        res.json({
            success: true,
            message: "Plan deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
