const express = require("express")
const { body } = require("express-validator")
const applicationController = require("../controllers/applicationController")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// Validation middleware
const applicationValidation = [
  body("coverLetter").optional().trim().isLength({ max: 2000 }).withMessage("Cover letter cannot exceed 2000 characters"),
]

// All routes are protected
router.use(protect)

// Job seeker routes
router.post("/", applicationValidation, applicationController.createApplication)
router.get("/my-applications", applicationController.getMyApplications)
router.delete("/:id", applicationController.withdrawApplication)

// Employer routes
router.get("/job/:jobId", authorize("employer", "admin"), applicationController.getJobApplications)
router.patch("/:id/status", authorize("employer", "admin"), applicationController.updateApplicationStatus)
router.post("/:id/notes", authorize("employer", "admin"), applicationController.addApplicationNote)

// Admin routes
router.get("/", authorize("admin"), applicationController.getAllApplications)

module.exports = router 