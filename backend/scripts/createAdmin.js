// backend/scripts/createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import userModel from "../models/userModel.js";
import { connectDB } from "../config/db.js";

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Admin credentials (you can modify these)
    const adminData = {
      username: "admin",
      email: "admin@foodieus.com",
      password: "admin123456", // Change this to a secure password
      role: "admin",
    };

    // Check if admin already exists
    const existingAdmin = await userModel.findOne({
      $or: [{ email: adminData.email }, { role: "admin" }],
    });

    if (existingAdmin) {
      console.log("❌ Admin already exists!");
      process.exit(1);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const newAdmin = new userModel({
      username: adminData.username,
      email: adminData.email,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();

    console.log("✅ Admin created successfully!");
    console.log(`📧 Email: ${adminData.email}`);
    console.log(`🔑 Password: ${adminData.password}`);
    console.log("⚠️  Please change the password after first login");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
