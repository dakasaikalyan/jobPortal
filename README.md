# JobPortal Pro - Enhanced Job Portal

A modern, feature-rich job portal built with Next.js, TypeScript, and Node.js with comprehensive authentication, profile management, and admin capabilities.

## 🚀 Features

### Enhanced Authentication System
- **Multiple Login Methods**:
  - Email/Password authentication
  - OTP (One-Time Password) login
  - Google OAuth integration
  - Facebook OAuth integration
- **User Types**: Job Seeker, Employer, Admin, Volunteer
- **Secure JWT-based authentication**
- **Role-based access control**

### Profile Management
- **Comprehensive Profile System**:
  - Personal information and contact details
  - Professional summary and skills
  - Work experience and education history
  - Portfolio links (Website, LinkedIn, GitHub, YouTube)
- **Freelance Experience Support**:
  - Freelancer status toggle
  - Company name for freelance work
  - Profile visibility controls
- **Privacy Controls**:
  - Public profile visibility
  - Private profile mode
  - Freelance-hidden mode (profile hidden when freelancing)

### Job Management
- **Enhanced Job Types**:
  - Full-time positions
  - Part-time opportunities
  - Contract work
  - **Freelance projects** (NEW)
  - Internship positions
- **Advanced Filtering**:
  - Job type filtering
  - Location-based search
  - Experience level filtering
  - Salary range filtering
- **Featured Jobs System**

### Admin Dashboard
- **Volunteer Management**:
  - Review volunteer applications
  - Approve/reject volunteers
  - Manage volunteer status
- **User Management**:
  - View all platform users
  - Change user roles
  - Manage user accounts
- **Job Moderation**:
  - Review and moderate job listings
  - Feature/unfeature jobs
  - Manage job status
- **Analytics Dashboard**:
  - Platform statistics
  - User activity monitoring
  - Job posting analytics

### Volunteer System
- **Volunteer Registration**: Users can register as volunteers
- **Admin Approval**: Admins must approve volunteer applications
- **Volunteer Responsibilities**: Volunteers can help update job details
- **Approval Workflow**: Complete approval/rejection system

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **Lucide React** for icons
- **React Hook Form** for form handling

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Multer** for file uploads

## 📁 Project Structure

```
TESTZIP/
├── app/                          # Next.js app directory
│   ├── auth/                     # Authentication pages
│   │   ├── login/page.tsx        # Enhanced login with OTP/social
│   │   └── register/page.tsx     # User registration
│   ├── admin/page.tsx            # Admin dashboard
│   ├── profile/page.tsx          # Enhanced profile management
│   ├── jobs/page.tsx             # Job listings with freelance
│   └── dashboard/page.tsx        # User dashboard
├── components/                   # Reusable components
│   ├── ui/                       # Shadcn/ui components
│   ├── navbar.tsx               # Navigation with auth links
│   └── featured-jobs.tsx        # Job showcase
├── server/                      # Backend API
│   ├── controllers/             # API controllers
│   ├── models/                  # MongoDB models
│   ├── routes/                  # API routes
│   ├── middleware/              # Auth middleware
│   └── app.js                   # Express server
└── lib/                         # Utility functions
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB
- npm or pnpm

### Frontend Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables
Create a `.env` file in the server directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

## 🎯 Key Enhancements Implemented

### 1. Enhanced Login System
- ✅ Multiple authentication methods (Email/Password, OTP, Google, Facebook)
- ✅ User type selection (Job Seeker, Employer, Admin, Volunteer)
- ✅ Secure token-based authentication
- ✅ Role-based access control

### 2. Profile Management
- ✅ Comprehensive profile with freelance experience
- ✅ Portfolio links (YouTube, GitHub, LinkedIn, Website)
- ✅ Privacy controls and visibility settings
- ✅ Freelancer status with company information

### 3. Admin Approval System
- ✅ Volunteer application review system
- ✅ Admin dashboard for user management
- ✅ Job moderation capabilities
- ✅ Platform analytics and statistics

### 4. Freelance Job Support
- ✅ Freelance job type in job listings
- ✅ Freelance filtering in job search
- ✅ Freelance-specific job cards
- ✅ Hourly rate display for freelance jobs

### 5. Volunteer Management
- ✅ Volunteer registration and application
- ✅ Admin approval workflow
- ✅ Volunteer responsibilities for job updates
- ✅ Volunteer status tracking

## 🔐 Authentication Flow

1. **Registration**: Users select their role (Job Seeker, Employer, Volunteer)
2. **Login**: Multiple options available
   - Traditional email/password
   - OTP-based login
   - Social login (Google, Facebook)
3. **Role-based Access**: Different features based on user role
4. **Admin Approval**: Volunteers require admin approval

## 👥 User Roles & Permissions

### Job Seeker
- Browse and apply for jobs
- Manage profile and portfolio
- Save job preferences
- View application status

### Employer
- Post and manage job listings
- Review applications
- Manage company profile
- Access employer dashboard

### Volunteer
- Help update job details
- Requires admin approval
- Limited access until approved
- Can contribute to platform maintenance

### Admin
- Full platform access
- User management
- Volunteer approval
- Job moderation
- Analytics and reporting

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on all devices
- **Dark/Light Mode**: Theme support
- **Loading States**: Smooth user experience
- **Form Validation**: Real-time validation
- **Error Handling**: User-friendly error messages

## 🚀 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced search filters
- [ ] Resume parsing
- [ ] Interview scheduling
- [ ] Payment integration
- [ ] Mobile app
- [ ] AI-powered job matching
- [ ] Video interviews
- [ ] Skills assessment
- [ ] Company reviews

## 📝 API Documentation

The backend provides RESTful APIs for all functionality:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/jobs` - Get job listings
- `POST /api/jobs` - Create job (employers)
- `GET /api/users/volunteers` - Get volunteers (admin)
- `PATCH /api/users/:id/approve` - Approve volunteer (admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using Next.js, TypeScript, and Node.js** 