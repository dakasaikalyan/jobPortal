const express = require("express")
const { body } = require("express-validator")
const userController = require("../controllers/userController")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// Validation middleware
const profileValidation = [
  body("profile.title").optional({ checkFalsy: true, nullable: true }).trim().isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),
  body("profile.summary").optional({ checkFalsy: true, nullable: true }).trim().isLength({ max: 1000 }).withMessage("Summary cannot exceed 1000 characters"),
  body("profile.phone").optional({ checkFalsy: true, nullable: true }).matches(/^\+?[\d\s\-\(\)]+$/).withMessage("Please enter a valid phone number"),
  body("profile.website").optional({ checkFalsy: true, nullable: true }).isURL().withMessage("Please enter a valid website URL"),
  body("profile.linkedin").optional({ checkFalsy: true, nullable: true }).isURL().withMessage("Please enter a valid LinkedIn URL"),
  body("profile.github").optional({ checkFalsy: true, nullable: true }).isURL().withMessage("Please enter a valid GitHub URL"),
  body("profile.youtube").optional({ checkFalsy: true, nullable: true }).isURL().withMessage("Please enter a valid YouTube URL"),
]

// All routes are protected
router.use(protect)

// User profile routes
router.get("/profile", userController.getProfile)
router.put("/profile", profileValidation, userController.updateProfile)
router.post("/profile/visibility", userController.updateProfileVisibility)
router.post("/profile/resume", userController.uploadResume)

// Admin routes
router.get("/", authorize("admin"), userController.getAllUsers)
router.get("/volunteers", authorize("admin"), userController.getVolunteers)
router.patch("/:id/approve", authorize("admin"), userController.approveVolunteer)
router.patch("/:id/role", authorize("admin"), userController.updateUserRole)
router.delete("/:id", authorize("admin"), userController.deleteUser)

module.exports = router 