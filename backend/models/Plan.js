
const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
        required: true
    },
    minimumQuantity: {
        type: Number,
        default: 1,
        min: 1
    },
    startDate: Date,
    endDate: Date,
    autoClose: {
        type: Boolean,
        default: false
    },
    allowPause: {
        type: Boolean,
        default: true
    },
    allowRenew: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Plan", planSchema);
