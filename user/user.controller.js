import asyncHandler from "express-async-handler";
import express from "express";
import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import dotenv from "dotenv";

dotenv.config();
//
export const signUp = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    DOB,
    role,
    recoveryEmail,
    mobileNumber,
    status,
  } = req.body;
  console.log(req.body);

  const isMatch = await User.findOne({ $or: [{ email }, { mobileNumber }] });
  if (isMatch) {
    res.status(200).json({
      success: false,
      message: "Email or MobilePhone is already exist",
    });
  } //
  else {
    const rounds = +process.env.ROUNDS;
    const hashedPassword = bcryptjs.hashSync(password, rounds);
    const user = new User({
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword,
      recoveryEmail,
      DOB,
      mobileNumber,
      status,
    });
    await user.save();
    res.status(200).json({
      success: true,
      message: "User signed Up successfully",
      user,
    });
  }
});

//

export const signIn = asyncHandler(async (req, res, next) => {
  const { loginInput, password } = req.body;
  const user = await User.findOne({
    $or: [{ email: loginInput }, { mobileNumber: loginInput }],
  }).select("+password");
  if (user) {
    const isMatch = await bcryptjs.compare(password, user.password);
    if (isMatch) {
      const token_key = process.env.ACCESS_TOKEN_KEY;
      const token = jwt.sign({ user }, token_key, { expiresIn: "3d" });
      user.status = "Online";
      await user.save();
      res.status(200).json({
        success: true,
        user,
        token,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid credintials",
      });
    }
  } else {
    res.status(404).json({
      message: "User is not found",
    });
  }
});

//update account

export const updateUser = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const data = req.body;
  let isMatch;
  if (data.email) {
    isMatch = await User.findOne({ email: data.email });
  }
  if (isMatch) {
    return next(new Error("Email is already exist"));
  }
  if (data.mobileNumber) {
    isMatch = await User.findOne({ mobileNumber: data.mobileNumber });
  }
  if (isMatch) {
    return next(new Error("Mobile phone is already exist"));
  }
  const user = await User.findByIdAndUpdate(id, data, { new: true });
  if (!user) {
    return next(new Error("User not found"), { cause: 400 });
  }
  res.status(200).json({
    success: true,
    message: "User is updated successfully",
    user,
  });
});

//delete account

export const deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const deleted = await User.findByIdAndDelete(id);
  await Company.deleteOne({ Company_HR: id });
  if (!deleted) {
    return next(new Error("User not found"), { cause: 404 });
  }
  res.status(200).json({
    success: true,
    message: "user deleted successfully",
  });
});

//get user account data

export const getData = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new Error("User is not logged in", { cause: 400 }));
  }
  res.status(200).json({
    status: true,
    user,
  });
});

//get profile data

export const getProfileData = asyncHandler(async (req, res, next) => {
  const id = req.query.id;
  const user = await User.findById(id);
  if (!user) return next(new Error("User not found", { cause: 404 }));

  res.status(200).json({
    success: true,
    user,
  });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPass, newPass } = req.body;
  const id = req.user._id;

  const user = await User.findById(id).select("+password");
  // console.log(user);
  if (!user) return next(new Error("user is not found"), { cause: 404 });
  console.log(isMatch);
  const isMatch = await bcryptjs.compare(oldPass, user.password);
  if (!isMatch) return next(new Error("wrong password"));
  user.password = newPass;
  await user.save();
  const HR = await Company.findById(id);
  if (HR) {
    HR.password = newPass;
    await HR.save();
  }
  res.status({
    success: true,
    user,
  });
});

//Get all accounts associated to a specific recovery Email
export const getAllAccounts = asyncHandler(async (req, res, next) => {
  const { recoveryEmail } = req.body;
  const users = await User.find({ recoveryEmail });
  if (!users) return next(new Error("users not found", { cause: 404 }));
  res.status(200).json({ success: true, users });
});

//forget password

export const forgetPass = asyncHandler(async (req, res, next) => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = await jwt.sign(
    { activationCode },
    process.env.ACTIVATION_SECRET,
    {
      expiresIn: "120m",
    }
  );
  res.status(200).json({
    success: true,
    activationToken: token,
    OTP: activationCode,
  });
});

export const resetPass = asyncHandler(async (req, res, next) => {
  const { OTP, newPass } = req.body;
  const { activation } = req.headers;
  const code = jwt.verify(activation, process.env.ACTIVATION_SECRET);
  if (code.activationCode != OTP)
    return next(new Error("The activaton code is incorrect"), { cause: 400 });
  const user = await User.findById(req.user._id);
  if (!user) return next(new Error("User is not found", { cause: 404 }));
  const hashedPassword = bcryptjs.hashSync(newPass, +process.env.ROUNDS);
  user.password = hashedPassword;
  await user.save();
  res.status(200).json({
    success: true,
    user,
  });
});
