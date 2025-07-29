const Company = require("../models/Company")
const { validationResult } = require("express-validator")

// Get all companies
exports.getCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 10, industry, size, search } = req.query

    const query = { isActive: true }
    if (industry) query.industry = industry
    if (size) query.size = size
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ]
    }

    const companies = await Company.find(query)
      .populate("owner", "firstName lastName email")
      .sort({ verified: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Company.countDocuments(query)

    res.json({
      success: true,
      data: companies,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error("Get companies error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Get single company
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate("owner", "firstName lastName email")

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      })
    }

    res.json({
      success: true,
      data: company,
    })
  } catch (error) {
    console.error("Get company error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Create company
exports.createCompany = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    // Check if user already has a company
    const existingCompany = await Company.findOne({ owner: req.user.id })
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "You already have a company profile",
      })
    }

    const companyData = {
      ...req.body,
      owner: req.user.id,
    }

    const company = new Company(companyData)
    await company.save()

    await company.populate("owner", "firstName lastName email")

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    })
  } catch (error) {
    console.error("Create company error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Update company
exports.updateCompany = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const company = await Company.findById(req.params.id)

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      })
    }

    // Check if user owns this company
    if (company.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("owner", "firstName lastName email")

    res.json({
      success: true,
      message: "Company updated successfully",
      data: updatedCompany,
    })
  } catch (error) {
    console.error("Update company error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Delete company
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      })
    }

    // Check if user owns this company
    if (company.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    await Company.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "Company deleted successfully",
    })
  } catch (error) {
    console.error("Delete company error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Upload company logo
exports.uploadLogo = async (req, res) => {
  try {
    // In production, handle file upload with multer
    const { filename, path } = req.body

    const company = await Company.findById(req.params.id)
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      })
    }

    // Check if user owns this company
    if (company.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    company.logo = {
      filename,
      path,
      uploadDate: new Date(),
    }

    await company.save()

    res.json({
      success: true,
      message: "Logo uploaded successfully",
      data: company.logo,
    })
  } catch (error) {
    console.error("Upload logo error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Verify company (admin only)
exports.verifyCompany = async (req, res) => {
  try {
    const { id } = req.params
    const { verified } = req.body

    const company = await Company.findById(id)
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      })
    }

    company.verified = verified
    await company.save()

    res.json({
      success: true,
      message: `Company ${verified ? "verified" : "unverified"} successfully`,
      data: company,
    })
  } catch (error) {
    console.error("Verify company error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Update company status (admin only)
exports.updateCompanyStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { isActive } = req.body

    const company = await Company.findById(id)
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      })
    }

    company.isActive = isActive
    await company.save()

    res.json({
      success: true,
      message: `Company ${isActive ? "activated" : "deactivated"} successfully`,
      data: company,
    })
  } catch (error) {
    console.error("Update company status error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
} 