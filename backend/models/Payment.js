const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "upi", "card", "bank_transfer"],
        required: true
    },
    transactionId: String,
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "completed"
    },
    paymentDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);