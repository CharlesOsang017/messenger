import User from "../models/auth/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
  try {
    // check if user is logged in
    const token = req.cookies.token;
    if (!token) {
      // 401 unauthorized
      res.status(401).json({ message: "Not authorized, login or sign up" });
    }
    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // GET USER DETAILS FROM THE TOKEN ==> EXCLUDE PASSWORD
    const user = await User.findById(decoded.id).select("-password");
    // check if user exists
    if (!user) {
      res.status(404).json({ message: "user not found!" });
    }
    // set user details in the request object
    req.user = user;
    next();
  } catch (error) {
    // 401 unauthorized
    res.status(401).json({ message: "Unauthorized" });
  }
});

// admin middleware
export const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    // if user is admin, move to the next middleware/controller
    next();
    return;
  }
  // if not admin, send 403 forbiden
  res.status(403).json({ message: "Only admin can perform this operation" });
});

// creator & admin midleware
export const creatorMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin" ||  req.user && req.user.role === "creator" ) {
    // if user is creator & admin move to the next middleware/controller
    next();
    return;
  }
  // if not creator or admin, send 403 forbidden
  res
    .status(403)
    .json({ message: "Creators/admins can perform this operation" });
});

// verified middleware
export const verifiedMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isVerified) {
    // if user is verified, move to the next controoler/middleware
    next();
    return;
  }
  // if not verified, send 403 forbidden
  res.status(403).json({ message: "Please verify your email" });
});
