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
  applyJob,
} = require("../controllers/jobs");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

//Import Jobs Controller methods

router.route("/jobs").get(getJobs);
router.route("/jobs/:zipcode/:distance").get(getJobsInRadius);
router.route("/job/:id/:slug").get(getJob);
router.route("/stats/:topic").get(jobStats);

router
  .route("/job/:id/apply")
  .put(isAuthenticatedUser, authorizeRoles("user"), applyJob); //Only user can apply a job

//Only the employers can create a job
router
  .route("/job/new")
  .post(isAuthenticatedUser, authorizeRoles("employer", "admin"), newJob);

router
  .route("/job/:id")
  .put(isAuthenticatedUser, authorizeRoles("employer", "admin"), updateJob);
router
  .route("/job/:id")
  .delete(isAuthenticatedUser, authorizeRoles("employer", "admin"), deleteJob);

module.exports = router;
