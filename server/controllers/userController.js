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

    // If no profile payload or empty object, return current user without modifying
    if (!req.body.profile || (typeof req.body.profile === 'object' && Object.keys(req.body.profile).length === 0)) {
      return res.json({
        success: true,
        message: "No changes provided",
        data: user,
      })
    }

    // Normalize incoming fields (support mobileNumber alias and root-level fallbacks)
    const incoming = { ...(req.body.profile || {}) }
    // Accept fields accidentally sent at the root level
    if (req.body.phone && !incoming.phone) incoming.phone = req.body.phone
    if (req.body.mobileNumber && !incoming.phone) incoming.phone = req.body.mobileNumber
    if (req.body.location && !incoming.location) incoming.location = req.body.location

    // Whitelist allowed profile keys to avoid unexpected fields
    const allowedKeys = new Set([
      "title",
      "summary",
      "experience",
      "education",
      "skills",
      "location",
      "phone",
      "website",
      "linkedin",
      "github",
      "youtube",
      "isFreelancer",
      "freelanceCompany",
      "profileVisibility",
    ])

    const filtered = {}
    Object.keys(incoming).forEach((k) => {
      if (allowedKeys.has(k)) {
        filtered[k] = incoming[k]
      }
    })

    // Coerce and sanitize experience/education date fields and remove empties
    if (Array.isArray(filtered.experience)) {
      filtered.experience = filtered.experience
        .filter((e) => e && e.position && e.company)
        .map((e) => ({
          company: e.company,
          position: e.position,
          startDate: e.startDate ? new Date(e.startDate) : undefined,
          endDate: e.current ? undefined : (e.endDate ? new Date(e.endDate) : undefined),
          current: !!e.current,
          description: e.description || undefined,
        }))
    }
    if (Array.isArray(filtered.education)) {
      filtered.education = filtered.education
        .filter((e) => e && e.degree && e.institution)
        .map((e) => ({
          institution: e.institution,
          degree: e.degree,
          field: e.field || undefined,
          startDate: e.startDate ? new Date(e.startDate) : undefined,
          endDate: e.current ? undefined : (e.endDate ? new Date(e.endDate) : undefined),
          current: !!e.current,
        }))
    }
    if (filtered.location) {
      filtered.location = {
        city: filtered.location.city || undefined,
        state: filtered.location.state || undefined,
        country: filtered.location.country || undefined,
      }
      if (!filtered.location.city && !filtered.location.state && !filtered.location.country) {
        delete filtered.location
      }
    }
    if (incoming.mobileNumber && !incoming.phone) {
      incoming.phone = incoming.mobileNumber
      delete incoming.mobileNumber
    }

    // Update profile fields (handle undefined current profile safely)
    user.profile = {
      ...(user.profile || {}),
      ...filtered,
    }
    // Ensure mongoose tracks nested changes
    user.markModified('profile')

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