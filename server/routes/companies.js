const express = require("express")
const { body } = require("express-validator")
const companyController = require("../controllers/companyController")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// Validation middleware
const companyValidation = [
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Company name must be between 2 and 100 characters"),
  body("description").optional().trim().isLength({ max: 2000 }).withMessage("Description cannot exceed 2000 characters"),
  body("website").optional().isURL().withMessage("Please enter a valid website URL"),
  body("industry").trim().notEmpty().withMessage("Industry is required"),
  body("size").isIn(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]).withMessage("Invalid company size"),
  body("founded").optional().isInt({ min: 1800, max: new Date().getFullYear() }).withMessage("Invalid founding year"),
]

// Public routes
router.get("/", companyController.getCompanies)
router.get("/:id", companyController.getCompany)

// Protected routes
router.use(protect)

// Employer routes
router.post("/", authorize("employer"), companyValidation, companyController.createCompany)
router.put("/:id", authorize("employer"), companyValidation, companyController.updateCompany)
router.delete("/:id", authorize("employer"), companyController.deleteCompany)
router.post("/:id/logo", authorize("employer"), companyController.uploadLogo)

// Admin routes
router.patch("/:id/verify", authorize("admin"), companyController.verifyCompany)
router.patch("/:id/status", authorize("admin"), companyController.updateCompanyStatus)

module.exports = router 