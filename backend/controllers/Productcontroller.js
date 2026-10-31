
const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
    try {
        const { name, type, salesPrice, costPrice, notes, variants } = req.body;

        if (!name || salesPrice == null || salesPrice < 0) {
            return res.status(400).json({
                success: false,
                message: "Valid name and sales price required"
            });
        }

        const product = await Product.create({
            name, type, salesPrice, costPrice, notes, variants
        });

        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({ success: true, count: products.length, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ success: true, message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
