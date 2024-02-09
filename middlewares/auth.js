import jwt from "jsonwebtoken";
import express from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
export const verifyAuth = asyncHandler(async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return next(new Error("Please login to your account", { cause: 400 }));
  }
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
  if (!decoded)
    return next(
      new Error("Please login to acess this resource", { cause: 400 })
    );
  req.user = decoded.user;
  next();
});

export const validateRole = (role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(new Error("you are not authorized to acess this resource"));
    }
    next();
  };
};
