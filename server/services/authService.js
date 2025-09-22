
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error("Missing fields");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("User already exists");
  }

  const hashed = await bcrypt.hash(password, 10);

  const role =
    process.env.ADMIN_EMAIL &&
    email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
      ? "admin"
      : "user";

  const user = await User.create({ name, email, password: hashed, role });

  const token = generateToken(user._id);

  return {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  };
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Missing fields");
  }

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = generateToken(user._id);

  return {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  };
};

export const forgotPasswordService = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

 
  const resetToken = crypto.randomBytes(32).toString("hex");

  
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; 
  await user.save();

  
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  return {
    message: "Password reset link generated",
    resetUrl,
  };
};

export const resetPasswordService = async (token, newPassword) => {
  if (!token || !newPassword) {
    throw new Error("Token and new password are required");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return { message: "Password has been reset successfully" };
};