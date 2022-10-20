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

router.get("/", (req, res) => {
  res.send("<h1>Welcome!!!</h1>");
});
//Import allJobs Controller method

router.route("/jobs").get(getJobs);
router.route("/job/new").post(newJob);
router.route("/jobs/:zipcode/:distance").get(getJobsInRadius);
router.route("/job/:id").put(updateJob);
router.route("/job/:id").delete(deleteJob);
router.route("/job/:id/:slug").get(getJob);
router.route("/stats/:topic").get(jobStats);

module.exports = router;
