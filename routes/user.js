const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updatePassword,
  updateUser,
  deleteUser,
  getAppliedJobs,
  getPublishedJobs,
  getUsers,
  deleteUserByAdmin,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router
  .route("/me")
  .get(isAuthenticatedUser, authorizeRoles("user"), getUserProfile);

router
  .route("/jobs/published")
  .get(
    isAuthenticatedUser,
    authorizeRoles("employer", "admin"),
    getPublishedJobs
  );

router.route("/jobs/applied").get(isAuthenticatedUser, getAppliedJobs);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateUser);

router.route("/me/delete").delete(isAuthenticatedUser, deleteUser);

//Admin only routes
router
  .route("/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUsers);

//delete users by admin
router
  .route("/user/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUserByAdmin);

module.exports = router;
