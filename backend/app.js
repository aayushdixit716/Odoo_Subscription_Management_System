const express = require("express");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const dns = require("dns");

dotenv.config();
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Brightloop API is running!"
    });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(process.env.PORT || 5000, () => {
            console.log("Server running on port 5000");
        });
    })
    .catch((error) => {
        console.log("MongoDB Error:", error.message);
    });
