# Job Portal Backend Server

This is the backend API server for the Job Portal application built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` (if available)
   - Or create `.env` file with the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/job-portal
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   ```

3. **Set up MongoDB:**
   - **Option A: Local MongoDB** - Follow `install-mongodb-local.md`
   - **Option B: MongoDB Atlas** - Follow `setup-mongodb-atlas.md`

4. **Test database connection:**
   ```bash
   npm run test-db
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   ├── jobController.js     # Job management
│   ├── companyController.js # Company management
│   └── applicationController.js # Job applications
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── models/
│   ├── User.js             # User model
│   ├── Job.js              # Job model
│   ├── Company.js          # Company model
│   └── Application.js      # Application model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── users.js            # User routes
│   ├── jobs.js             # Job routes
│   ├── companies.js        # Company routes
│   └── applications.js     # Application routes
├── app.js                  # Main server file
├── package.json            # Dependencies and scripts
└── .env                    # Environment variables
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/otp/send` - Send OTP
- `POST /api/auth/otp/verify` - Verify OTP
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/facebook` - Facebook OAuth

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/volunteers` - Get volunteers (admin only)
- `PUT /api/users/volunteers/:id/approve` - Approve volunteer (admin only)

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (company only)
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job (company only)
- `DELETE /api/jobs/:id` - Delete job (company only)
- `GET /api/jobs/freelance` - Get freelance jobs

### Companies
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create company
- `GET /api/companies/:id` - Get company by ID
- `PUT /api/companies/:id` - Update company

### Applications
- `POST /api/applications` - Apply for job
- `GET /api/applications/user` - Get user applications
- `GET /api/applications/job/:jobId` - Get job applications (company only)

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/job-portal` |
| `JWT_SECRET` | JWT signing secret | Required |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `EMAIL_HOST` | SMTP host for OTP | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Email username | Required for OTP |
| `EMAIL_PASS` | Email password | Required for OTP |

## 🛠️ Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test-db` - Test database connection
- `npm run seed` - Seed database with sample data

## 🔍 Troubleshooting

### Database Connection Issues
1. Run `npm run test-db` to diagnose connection problems
2. Check if MongoDB is running
3. Verify your `.env` file has the correct `MONGODB_URI`
4. For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
If port 5000 is already in use, change the `PORT` in your `.env` file:
```env
PORT=5001
```

### JWT Issues
Make sure you have a strong `JWT_SECRET` in your `.env` file:
```env
JWT_SECRET=your-very-long-and-secure-secret-key-here
```

## 📝 Features

- ✅ User authentication (email/password, OTP, social login)
- ✅ JWT-based authorization
- ✅ User profiles with freelance experience
- ✅ Job posting and management
- ✅ Company profiles
- ✅ Job applications
- ✅ Admin approval system for volunteers
- ✅ Freelance job support
- ✅ Portfolio links (YouTube/GitHub)
- ✅ Rate limiting and security middleware
- ✅ Input validation
- ✅ Error handling

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation with express-validator
- JWT token authentication
- Password hashing with bcryptjs
- Environment variable protection

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify your MongoDB connection
3. Check the server logs for error messages
4. Ensure all environment variables are set correctly 