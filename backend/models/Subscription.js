
const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    subscriptionNumber: {
        type: String,
        unique: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["draft", "confirmed", "active", "paused", "closed"],
        default: "active"
    }
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
