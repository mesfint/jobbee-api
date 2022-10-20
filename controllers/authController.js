const User = require("../models/users");

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

//Register a new user  => /api/v1/user/register

exports.registerUser = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    password,
    email,
    role,
  });

  //Create JWT Token
  const token = user.getJwtToken();

  res.status(200).json({
    success: true,
    message: "User created Successfully",
    token,
  });
};

//Login user => /api/v1/login

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  //Check is email or pass is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("please enter email or password "), 400);
  }
  //Finding user in db
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password."), 401);
  }
  // Check if password is correct
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password"), 401);
  }
  //Create JWT Token
  const token = user.getJwtToken();

  res.status(200).json({
    success: false,
    token,
  });
};
