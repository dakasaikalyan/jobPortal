const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const connectDB = require("./config/database")
const authRoutes = require("./routes/auth")
const jobRoutes = require("./routes/jobs")
const userRoutes = require("./routes/users")
const applicationRoutes = require("./routes/applications")
const companyRoutes = require("./routes/companies")
const app = express()

// Connect to MongoDB
connectDB()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002"
    ],
    credentials: true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Logging
app.use(morgan("combined"))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/users", userRoutes)
app.use("/api/applications", applicationRoutes)
app.use("/api/companies", companyRoutes)

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err.stack,
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
