const express = require("express")
const { body } = require("express-validator")
const jobController = require("../controllers/jobController")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// Validation middleware
const jobValidation = [
  body("title").trim().isLength({ min: 5, max: 100 }).withMessage("Job title must be between 5 and 100 characters"),
  body("description").trim().isLength({ min: 50, max: 5000 }).withMessage("Job description must be between 50 and 5000 characters"),
  body("requirements").trim().isLength({ min: 20, max: 3000 }).withMessage("Job requirements must be between 20 and 3000 characters"),
  body("jobType").isIn(["full-time", "part-time", "contract", "internship", "freelance"]).withMessage("Invalid job type"),
  body("experienceLevel").isIn(["entry-level", "mid-level", "senior-level", "executive"]).withMessage("Invalid experience level"),
  body("salary.min").optional().isNumeric().withMessage("Minimum salary must be a number"),
  body("salary.max").optional().isNumeric().withMessage("Maximum salary must be a number"),
]

// Public routes
router.get("/", jobController.getJobs)
router.get("/:id", jobController.getJob)

// Protected routes
router.use(protect)

// Employer and admin only
router.post("/", authorize("employer", "admin"), jobValidation, jobController.createJob)
router.put("/:id", authorize("employer", "admin"), jobValidation, jobController.updateJob)
router.delete("/:id", authorize("employer", "admin"), jobController.deleteJob)

// Admin only
router.patch("/:id/feature", authorize("admin"), jobController.toggleFeatured)
router.patch("/:id/status", authorize("admin"), jobController.updateStatus)
router.patch("/:id/approve", authorize("admin"), jobController.approveJob)
router.patch("/:id/reject", authorize("admin"), jobController.rejectJob)
router.get("/pending", authorize("admin"), jobController.getPendingJobs)

module.exports = router 