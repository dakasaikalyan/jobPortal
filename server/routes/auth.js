const express = require("express")
const { body } = require("express-validator")
const authController = require("../controllers/authController")
const { protect } = require("../middleware/auth")

const router = express.Router()

// Validation middleware
const registerValidation = [
  body("firstName").trim().isLength({ min: 2, max: 50 }).withMessage("First name must be between 2 and 50 characters"),
  body("lastName").trim().isLength({ min: 2, max: 50 }).withMessage("Last name must be between 2 and 50 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(["jobseeker", "employer", "admin", "volunteer"]).withMessage("Invalid role"),
]

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
]

const otpValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
]

const verifyOtpValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
  body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
]

// Routes
router.post("/register", registerValidation, authController.register)
router.post("/login", loginValidation, authController.login)
router.post("/send-otp", otpValidation, authController.sendOTP)
router.post("/verify-otp", verifyOtpValidation, authController.verifyOTP)
router.post("/google", authController.googleAuth)
router.post("/facebook", authController.facebookAuth)
router.get("/me", protect, authController.getMe)
router.post("/logout", protect, authController.logout)
router.post("/refresh-token", authController.refreshToken)

module.exports = router 