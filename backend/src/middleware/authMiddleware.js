import User from "../models/auth/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler'

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
