
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ["service", "goods"],
        default: "service"
    },
    salesPrice: { type: Number, required: true },
    costPrice: { type: Number, default: 0 },
    notes: String,
    variants: [{
        name: String,
        additionalPrice: { type: Number, default: 0 }
    }]
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
