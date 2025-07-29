const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      maxlength: [5000, "Job description cannot exceed 5000 characters"],
    },
    requirements: {
      type: String,
      required: [true, "Job requirements are required"],
      maxlength: [3000, "Job requirements cannot exceed 3000 characters"],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      city: String,
      state: String,
      country: String,
      remote: {
        type: Boolean,
        default: false,
      },
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: "USD",
      },
      period: {
        type: String,
        enum: ["hourly", "monthly", "yearly"],
        default: "yearly",
      },
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "freelance"],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["entry-level", "mid-level", "senior-level", "executive"],
      required: true,
    },
    skills: [String],
    benefits: [String],
    applicationDeadline: Date,
    status: {
      type: String,
      enum: ["active", "paused", "closed", "draft"],
      default: "active",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Index for search functionality
jobSchema.index({ title: "text", description: "text", skills: "text" })
jobSchema.index({ "location.city": 1, "location.state": 1 })
jobSchema.index({ jobType: 1, experienceLevel: 1 })
jobSchema.index({ createdAt: -1 })

module.exports = mongoose.model("Job", jobSchema)
