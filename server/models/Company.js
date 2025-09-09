const mongoose = require("mongoose")

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [2000, "Company description cannot exceed 2000 characters"],
    },
    website: {
      type: String,
    },
    logo: {
      filename: String,
      path: String,
      uploadDate: Date,
    },
    industry: {
      type: String,
      required: [true, "Industry is required"],
    },
    size: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
      required: true,
    },
    founded: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
    },
    headquarters: {
      city: String,
      state: String,
      country: String,
    },
    socialMedia: {
      linkedin: String,
      twitter: String,
      facebook: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Company", companySchema)
