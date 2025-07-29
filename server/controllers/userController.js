const User = require("../models/User")
const { validationResult } = require("express-validator")

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -otp -otpExpiry")

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update profile fields
    if (req.body.profile) {
      user.profile = {
        ...user.profile,
        ...req.body.profile,
      }
    }

    await user.save()

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Update profile visibility
exports.updateProfileVisibility = async (req, res) => {
  try {
    const { visibility, isFreelancer, freelanceCompany } = req.body

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    user.profile.profileVisibility = visibility
    user.profile.isFreelancer = isFreelancer
    user.profile.freelanceCompany = freelanceCompany

    await user.save()

    res.json({
      success: true,
      message: "Profile visibility updated successfully",
      data: user.profile,
    })
  } catch (error) {
    console.error("Update profile visibility error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Upload resume
exports.uploadResume = async (req, res) => {
  try {
    // In production, handle file upload with multer
    const { filename, path } = req.body

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    user.resume = {
      filename,
      path,
      uploadDate: new Date(),
    }

    await user.save()

    res.json({
      success: true,
      message: "Resume uploaded successfully",
      data: user.resume,
    })
  } catch (error) {
    console.error("Upload resume error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query

    const query = {}
    if (role) query.role = role
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ]
    }

    const users = await User.find(query)
      .select("-password -otp -otpExpiry")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(query)

    res.json({
      success: true,
      data: users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error("Get all users error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Get volunteers (admin only)
exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await User.find({ 
      role: "volunteer" 
    })
      .select("-password -otp -otpExpiry")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: volunteers,
    })
  } catch (error) {
    console.error("Get volunteers error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Approve volunteer (admin only)
exports.approveVolunteer = async (req, res) => {
  try {
    const { id } = req.params
    const { approved } = req.body

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    if (user.role !== "volunteer") {
      return res.status(400).json({
        success: false,
        message: "User is not a volunteer",
      })
    }

    user.isVolunteerApproved = approved
    await user.save()

    res.json({
      success: true,
      message: `Volunteer ${approved ? "approved" : "rejected"} successfully`,
      data: user,
    })
  } catch (error) {
    console.error("Approve volunteer error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params
    const { role } = req.body

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    user.role = role
    await user.save()

    res.json({
      success: true,
      message: "User role updated successfully",
      data: user,
    })
  } catch (error) {
    console.error("Update user role error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    await User.findByIdAndDelete(id)

    res.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
} 