const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { validationResult } = require("express-validator")

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

    const { email, password } = req.body

    // Find user and include password
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
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

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store OTP in user document (in production, use Redis or similar)
    user.otp = otp
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    await user.save()

    // In production, send OTP via email/SMS
    console.log(`OTP for ${email}: ${otp}`)

    res.json({
      success: true,
      message: "OTP sent successfully",
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

    const user = await User.findOne({ 
      email, 
      otp, 
      otpExpiry: { $gt: new Date() } 
    })

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
        profile: {
          ...user?.profile,
          profilePicture,
        },
      })
      await user.save()
    } else {
      // Update existing user
      user.googleId = googleId
      user.emailVerified = true
      user.lastLogin = new Date()
      if (profilePicture) {
        user.profile = {
          ...user.profile,
          profilePicture,
        }
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
        profile: {
          ...user?.profile,
          profilePicture,
        },
      })
      await user.save()
    } else {
      // Update existing user
      user.facebookId = facebookId
      user.emailVerified = true
      user.lastLogin = new Date()
      if (profilePicture) {
        user.profile = {
          ...user.profile,
          profilePicture,
        }
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
