const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { validationResult } = require("express-validator")
const crypto = require("crypto")

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  })
}

// Register user
exports.register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { firstName, lastName, email, password, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      })
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: role || "jobseeker",
    })

    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    })
  }
}

// Login user
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { email, password, userType } = req.body
    console.log("Login attempt:", { email, userType })
    
    // Find user and include password
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check if userType matches the user's role (optional validation)
    if (userType && userType !== user.role) {
      console.log(`User type mismatch: expected ${userType}, got ${user.role}`)
      // Don't block login, just log the mismatch
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Server error during login",
    })
  }
}

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    res.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Logout user (client-side token removal)
exports.logout = (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  })
}

// Forgot Password - generate reset token
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const resetToken = crypto.randomBytes(20).toString("hex")
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex")
    user.resetPasswordToken = resetTokenHash
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    await user.save()

    // In production: email the reset link containing token. For now, return token for testing/dev
    res.json({
      success: true,
      message: "Password reset token generated",
      token: resetToken,
      expiresInMinutes: 15,
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

// Reset Password - verify token and set new password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body
    if (!token || !password) {
      return res.status(400).json({ success: false, message: "Token and new password are required" })
    }

    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex")
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: new Date() },
    }).select("+password")

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" })
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.json({ success: true, message: "Password reset successful" })
  } catch (error) {
    console.error("Reset password error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

// Send OTP for login
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Static OTP for testing
    const otp = "123456"
    
    // Store OTP in user document (in production, use Redis or similar)
    user.otp = otp
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    await user.save()

    // In production, send OTP via email/SMS
    console.log(`OTP for ${email}: ${otp}`)

    res.json({
      success: true,
      message: "OTP sent successfully (use 123456)",
      otp: process.env.NODE_ENV !== 'production' ? otp : undefined
    })
  } catch (error) {
    console.error("Send OTP error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Verify OTP and login
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    // Allow static OTP 123456 for testing; also accept stored OTP if present
    const query = { email }
    let user = await User.findOne(query)
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" })
    }
    const isStatic = otp === "123456"
    const isStoredValid = user.otp === otp && user.otpExpiry && user.otpExpiry > new Date()
    if (!isStatic && !isStoredValid) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" })
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      })
    }

    // Clear OTP
    user.otp = undefined
    user.otpExpiry = undefined
    user.lastLogin = new Date()
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Verify OTP error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Google OAuth
exports.googleAuth = async (req, res) => {
  try {
    const { googleId, email, firstName, lastName, profilePicture } = req.body

    let user = await User.findOne({ email })

    if (!user) {
      // Create new user
      user = new User({
        firstName,
        lastName,
        email,
        googleId,
        emailVerified: true,
        profile: profilePicture ? { profilePicture } : undefined,
      })
      await user.save()
    } else {
      // Update existing user
      user.googleId = googleId
      user.emailVerified = true
      user.lastLogin = new Date()
      if (profilePicture) {
        user.profile = { ...(user.profile || {}), profilePicture }
      }
      await user.save()
    }

    const token = generateToken(user._id)

    res.json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Google auth error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Facebook OAuth
exports.facebookAuth = async (req, res) => {
  try {
    const { facebookId, email, firstName, lastName, profilePicture } = req.body

    let user = await User.findOne({ email })

    if (!user) {
      // Create new user
      user = new User({
        firstName,
        lastName,
        email,
        facebookId,
        emailVerified: true,
        profile: profilePicture ? { profilePicture } : undefined,
      })
      await user.save()
    } else {
      // Update existing user
      user.facebookId = facebookId
      user.emailVerified = true
      user.lastLogin = new Date()
      if (profilePicture) {
        user.profile = { ...(user.profile || {}), profilePicture }
      }
      await user.save()
    }

    const token = generateToken(user._id)

    res.json({
      success: true,
      message: "Facebook login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Facebook auth error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select("-password")

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      })
    }

    const newToken = generateToken(user._id)

    res.json({
      success: true,
      token: newToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Refresh token error:", error)
    res.status(401).json({
      success: false,
      message: "Invalid token",
    })
  }
}
