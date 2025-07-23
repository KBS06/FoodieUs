// backend/controllers/userController.js
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//LOGIN FUNCTION
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User Doesn't Exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = createToken(user._id, user.role);
    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.username,
        id: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//CREATE A TOKEN
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET);
};

//REGISTER FUNCTION
const registerUser = async (req, res) => {
  const { username, password, email, role = "user" } = req.body;

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User Already Exists!!" });
    }

    //VALIDATION
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please Enter a Valid Email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please Enter a Strong Password",
      });
    }

    // Prevent admin registration through frontend (only allow user role)
    const userRole = role === "admin" ? "user" : role;

    //IF EVERYTHING WORKS
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //NEW USER
    const newUser = new userModel({
      username: username,
      email: email,
      password: hashedPassword,
      role: userRole,
    });

    const user = await newUser.save();

    const token = createToken(user._id, user.role);
    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.username,
        id: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser };
