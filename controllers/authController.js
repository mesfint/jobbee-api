const User = require("../models/users");

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

//Register a new user  => /api/v1/user/register

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    password,
    email,
    role,
  });

  //Create JWT Token
  /*const token = user.getJwtToken();

  res.status(200).json({
    success: true,
    message: "User created Successfully",
    token,
  });*/
  sendToken(user, 200, res);
});

//Login user => /api/v1/login

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
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
  /*const token = user.getJwtToken();

  res.status(200).json({
    success: false,
    token,
  });*/
  sendToken(user, 200, res);
});

//Forgot Password => /api/v1/password/forgot

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  // Check user email is database

  if (!user) {
    return next(new ErrorHandler("No user found with this email.", 404));
  }
  //But if the user is in db then Get reset token
  //console.log("user =>", user);

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //Create rset password url

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Ỳour password reset link is as follow:\n\n${resetUrl}\n\n If you have not request this, then please ignore that.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Jobbee-API Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent successfully to: ${user.email}`,
    });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("Email is not sent."), 500);
  }
});
