const User = require("../models/users");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");

//Get Current user Profile => /api/v1/me

exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  .populate({
    path: "jobPublished",
    select: "title postingDate"
  })

  res.status(200).json({
    success: true,
    data: user,
  });
});

//Update current user Password => /api/v1/password/update

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  //check previous user password
  //currentPassword=> is the existing password
  const isMatched = await user.comparePassword(req.body.currentPassword); //comparePassword is from user model
  if (!isMatched) {
    return next(new ErrorHandler(" Old Password is incorrect.", 401));
  }
  //newPassword => The new password
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

//Update current user data => /api/v1/me/update

exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

//Delete current user => /api/v1/me/delete

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user.id);

  res.cookie("token", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Your account has been deleted.",
  });
});
