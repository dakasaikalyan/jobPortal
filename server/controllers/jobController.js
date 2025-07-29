const Job = require("../models/Job")
const Company = require("../models/Company")
const { validationResult } = require("express-validator")

// Get all jobs with filtering and pagination
exports.getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      jobType,
      experienceLevel,
      salaryMin,
      salaryMax,
      remote,
      featured,
    } = req.query

    // Build query
    const query = { status: "active" }

    // Text search
    if (search) {
      query.$text = { $search: search }
    }

    // Location filter
    if (location) {
      query.$or = [
        { "location.city": new RegExp(location, "i") },
        { "location.state": new RegExp(location, "i") },
        { "location.country": new RegExp(location, "i") },
      ]
    }

    // Job type filter
    if (jobType) {
      query.jobType = jobType
    }

    // Experience level filter
    if (experienceLevel) {
      query.experienceLevel = experienceLevel
    }

    // Salary range filter
    if (salaryMin || salaryMax) {
      query.salary = {}
      if (salaryMin) query.salary.min = { $gte: Number.parseInt(salaryMin) }
      if (salaryMax) query.salary.max = { $lte: Number.parseInt(salaryMax) }
    }

    // Remote work filter
    if (remote === "true") {
      query["location.remote"] = true
    }

    // Featured jobs filter
    if (featured === "true") {
      query.featured = true
    }

    // Execute query with pagination
    const jobs = await Job.find(query)
      .populate("company", "name logo industry size")
      .populate("postedBy", "firstName lastName")
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Job.countDocuments(query)

    res.json({
      success: true,
      data: jobs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error("Get jobs error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Get single job
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("company").populate("postedBy", "firstName lastName")

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Increment view count
    job.viewsCount += 1
    await job.save()

    res.json({
      success: true,
      data: job,
    })
  } catch (error) {
    console.error("Get job error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Create job (employers only)
exports.createJob = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    // Check if user is employer
    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Employers only.",
      })
    }

    // Find user's company
    const company = await Company.findOne({ owner: req.user.id })
    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Please create a company profile first",
      })
    }

    const jobData = {
      ...req.body,
      company: company._id,
      postedBy: req.user.id,
    }

    const job = new Job(jobData)
    await job.save()

    await job.populate("company", "name logo industry")

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    })
  } catch (error) {
    console.error("Create job error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Update job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Check if user owns this job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("company", "name logo industry")

    res.json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    })
  } catch (error) {
    console.error("Update job error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Check if user owns this job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    await Job.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "Job deleted successfully",
    })
  } catch (error) {
    console.error("Delete job error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Toggle featured status (admin only)
exports.toggleFeatured = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    job.featured = !job.featured
    await job.save()

    res.json({
      success: true,
      message: `Job ${job.featured ? "featured" : "unfeatured"} successfully`,
      data: job,
    })
  } catch (error) {
    console.error("Toggle featured error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Update job status (admin only)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    job.status = status
    await job.save()

    res.json({
      success: true,
      message: "Job status updated successfully",
      data: job,
    })
  } catch (error) {
    console.error("Update job status error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}
