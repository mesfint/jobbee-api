const express = require("express");
const validator = require("validator");
const router = express.Router();
const jobsModel = require("../models/jobs");
const {
  getJobs,
  newJob,
  getJobsInRadius,
  updateJob,
  deleteJob,
  getJob,
  jobStats,
} = require("../controllers/jobs");

const { isAuthenticatedUser } = require("../middlewares/auth");

//Import Jobs Controller methods

router.route("/jobs").get(getJobs);
router.route("/jobs/:zipcode/:distance").get(getJobsInRadius);
router.route("/job/:id/:slug").get(getJob);
router.route("/stats/:topic").get(jobStats);

//Only the employers can create a job
router.route("/job/new").post(isAuthenticatedUser, newJob);

router.route("/job/:id").put(isAuthenticatedUser, updateJob);
router.route("/job/:id").delete(isAuthenticatedUser, deleteJob);

module.exports = router;
