const User = require("../models/users");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const Job = require("../models/jobs");
const fs = require("fs");
const APIFILTERS = require("../utils/apiFilters");

//Get Current user Profile => /api/v1/me

exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: "jobPublished",
    select: "title postingDate",
  });

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

//Show all applied jobs => /api/v1/jobs/applied

exports.getAppliedJobs = catchAsyncErrors(async (req, res, next) => {
  //All jobs applied by a user
  const jobs = await Job.find({ "applicantsApplied.id": req.user.id }).select(
    "+applicantsApplied"
  );
  res.status(200).json({
    success: true,
    results: jobs.length,
    data: jobs,
  });
});
//Show all Jobs published by employer/admin
exports.getPublishedJobs = catchAsyncErrors(async (req, res, next) => {
  //get all jobs which has user id
  const jobs = await Job.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    results: jobs.length,
    data: jobs,
  });
});

//Delete current user => /api/v1/me/delete

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  //delete user associated files
  deleteUserData(req.user.id, req.user.role);

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
// Adding controller methods that only acceessible by admins

// Show all user => /api/v1/users

exports.getUsers = catchAsyncErrors(async (req, res, next) => {
  const apiFilters = new APIFILTERS(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const users = await apiFilters.query;
  res.status(200).json({
    success: true,
    results: users.length,
    data: users,
  });
});

//delete User(Admin) => /api/v1/user:id
exports.deleteUserByAdmin = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  //First make user exist

  if (!user) {
    return next(
      new ErrorHandler(` User not found with id: ${req.params.id}`, 404)
    );
  }

  deleteUserData(user.id, user.role);
  await user.remove();
  res.status(200).json({
    success: true,
    message: "User is deleted by admin",
  });
});

//delete user files and employer jobs
async function deleteUserData(user, role) {
  if (role === "employer") {
    await Job.deleteMany({ user: user });
  }
  if (role === "user") {
    const appliedJobs = await Job.find({ "applicantsApplied.id": user }).select(
      "+applicantsApplied"
    );

    for (let i = 0; i < applicantsApplied.length; i++) {
      let obj = appliedJobs[i].applicantsApplied.find((o) => o.id === user);

      console.log(__dirname);

      let filepath = `${__dirname}/public/uploads/${obj.resume}`.replace(
        "\\controllers",
        ""
      );
      //unlink deletes file
      fs.unlink(filepath, (err) => {
        if (err) return console.log(err);
      });
      appliedJobs[i].applicantsApplied.splice(
        appliedJobs[i].applicantsApplied.indexOf(obj.id)
      );
      await appliedJobs[i].save();
    }
  }
}
