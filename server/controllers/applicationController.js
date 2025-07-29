const Application = require("../models/Application")
const Job = require("../models/Job")
const { validationResult } = require("express-validator")

// Create application
exports.createApplication = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { jobId, coverLetter } = req.body

    // Check if job exists
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    })

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      })
    }

    const application = new Application({
      job: jobId,
      applicant: req.user.id,
      coverLetter,
    })

    await application.save()

    // Increment application count
    job.applicationsCount += 1
    await job.save()

    await application.populate("job", "title company")

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    })
  } catch (error) {
    console.error("Create application error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Get my applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate("job", "title company location salary jobType")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: applications,
    })
  } catch (error) {
    console.error("Get my applications error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Withdraw application
exports.withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params

    const application = await Application.findById(id)
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      })
    }

    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    await Application.findByIdAndDelete(id)

    // Decrement application count
    const job = await Job.findById(application.job)
    if (job) {
      job.applicationsCount = Math.max(0, job.applicationsCount - 1)
      await job.save()
    }

    res.json({
      success: true,
      message: "Application withdrawn successfully",
    })
  } catch (error) {
    console.error("Withdraw application error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Get job applications (employer)
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params

    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Check if user owns this job
    if (job.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "firstName lastName email profile")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: applications,
    })
  } catch (error) {
    console.error("Get job applications error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const application = await Application.findById(id)
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      })
    }

    const job = await Job.findById(application.job)
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Check if user owns this job
    if (job.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    application.status = status
    await application.save()

    res.json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    })
  } catch (error) {
    console.error("Update application status error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Add application note
exports.addApplicationNote = async (req, res) => {
  try {
    const { id } = req.params
    const { content } = req.body

    const application = await Application.findById(id)
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      })
    }

    const job = await Job.findById(application.job)
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Check if user owns this job
    if (job.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    application.notes.push({
      content,
      addedBy: req.user.id,
    })

    await application.save()

    res.json({
      success: true,
      message: "Note added successfully",
      data: application,
    })
  } catch (error) {
    console.error("Add application note error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Get all applications (admin)
exports.getAllApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, jobId } = req.query

    const query = {}
    if (status) query.status = status
    if (jobId) query.job = jobId

    const applications = await Application.find(query)
      .populate("job", "title company")
      .populate("applicant", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Application.countDocuments(query)

    res.json({
      success: true,
      data: applications,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error("Get all applications error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
} 