const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["jobseeker", "employer", "admin", "volunteer"],
      default: "jobseeker",
    },
    isVolunteerApproved: {
      type: Boolean,
      default: false,
    },
    profile: {
      title: String,
      summary: String,
      experience: [
        {
          company: String,
          position: String,
          startDate: Date,
          endDate: Date,
          current: Boolean,
          description: String,
        },
      ],
      education: [
        {
          institution: String,
          degree: String,
          field: String,
          startDate: Date,
          endDate: Date,
          current: Boolean,
        },
      ],
      skills: [String],
      location: {
        city: String,
        state: String,
        country: String,
      },
      phone: String,
      website: String,
      linkedin: String,
      github: String,
      youtube: String,
      isFreelancer: {
        type: Boolean,
        default: false,
      },
      freelanceCompany: String,
      profileVisibility: {
        type: String,
        enum: ["public", "private", "freelance-hidden"],
        default: "public",
      },
    },
    resume: {
      filename: String,
      path: String,
      uploadDate: Date,
    },
    preferences: {
      jobTypes: [String],
      salaryRange: {
        min: Number,
        max: Number,
      },
      locations: [String],
      remoteWork: Boolean,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: Date,
    otp: String,
    otpExpiry: Date,
    googleId: String,
    facebookId: String,
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Get full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`
})

module.exports = mongoose.model("User", userSchema)
