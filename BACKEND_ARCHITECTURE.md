# CampusHubX - Backend Architecture Design

## 1. Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection config
│   │   ├── jwt.js               # JWT configuration
│   │   └── environment.js       # Environment variables validation
│   │
│   ├── models/
│   │   ├── User.js              # Base user model
│   │   ├── Student.js           # Student profile model
│   │   ├── College.js           # College model
│   │   ├── Recruiter.js         # Recruiter model
│   │   ├── Skill.js             # Skill model
│   │   ├── Project.js           # Project model
│   │   ├── Achievement.js       # Achievement/Certification model
│   │   ├── Opportunity.js       # Job/Internship opportunity model
│   │   ├── Application.js       # Application model
│   │   ├── Match.js             # Matching record model
│   │   └── Analytics.js         # Analytics data model
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   ├── roleAuth.js          # Role-based access control
│   │   ├── validation.js        # Request validation middleware
│   │   ├── errorHandler.js      # Error handling middleware
│   │   └── rateLimiter.js       # Rate limiting middleware
│   │
│   ├── controllers/
│   │   ├── authController.js    # Authentication & authorization
│   │   ├── studentController.js # Student operations
│   │   ├── collegeController.js # College operations
│   │   ├── recruiterController.js # Recruiter operations
│   │   ├── skillController.js   # Skill management
│   │   ├── projectController.js # Project management
│   │   ├── achievementController.js # Achievement verification
│   │   ├── opportunityController.js # Opportunity management
│   │   ├── applicationController.js # Application handling
│   │   ├── matchingController.js # Opportunity matching engine
│   │   └── analyticsController.js # Analytics & reporting
│   │
│   ├── routes/
│   │   ├── index.js             # Main router aggregator
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── studentRoutes.js     # Student endpoints
│   │   ├── collegeRoutes.js     # College endpoints
│   │   ├── recruiterRoutes.js   # Recruiter endpoints
│   │   ├── skillRoutes.js       # Skill endpoints
│   │   ├── projectRoutes.js     # Project endpoints
│   │   ├── achievementRoutes.js # Achievement endpoints
│   │   ├── opportunityRoutes.js # Opportunity endpoints
│   │   ├── applicationRoutes.js # Application endpoints
│   │   ├── matchingRoutes.js    # Matching endpoints
│   │   └── analyticsRoutes.js   # Analytics endpoints
│   │
│   ├── services/
│   │   ├── authService.js       # Auth business logic
│   │   ├── matchingService.js   # Matching algorithm
│   │   ├── emailService.js      # Email notifications
│   │   ├── fileUploadService.js # File upload handling
│   │   └── analyticsService.js  # Analytics processing
│   │
│   ├── utils/
│   │   ├── validators.js        # Input validation helpers
│   │   ├── helpers.js           # Utility functions
│   │   └── constants.js         # Constants & enums
│   │
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

---

## 2. Database Models

### 2.1 User Model (Base)
```
User {
  _id: ObjectId
  email: String (unique, required, indexed)
  password: String (hashed, required)
  role: Enum ['student', 'college', 'recruiter'] (required, indexed)
  isEmailVerified: Boolean (default: false)
  isActive: Boolean (default: true)
  createdAt: Date
  updatedAt: Date
  lastLogin: Date
}
```

### 2.2 Student Model
```
Student {
  _id: ObjectId
  userId: ObjectId (ref: User, required, unique, indexed)
  firstName: String (required)
  lastName: String (required)
  collegeId: ObjectId (ref: College, indexed)
  enrollmentNumber: String (indexed)
  yearOfStudy: Number (min: 1, max: 5)
  branch: String
  dateOfBirth: Date
  phone: String
  profilePicture: String (URL)
  bio: String (max: 500)
  skills: [ObjectId] (ref: Skill, indexed)
  projects: [ObjectId] (ref: Project)
  achievements: [ObjectId] (ref: Achievement)
  applications: [ObjectId] (ref: Application)
  preferences: {
    jobTypes: [String] // ['full-time', 'internship', 'contract']
    locations: [String]
    salaryRange: {
      min: Number
      max: Number
    }
  }
  createdAt: Date
  updatedAt: Date
}
```

### 2.3 College Model
```
College {
  _id: ObjectId
  userId: ObjectId (ref: User, required, unique, indexed)
  name: String (required, indexed)
  code: String (unique, required, indexed)
  email: String (required)
  phone: String
  address: {
    street: String
    city: String
    state: String
    pincode: String
    country: String
  }
  website: String
  logo: String (URL)
  verified: Boolean (default: false)
  students: [ObjectId] (ref: Student)
  achievements: [ObjectId] (ref: Achievement) // College-verified achievements
  createdAt: Date
  updatedAt: Date
}
```

### 2.4 Recruiter Model
```
Recruiter {
  _id: ObjectId
  userId: ObjectId (ref: User, required, unique, indexed)
  companyName: String (required, indexed)
  email: String (required)
  phone: String
  website: String
  logo: String (URL)
  description: String
  address: {
    street: String
    city: String
    state: String
    pincode: String
    country: String
  }
  verified: Boolean (default: false)
  opportunities: [ObjectId] (ref: Opportunity)
  applications: [ObjectId] (ref: Application)
  createdAt: Date
  updatedAt: Date
}
```

### 2.5 Skill Model
```
Skill {
  _id: ObjectId
  name: String (required, unique, indexed, lowercase)
  category: Enum ['technical', 'soft', 'language', 'domain'] (required, indexed)
  description: String
  students: [ObjectId] (ref: Student) // Students with this skill
  createdAt: Date
  updatedAt: Date
}
```

### 2.6 Project Model
```
Project {
  _id: ObjectId
  studentId: ObjectId (ref: Student, required, indexed)
  title: String (required)
  description: String (required)
  technologies: [String]
  skills: [ObjectId] (ref: Skill)
  githubUrl: String
  liveUrl: String
  startDate: Date
  endDate: Date
  isActive: Boolean (default: true)
  images: [String] // URLs
  verifiedBy: ObjectId (ref: College, optional) // College verification
  verifiedAt: Date
  createdAt: Date
  updatedAt: Date
}
```

### 2.7 Achievement Model
```
Achievement {
  _id: ObjectId
  studentId: ObjectId (ref: Student, required, indexed)
  title: String (required)
  description: String
  type: Enum ['certification', 'award', 'competition', 'publication', 'other'] (required)
  issuer: String // Organization/College name
  issueDate: Date
  expiryDate: Date (optional)
  verificationStatus: Enum ['pending', 'verified', 'rejected'] (default: 'pending', indexed)
  verifiedBy: ObjectId (ref: College, optional)
  verifiedAt: Date
  certificateUrl: String
  evidenceUrl: String // Supporting documents
  skills: [ObjectId] (ref: Skill) // Skills demonstrated
  createdAt: Date
  updatedAt: Date
}
```

### 2.8 Opportunity Model
```
Opportunity {
  _id: ObjectId
  recruiterId: ObjectId (ref: Recruiter, required, indexed)
  title: String (required, indexed)
  description: String (required)
  type: Enum ['full-time', 'internship', 'contract', 'freelance'] (required, indexed)
  location: {
    type: Enum ['remote', 'onsite', 'hybrid']
    city: String
    state: String
    country: String
  }
  salaryRange: {
    min: Number
    max: Number
    currency: String (default: 'INR')
  }
  requiredSkills: [ObjectId] (ref: Skill, indexed)
  requiredExperience: Number // Years
  requirements: [String]
  responsibilities: [String]
  benefits: [String]
  applicationDeadline: Date (indexed)
  isActive: Boolean (default: true, indexed)
  applications: [ObjectId] (ref: Application)
  matchScoreThreshold: Number (default: 60) // Minimum match score to auto-show
  createdAt: Date
  updatedAt: Date
}
```

### 2.9 Application Model
```
Application {
  _id: ObjectId
  opportunityId: ObjectId (ref: Opportunity, required, indexed)
  studentId: ObjectId (ref: Student, required, indexed)
  status: Enum ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'] (default: 'pending', indexed)
  matchScore: Number // Calculated matching score
  coverLetter: String
  resumeUrl: String
  appliedAt: Date (default: Date.now, indexed)
  reviewedAt: Date
  reviewedBy: ObjectId (ref: Recruiter)
  notes: String // Recruiter notes
  createdAt: Date
  updatedAt: Date
  
  // Compound index on (opportunityId, studentId) for uniqueness
}
```

### 2.10 Match Model (Analytics)
```
Match {
  _id: ObjectId
  studentId: ObjectId (ref: Student, required, indexed)
  opportunityId: ObjectId (ref: Opportunity, required, indexed)
  score: Number (required) // 0-100
  matchedSkills: [ObjectId] (ref: Skill)
  missingSkills: [ObjectId] (ref: Skill)
  calculatedAt: Date (indexed)
  
  // Compound index on (studentId, opportunityId, calculatedAt)
}
```

### 2.11 Analytics Model
```
Analytics {
  _id: ObjectId
  entityType: Enum ['student', 'college', 'recruiter', 'opportunity'] (required, indexed)
  entityId: ObjectId (required, indexed)
  metricType: Enum ['views', 'applications', 'matches', 'conversions'] (required, indexed)
  value: Number
  metadata: Object
  date: Date (indexed)
  
  // Compound index on (entityType, entityId, metricType, date)
}
```

---

## 3. Authentication Flow

### 3.1 Registration Flow
1. **Student Registration:**
   - POST `/api/auth/register/student`
   - Input: email, password, firstName, lastName, collegeId, enrollmentNumber
   - Create User (role: student) + Student profile
   - Send verification email
   - Return: { success, userId, message }

2. **College Registration:**
   - POST `/api/auth/register/college`
   - Input: email, password, name, code, address
   - Create User (role: college) + College profile (verified: false)
   - Admin verification required (manual/automated)
   - Return: { success, userId, message }

3. **Recruiter Registration:**
   - POST `/api/auth/register/recruiter`
   - Input: email, password, companyName, address
   - Create User (role: recruiter) + Recruiter profile (verified: false)
   - Email verification + optional manual verification
   - Return: { success, userId, message }

### 3.2 Login Flow
1. POST `/api/auth/login`
2. Input: email, password
3. Validate credentials
4. Check if email verified (for students)
5. Check if account is active
6. Generate JWT token (payload: userId, role, email)
7. Update lastLogin timestamp
8. Return: { token, user: { id, email, role, profile } }

### 3.3 Email Verification Flow
1. Generate verification token on registration (store in User or separate collection)
2. Send email with verification link
3. GET `/api/auth/verify-email/:token`
4. Verify token, update isEmailVerified
5. Redirect to login or return success

### 3.4 Password Reset Flow
1. POST `/api/auth/forgot-password`
   - Input: email
   - Generate reset token (expires in 1 hour)
   - Send email with reset link
   
2. POST `/api/auth/reset-password/:token`
   - Input: newPassword
   - Validate token
   - Update password
   - Invalidate token

### 3.5 Token Refresh Flow
1. POST `/api/auth/refresh`
   - Input: refreshToken (stored in httpOnly cookie or request body)
   - Validate refresh token
   - Generate new access token
   - Return: { token }

### 3.6 Logout Flow
1. POST `/api/auth/logout`
   - Clear refresh token (if using cookies)
   - Optional: Blacklist token (if using Redis)
   - Return: { success }

---

## 4. API Routes

### 4.1 Authentication Routes (`/api/auth`)
```
POST   /api/auth/register/student      - Register student
POST   /api/auth/register/college      - Register college
POST   /api/auth/register/recruiter    - Register recruiter
POST   /api/auth/login                 - Login
POST   /api/auth/logout                - Logout
GET    /api/auth/verify-email/:token   - Verify email
POST   /api/auth/forgot-password       - Request password reset
POST   /api/auth/reset-password/:token - Reset password
POST   /api/auth/refresh               - Refresh access token
GET    /api/auth/me                    - Get current user profile
```

### 4.2 Student Routes (`/api/students`)
```
GET    /api/students/profile           - Get own profile [Student]
PUT    /api/students/profile           - Update own profile [Student]
GET    /api/students/:id               - Get student public profile [All]
GET    /api/students/:id/skills        - Get student skills [All]
GET    /api/students/:id/projects      - Get student projects [All]
GET    /api/students/:id/achievements  - Get student achievements [All]
GET    /api/students/applications      - Get own applications [Student]
GET    /api/students/matches           - Get matched opportunities [Student]
GET    /api/students/dashboard         - Get dashboard data [Student]
```

### 4.3 Skill Routes (`/api/skills`)
```
GET    /api/skills                     - List all skills [All]
GET    /api/skills/:id                 - Get skill details [All]
POST   /api/skills                     - Create skill [Admin/College]
PUT    /api/skills/:id                 - Update skill [Admin]
DELETE /api/skills/:id                 - Delete skill [Admin]
GET    /api/skills/categories          - Get skills by category [All]
POST   /api/skills/bulk                - Bulk create skills [Admin]
```

### 4.4 Project Routes (`/api/projects`)
```
GET    /api/projects                   - List projects (with filters) [All]
GET    /api/projects/:id               - Get project details [All]
POST   /api/projects                   - Create project [Student]
PUT    /api/projects/:id               - Update own project [Student]
DELETE /api/projects/:id               - Delete own project [Student]
POST   /api/projects/:id/verify        - Verify project [College]
GET    /api/projects/student/:studentId - Get student's projects [All]
```

### 4.5 Achievement Routes (`/api/achievements`)
```
GET    /api/achievements               - List achievements (with filters) [All]
GET    /api/achievements/:id           - Get achievement details [All]
POST   /api/achievements               - Create achievement [Student]
PUT    /api/achievements/:id           - Update own achievement [Student]
DELETE /api/achievements/:id           - Delete own achievement [Student]
POST   /api/achievements/:id/verify    - Verify achievement [College]
GET    /api/achievements/student/:studentId - Get student's achievements [All]
GET    /api/achievements/pending       - Get pending verifications [College]
```

### 4.6 Opportunity Routes (`/api/opportunities`)
```
GET    /api/opportunities              - List opportunities (with filters) [All]
GET    /api/opportunities/:id          - Get opportunity details [All]
POST   /api/opportunities              - Create opportunity [Recruiter]
PUT    /api/opportunities/:id          - Update own opportunity [Recruiter]
DELETE /api/opportunities/:id          - Delete own opportunity [Recruiter]
PATCH  /api/opportunities/:id/status   - Toggle active status [Recruiter]
GET    /api/opportunities/recruiter/:recruiterId - Get recruiter's opportunities [All]
```

### 4.7 Application Routes (`/api/applications`)
```
GET    /api/applications               - List applications (role-based) [All]
GET    /api/applications/:id           - Get application details [All]
POST   /api/applications               - Apply to opportunity [Student]
PUT    /api/applications/:id/status    - Update application status [Recruiter]
GET    /api/applications/opportunity/:opportunityId - Get applications for opportunity [Recruiter]
GET    /api/applications/student/:studentId - Get student's applications [Student/Recruiter]
```

### 4.8 Matching Routes (`/api/matching`)
```
GET    /api/matching/opportunities     - Get matched opportunities for student [Student]
GET    /api/matching/students          - Get matched students for opportunity [Recruiter]
POST   /api/matching/calculate         - Manually trigger matching [Admin]
GET    /api/matching/stats             - Get matching statistics [Admin/Analytics]
```

### 4.9 College Routes (`/api/colleges`)
```
GET    /api/colleges                   - List colleges [All]
GET    /api/colleges/:id               - Get college details [All]
PUT    /api/colleges/profile           - Update own profile [College]
GET    /api/colleges/:id/students      - Get college students [College]
GET    /api/colleges/verifications     - Get pending verifications [College]
POST   /api/colleges/verify-student    - Verify student enrollment [College]
```

### 4.10 Recruiter Routes (`/api/recruiters`)
```
GET    /api/recruiters                 - List recruiters [All]
GET    /api/recruiters/:id             - Get recruiter details [All]
PUT    /api/recruiters/profile         - Update own profile [Recruiter]
GET    /api/recruiters/dashboard       - Get recruiter dashboard [Recruiter]
GET    /api/recruiters/analytics       - Get recruiter analytics [Recruiter]
```

### 4.11 Analytics Routes (`/api/analytics`)
```
GET    /api/analytics/overview         - Get overview analytics [Admin]
GET    /api/analytics/students         - Get student analytics [Admin/College]
GET    /api/analytics/opportunities    - Get opportunity analytics [Admin/Recruiter]
GET    /api/analytics/matches          - Get matching analytics [Admin]
GET    /api/analytics/trends           - Get trend data [Admin]
```

---

## 5. Role-Based Access Control (RBAC)

### 5.1 Roles
- **Student**: Can manage own profile, projects, achievements, skills; apply to opportunities; view matches
- **College**: Can verify students, achievements, projects; view college analytics; manage college profile
- **Recruiter**: Can create/manage opportunities; review applications; view recruiter analytics
- **Admin**: Full system access (optional, for future expansion)

### 5.2 Permission Matrix

| Resource | Student | College | Recruiter | Admin |
|----------|---------|---------|-----------|-------|
| **Own Profile** | R/W | R/W | R/W | R/W |
| **Other Profiles** | R | R | R | R/W |
| **Own Projects** | R/W/D | - | - | R/W/D |
| **Own Achievements** | R/W/D | - | - | R/W/D |
| **Verify Achievements** | - | R/W | - | R/W |
| **Verify Projects** | - | R/W | - | R/W |
| **Create Opportunities** | - | - | R/W/D | R/W/D |
| **View All Opportunities** | R | R | R | R |
| **Apply to Opportunities** | C | - | - | C |
| **Review Applications** | R (own) | - | R/W (own opps) | R/W |
| **Update Application Status** | - | - | W (own opps) | W |
| **View Matches** | R (own) | R (college) | R (own opps) | R |
| **Skills** | R | R/W | R | R/W/D |
| **Analytics** | R (own) | R (college) | R (recruiter) | R (all) |

**Legend:**
- R = Read
- W = Write
- D = Delete
- C = Create
- "-" = No access

### 5.3 Middleware Implementation

**auth.js** - JWT Authentication:
- Verify JWT token from Authorization header
- Extract userId and role from token
- Attach user info to req.user

**roleAuth.js** - Role Authorization:
- Accepts array of allowed roles
- Checks req.user.role against allowed roles
- Returns 403 if unauthorized

**Usage Example:**
```javascript
// Protect route - requires authentication
router.get('/profile', authenticate, studentController.getProfile);

// Role-based protection
router.post('/opportunities', authenticate, authorize(['recruiter', 'admin']), opportunityController.create);

// Resource ownership check
router.put('/projects/:id', authenticate, authorize(['student']), checkOwnership, projectController.update);
```

### 5.4 Resource Ownership Checks
- Students can only edit their own projects, achievements, applications
- Recruiters can only edit their own opportunities and related applications
- Colleges can only verify students/projects/achievements from their institution
- Ownership verified via `studentId`, `recruiterId`, `collegeId` in resource model

---

## 6. API Contracts

### 6.1 Common Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... } // Optional additional details
  }
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 6.2 Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate)
- `422` - Validation Error
- `500` - Internal Server Error

### 6.3 Key API Contracts

#### 6.3.1 Register Student
```
POST /api/auth/register/student
Body: {
  email: string (required, valid email)
  password: string (required, min 8 chars)
  firstName: string (required)
  lastName: string (required)
  collegeId: ObjectId (required)
  enrollmentNumber: string (required)
  yearOfStudy: number (optional, 1-5)
  branch: string (optional)
}
Response: 201 { success: true, data: { userId, studentId }, message: "Registration successful" }
```

#### 6.3.2 Login
```
POST /api/auth/login
Body: {
  email: string (required)
  password: string (required)
}
Response: 200 {
  success: true,
  data: {
    token: string (JWT),
    user: {
      id: ObjectId,
      email: string,
      role: string,
      profile: { ... }
    }
  }
}
```

#### 6.3.3 Get Matched Opportunities
```
GET /api/matching/opportunities?limit=10&minScore=60
Headers: Authorization: Bearer <token>
Response: 200 {
  success: true,
  data: [
    {
      opportunity: { ... },
      matchScore: number (0-100),
      matchedSkills: [ ... ],
      missingSkills: [ ... ]
    }
  ],
  pagination: { ... }
}
```

#### 6.3.4 Create Opportunity
```
POST /api/opportunities
Headers: Authorization: Bearer <token>
Body: {
  title: string (required)
  description: string (required)
  type: 'full-time' | 'internship' | 'contract' | 'freelance' (required)
  location: {
    type: 'remote' | 'onsite' | 'hybrid' (required)
    city?: string
    state?: string
    country?: string
  }
  salaryRange: {
    min: number (required)
    max: number (required)
    currency?: string (default: 'INR')
  }
  requiredSkills: ObjectId[] (required)
  requiredExperience: number (optional)
  requirements: string[] (optional)
  responsibilities: string[] (optional)
  benefits: string[] (optional)
  applicationDeadline: Date (optional)
  matchScoreThreshold: number (optional, default: 60)
}
Response: 201 { success: true, data: { opportunity }, message: "Opportunity created" }
```

#### 6.3.5 Apply to Opportunity
```
POST /api/applications
Headers: Authorization: Bearer <token>
Body: {
  opportunityId: ObjectId (required)
  coverLetter?: string
  resumeUrl?: string
}
Response: 201 { success: true, data: { application }, message: "Application submitted" }
```

#### 6.3.6 Verify Achievement
```
POST /api/achievements/:id/verify
Headers: Authorization: Bearer <token>
Body: {
  status: 'verified' | 'rejected' (required)
  comments?: string
}
Response: 200 { success: true, data: { achievement }, message: "Achievement verified" }
```

---

## 7. Matching Engine Algorithm

### 7.1 Matching Score Calculation
1. **Skill Match (40%)**
   - Count matching skills between student and opportunity
   - Score = (matchedSkills / requiredSkills) * 40

2. **Project Relevance (25%)**
   - Analyze student projects for relevant technologies/domain
   - Score based on project relevance to opportunity

3. **Achievement Match (20%)**
   - Verified achievements matching required skills
   - Bonus for certifications in relevant domain

4. **Experience Level (10%)**
   - Compare student's academic year/projects with required experience
   - Normalized score

5. **Location Preference (5%)**
   - Match student location preferences with opportunity location

**Final Score** = Sum of all components (0-100)

### 7.2 Matching Triggers
- New opportunity created → Match with all active students
- Student profile updated (skills/projects) → Recalculate matches
- Student completes new achievement → Update matches
- Periodic batch job (daily) → Recalculate all matches

---

## 8. Security Considerations

1. **JWT Token Security**
   - Access token: 15 minutes expiry
   - Refresh token: 7 days expiry (stored in httpOnly cookie)
   - Token rotation on refresh

2. **Password Security**
   - Bcrypt hashing (salt rounds: 10)
   - Minimum 8 characters
   - Password complexity requirements

3. **Rate Limiting**
   - Login attempts: 5 per 15 minutes
   - API calls: 100 per 15 minutes per user
   - Registration: 3 per hour per IP

4. **Input Validation**
   - All inputs validated using Joi/Zod
   - Sanitize user inputs
   - Prevent NoSQL injection

5. **CORS Configuration**
   - Allow only frontend domain(s)
   - Credentials: true

6. **File Upload Security**
   - Validate file types and sizes
   - Store in secure cloud storage (S3/Cloudinary)
   - Virus scanning for uploaded files

---

## 9. Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://...

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

# File Upload
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 10. Future Enhancements

1. **Real-time Features**
   - WebSocket for notifications
   - Live chat between students and recruiters

2. **Advanced Analytics**
   - Predictive analytics
   - Skill demand forecasting
   - Career path recommendations

3. **Additional Features**
   - Interview scheduling
   - Video interviews
   - Recommendation system
   - Social features (student networks)

4. **Performance**
   - Redis caching layer
   - Elasticsearch for advanced search
   - CDN for static assets

5. **Scalability**
   - Microservices architecture
   - Message queues (RabbitMQ/Kafka)
   - Horizontal scaling with load balancers
