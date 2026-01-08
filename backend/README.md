# CampusHubX Backend API

Backend API for CampusHubX - CampusConnect+ Ecosystem

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT
- **Validation**: Joi
- **Email**: Nodemailer
- **File Upload**: Cloudinary (optional)

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account or local MongoDB instance
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CampusHubX/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` and set the following:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A random secret for JWT tokens
   - `JWT_REFRESH_SECRET` - A random secret for refresh tokens
   - `EMAIL_USER` - Email account for sending emails
   - `EMAIL_PASS` - Email app-specific password
   - Other optional configurations

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   Or for production:
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000` (or the PORT specified in .env)

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campushubx

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@campushubx.com

# File Upload (Cloudinary - Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Main Endpoints

#### Authentication
- `POST /api/auth/register/student` - Register student
- `POST /api/auth/register/college` - Register college
- `POST /api/auth/register/recruiter` - Register recruiter
- `POST /api/auth/login` - Login
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/me` - Get current user

#### Students
- `GET /api/students/profile` - Get own profile [Student]
- `PUT /api/students/profile` - Update own profile [Student]
- `GET /api/students/:id` - Get student profile [Public]
- `GET /api/students/applications` - Get own applications [Student]
- `GET /api/students/matches` - Get matched opportunities [Student]
- `GET /api/students/dashboard` - Get dashboard [Student]

#### Opportunities
- `GET /api/opportunities` - List opportunities [Public]
- `GET /api/opportunities/:id` - Get opportunity [Public]
- `POST /api/opportunities` - Create opportunity [Recruiter]
- `PUT /api/opportunities/:id` - Update opportunity [Recruiter]
- `DELETE /api/opportunities/:id` - Delete opportunity [Recruiter]

#### Applications
- `POST /api/applications` - Apply to opportunity [Student]
- `GET /api/applications` - List applications [Role-based]
- `PUT /api/applications/:id/status` - Update status [Recruiter]

#### Skills, Projects, Achievements
- CRUD operations available - see routes files for details

#### Matching
- `GET /api/matching/opportunities` - Get matched opportunities [Student]
- `GET /api/matching/students/:opportunityId` - Get matched students [Recruiter]

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── scripts/         # Seed scripts
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── .env.example         # Environment variables template
├── package.json
└── README.md
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests (when implemented)

## Features

- ✅ JWT Authentication
- ✅ Role-based Access Control (Student, College, Recruiter, Admin)
- ✅ Email Verification
- ✅ Password Reset
- ✅ Opportunity Matching Engine
- ✅ Skill Management
- ✅ Project & Achievement Tracking
- ✅ Application Management
- ✅ Analytics & Reporting
- ✅ Rate Limiting
- ✅ Input Validation
- ✅ Error Handling

## Security

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on all routes
- Input sanitization
- CORS configuration
- Helmet.js security headers
- MongoDB injection protection

## License

ISC
