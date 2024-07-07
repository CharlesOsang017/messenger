import asyncHandler from "express-async-handler";
import User from "../../models/auth/userModel.js";
import generateToken from "../../helpers/token.js";
import bcrypt from 'bcrypt'

// user registration
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //validation
  if (!name || !email || !password) {
    // 400 Bad Request
    res.status(400).json({ message: "All fields are required" });
  }
  //check password length
  if (password?.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be atleast 6 characters" });
  }
  // check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    //bad request
    return res.status(400).json({ message: "user already exists" });
  }
  // create new user
  const user = await User.create({ name, email, password });
  //generate token with user id
  const token = generateToken(user._id)
  // send back the user and token in te response to the client
  res.cookie('token', token, {
    path: '/',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
    sameSite: true,
    secure: true,
  })
  
  if (user) {
    const { _id, name, email, bio, photo, isVerified, role } = user;

    res.status(201).json({
      // 201 cretaed
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      token,
    });
  }else {
    res.status(400).json({message: 'invalid user data'})
  }
});

//user login
export const loginUser = asyncHandler(async(req, res)=>{
  // validation
  if (!email || !password){
    // 400 Bad Request
    return res.status(400).json({message: 'All fields are required'})
  }
  // check if user exists
  const userExists = await User.findOne({email})

  if(!userExists){
    return res.status(404).json({message: 'user not find'})
  }
  // check if the password matches the one hashed in the database
  const isMatch = await bcrypt.compare(password, userExists.password)

  if(!isMatch){
    return res.status(400).json({message: 'Invalid email or password'})
  }

  // generate token with user id
  const token = generateToken(userExists._id)
  if(userExists && isMatch){
    const {_id, name, email, bio, photo, role, isVerified} = userExists

    // set the token in the cookie
    res.cookie('token', token,{
      path: '/',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: true,
      secure: true,
    })
    // send back the user and token response to the client

    res.status(200).json({
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      token
    })
  }else {
    res.status(400).json({message: 'Invalid email or password'})
  }
})
