const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config({ path: "../.env" });
const User = require("./models/User");

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = "admin@brightloop.com";
        const password = "Brightloop@123";

        const hashedPassword = await bcrypt.hash(password, 12);

        await User.findOneAndUpdate(
            { email },
            {
                name: "Brightloop Admin",
                email,
                password: hashedPassword,
                role: "admin",
                isActive: true
            },
            { upsert: true, new: true }
        );

        console.log("Admin created successfully!");
        await mongoose.disconnect();

    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

createAdmin();