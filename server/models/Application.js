const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: {
      type: String,
      maxlength: [2000, "Cover letter cannot exceed 2000 characters"],
    },
    resume: {
      filename: String,
      path: String,
      uploadDate: Date,
    },
    status: {
      type: String,
      enum: ["pending", "reviewing", "shortlisted", "interview-scheduled", "rejected", "hired"],
      default: "pending",
    },
    notes: [
      {
        content: String,
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    interview: {
      scheduled: Boolean,
      date: Date,
      time: String,
      location: String,
      type: {
        type: String,
        enum: ["phone", "video", "in-person"],
      },
      notes: String,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true })

module.exports = mongoose.model("Application", applicationSchema)
