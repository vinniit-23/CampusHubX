# CampusHubX - Frontend Architecture Design

## 1. Technology Stack

- **Framework**: React 18+ with Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **State Management**: Context API + React Query (TanStack Query)
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: React Icons / Heroicons
- **UI Components**: Custom components with TailwindCSS
- **Date Handling**: date-fns
- **File Upload**: React Dropzone
- **Notifications**: React Hot Toast / Sonner

---

## 2. Folder Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── images/
│       ├── placeholder-avatar.png
│       └── default-college-logo.png
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Button.test.jsx
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── Textarea/
│   │   │   ├── Checkbox/
│   │   │   ├── Radio/
│   │   │   ├── Modal/
│   │   │   ├── Card/
│   │   │   ├── Badge/
│   │   │   ├── Avatar/
│   │   │   ├── Spinner/
│   │   │   ├── Alert/
│   │   │   ├── Toast/
│   │   │   ├── Pagination/
│   │   │   ├── SearchBar/
│   │   │   ├── FilterPanel/
│   │   │   ├── EmptyState/
│   │   │   ├── LoadingSkeleton/
│   │   │   └── ErrorBoundary/
│   │   │
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── NavMenu.jsx
│   │   │   │   └── UserMenu.jsx
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── NavItem.jsx
│   │   │   ├── Footer/
│   │   │   └── Layout.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm/
│   │   │   ├── RegisterForm/
│   │   │   │   ├── StudentRegisterForm.jsx
│   │   │   │   ├── CollegeRegisterForm.jsx
│   │   │   │   └── RecruiterRegisterForm.jsx
│   │   │   ├── ForgotPasswordForm/
│   │   │   ├── ResetPasswordForm/
│   │   │   └── EmailVerification/
│   │   │
│   │   ├── student/
│   │   │   ├── dashboard/
│   │   │   │   ├── StatsCards/
│   │   │   │   ├── RecentMatches/
│   │   │   │   ├── ProfileCompletion/
│   │   │   │   └── QuickActions/
│   │   │   ├── profile/
│   │   │   │   ├── ProfileHeader/
│   │   │   │   ├── PersonalInfo/
│   │   │   │   ├── SkillsSection/
│   │   │   │   ├── PreferencesSection/
│   │   │   │   └── ProfileEditForm/
│   │   │   ├── skills/
│   │   │   │   ├── SkillsList/
│   │   │   │   ├── SkillCard/
│   │   │   │   ├── AddSkillModal/
│   │   │   │   └── SkillCategoryFilter/
│   │   │   ├── projects/
│   │   │   │   ├── ProjectsList/
│   │   │   │   ├── ProjectCard/
│   │   │   │   ├── ProjectForm/
│   │   │   │   └── ProjectDetails/
│   │   │   ├── achievements/
│   │   │   │   ├── AchievementsList/
│   │   │   │   ├── AchievementCard/
│   │   │   │   ├── AchievementForm/
│   │   │   │   └── VerificationBadge/
│   │   │   ├── opportunities/
│   │   │   │   ├── OpportunitiesList/
│   │   │   │   ├── OpportunityCard/
│   │   │   │   ├── OpportunityDetails/
│   │   │   │   ├── MatchScoreIndicator/
│   │   │   │   ├── ApplicationForm/
│   │   │   │   └── FiltersPanel/
│   │   │   └── applications/
│   │   │       ├── ApplicationsList/
│   │   │       ├── ApplicationCard/
│   │   │       └── ApplicationStatus/
│   │   │
│   │   ├── college/
│   │   │   ├── dashboard/
│   │   │   │   ├── CollegeStats/
│   │   │   │   ├── PendingVerifications/
│   │   │   │   └── StudentOverview/
│   │   │   ├── profile/
│   │   │   │   ├── CollegeProfileHeader/
│   │   │   │   └── CollegeInfoForm/
│   │   │   ├── students/
│   │   │   │   ├── StudentsList/
│   │   │   │   ├── StudentCard/
│   │   │   │   └── StudentDetails/
│   │   │   └── verifications/
│   │   │       ├── VerificationsList/
│   │   │       ├── VerificationCard/
│   │   │       ├── VerificationModal/
│   │   │       └── VerificationFilters/
│   │   │
│   │   ├── recruiter/
│   │   │   ├── dashboard/
│   │   │   │   ├── RecruiterStats/
│   │   │   │   ├── RecentApplications/
│   │   │   │   ├── TopMatches/
│   │   │   │   └── OpportunityPerformance/
│   │   │   ├── profile/
│   │   │   │   ├── RecruiterProfileHeader/
│   │   │   │   └── CompanyInfoForm/
│   │   │   ├── opportunities/
│   │   │   │   ├── OpportunitiesList/
│   │   │   │   ├── OpportunityCard/
│   │   │   │   ├── OpportunityForm/
│   │   │   │   ├── OpportunityDetails/
│   │   │   │   └── StatusToggle/
│   │   │   ├── applications/
│   │   │   │   ├── ApplicationsList/
│   │   │   │   ├── ApplicationCard/
│   │   │   │   ├── ApplicationDetails/
│   │   │   │   ├── StatusUpdateModal/
│   │   │   │   └── ApplicationFilters/
│   │   │   └── matches/
│   │   │       ├── MatchedStudentsList/
│   │   │       ├── StudentMatchCard/
│   │   │       └── MatchScoreBreakdown/
│   │   │
│   │   └── shared/
│   │       ├── SkillTag/
│   │       ├── StatusBadge/
│   │       ├── MatchScoreBar/
│   │       ├── DateDisplay/
│   │       ├── LocationDisplay/
│   │       ├── SalaryRange/
│   │       └── FileUpload/
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── VerifyEmail.jsx
│   │   │
│   │   ├── student/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Achievements.jsx
│   │   │   ├── Opportunities.jsx
│   │   │   ├── OpportunityDetails.jsx
│   │   │   ├── Applications.jsx
│   │   │   └── Matches.jsx
│   │   │
│   │   ├── college/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── Verifications.jsx
│   │   │   └── StudentDetails.jsx
│   │   │
│   │   ├── recruiter/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Opportunities.jsx
│   │   │   ├── OpportunityDetails.jsx
│   │   │   ├── Applications.jsx
│   │   │   ├── ApplicationDetails.jsx
│   │   │   └── Matches.jsx
│   │   │
│   │   ├── public/
│   │   │   ├── Home.jsx
│   │   │   ├── StudentProfile.jsx
│   │   │   ├── CollegeProfile.jsx
│   │   │   └── RecruiterProfile.jsx
│   │   │
│   │   └── error/
│   │       ├── NotFound.jsx
│   │       ├── Unauthorized.jsx
│   │       └── ServerError.jsx
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── NotificationContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useRole.js
│   │   ├── useApi.js
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   ├── usePagination.js
│   │   └── useFileUpload.js
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.js          # Axios instance with interceptors
│   │   │   ├── auth.js
│   │   │   ├── students.js
│   │   │   ├── colleges.js
│   │   │   ├── recruiters.js
│   │   │   ├── skills.js
│   │   │   ├── projects.js
│   │   │   ├── achievements.js
│   │   │   ├── opportunities.js
│   │   │   ├── applications.js
│   │   │   ├── matching.js
│   │   │   └── analytics.js
│   │   │
│   │   └── storage/
│   │       ├── tokenStorage.js
│   │       └── cacheStorage.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── dateUtils.js
│   │   └── errorHandler.js
│   │
│   ├── lib/
│   │   ├── react-query/
│   │   │   └── queryClient.js
│   │   └── react-hook-form/
│   │       └── schemas.js
│   │
│   ├── routes/
│   │   ├── index.jsx              # Main router configuration
│   │   ├── PrivateRoute.jsx
│   │   ├── RoleRoute.jsx
│   │   └── PublicRoute.jsx
│   │
│   ├── styles/
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   └── components.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── vite.config.js
│
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

---

## 3. Pages & Routes

### 3.1 Route Structure

```
/                           → Home (Public)
├── /login                  → Login (Public)
├── /register               → Register (Public)
│   ├── /register/student   → Student Registration
│   ├── /register/college   → College Registration
│   └── /register/recruiter → Recruiter Registration
├── /forgot-password        → Forgot Password (Public)
├── /reset-password/:token  → Reset Password (Public)
├── /verify-email/:token    → Email Verification (Public)
│
├── /student                → Student Routes (Protected, Role: student)
│   ├── /dashboard          → Student Dashboard
│   ├── /profile            → Student Profile
│   ├── /skills             → Skills Management
│   ├── /projects           → Projects Management
│   ├── /achievements       → Achievements Management
│   ├── /opportunities      → Browse Opportunities
│   ├── /opportunities/:id  → Opportunity Details
│   ├── /applications       → My Applications
│   └── /matches            → Matched Opportunities
│
├── /college                → College Routes (Protected, Role: college)
│   ├── /dashboard          → College Dashboard
│   ├── /profile            → College Profile
│   ├── /students           → College Students List
│   ├── /students/:id       → Student Details
│   └── /verifications      → Pending Verifications
│
├── /recruiter              → Recruiter Routes (Protected, Role: recruiter)
│   ├── /dashboard          → Recruiter Dashboard
│   ├── /profile            → Recruiter Profile
│   ├── /opportunities      → My Opportunities
│   ├── /opportunities/:id  → Opportunity Details
│   ├── /applications       → Applications Management
│   ├── /applications/:id   → Application Details
│   └── /matches            → Matched Students
│
└── /public                 → Public Routes
    ├── /student/:id        → Public Student Profile
    ├── /college/:id        → Public College Profile
    └── /recruiter/:id      → Public Recruiter Profile
```

### 3.2 Route Protection Strategy

- **Public Routes**: Accessible to all (Home, Login, Register, etc.)
- **Protected Routes**: Require authentication
- **Role-Based Routes**: Require specific role (student, college, recruiter)
- **Redirect Logic**:
  - Unauthenticated users → `/login`
  - Authenticated users accessing auth pages → Role-based dashboard
  - Wrong role access → `/unauthorized`

---

## 4. Components Architecture

### 4.1 Component Hierarchy

```
App
├── AuthContext Provider
├── QueryClient Provider
├── Router
│   ├── Public Routes
│   │   ├── Home
│   │   ├── Login
│   │   └── Register
│   │
│   └── Protected Routes
│       ├── Layout (with Header/Sidebar)
│       │   ├── Student Routes
│       │   │   ├── Dashboard
│       │   │   ├── Profile
│       │   │   └── ...
│       │   │
│       │   ├── College Routes
│       │   │   ├── Dashboard
│       │   │   └── ...
│       │   │
│       │   └── Recruiter Routes
│       │       ├── Dashboard
│       │       └── ...
│       │
│       └── Error Pages
```

### 4.2 Component Categories

#### 4.2.1 Common Components
- **Button**: Primary, Secondary, Outline, Ghost variants
- **Input**: Text, Email, Password, Number with validation states
- **Select**: Single/Multi-select with search
- **Modal**: Reusable modal with backdrop
- **Card**: Container with header, body, footer
- **Badge**: Status indicators, skill tags
- **Avatar**: User profile pictures with fallback
- **Spinner**: Loading indicators
- **Alert**: Success, Error, Warning, Info messages
- **Pagination**: Page navigation
- **SearchBar**: Global search with debounce
- **FilterPanel**: Collapsible filter sidebar
- **EmptyState**: Empty list illustrations
- **LoadingSkeleton**: Content placeholders

#### 4.2.2 Layout Components
- **Header**: Navigation bar with user menu
- **Sidebar**: Role-based navigation menu
- **Footer**: Site footer with links
- **Layout**: Main layout wrapper

#### 4.2.3 Feature-Specific Components
- **Student Components**: Dashboard widgets, profile sections, skill/project/achievement cards
- **College Components**: Verification cards, student lists, college stats
- **Recruiter Components**: Opportunity cards, application cards, match indicators

---

## 5. State Management Approach

### 5.1 State Management Strategy

**Primary**: React Query (TanStack Query) for server state
**Secondary**: Context API for global client state
**Local**: useState/useReducer for component-level state

### 5.2 State Layers

#### 5.2.1 Server State (React Query)
- **Authentication**: User profile, token management
- **Student Data**: Profile, skills, projects, achievements, applications
- **College Data**: Profile, students, verifications
- **Recruiter Data**: Profile, opportunities, applications, matches
- **Shared Data**: Skills list, opportunities list, colleges list
- **Matching Data**: Matched opportunities/students, match scores

**Query Keys Structure**:
```
['auth', 'user']
['students', 'profile']
['students', 'skills']
['students', 'projects']
['students', 'achievements']
['students', 'applications']
['students', 'matches']
['opportunities', { filters }]
['opportunities', id]
['applications', { filters }]
['colleges', 'verifications']
['recruiters', 'dashboard']
```

#### 5.2.2 Global Client State (Context API)
- **AuthContext**: Current user, authentication status, role
- **ThemeContext**: Light/dark mode preference
- **NotificationContext**: Toast notifications queue

#### 5.2.3 Local Component State
- Form inputs (managed by React Hook Form)
- UI state (modals, dropdowns, filters)
- Temporary selections

### 5.3 Data Fetching Patterns

- **useQuery**: GET requests, automatic caching, refetching
- **useMutation**: POST/PUT/DELETE, optimistic updates
- **useInfiniteQuery**: Paginated lists (opportunities, applications)
- **Prefetching**: Preload data on hover/navigation

---

## 6. Authentication Flow

### 6.1 Authentication Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Authentication Flow                    │
└─────────────────────────────────────────────────────────┘

1. Registration
   ┌──────────────┐
   │  Register    │ → POST /api/auth/register/{role}
   │   Form       │ → Create User + Profile
   └──────┬───────┘ → Send Verification Email
          │
          ▼
   ┌──────────────┐
   │ Email Verify │ → GET /api/auth/verify-email/:token
   │   Page       │ → Update isEmailVerified
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │   Login      │
   └──────────────┘

2. Login
   ┌──────────────┐
   │  Login Form  │ → POST /api/auth/login
   └──────┬───────┘ → Validate Credentials
          │          → Generate JWT Token
          ▼
   ┌──────────────┐
   │ Store Token  │ → localStorage/sessionStorage
   │ Update Auth  │ → AuthContext.setUser()
   │   Context    │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │  Fetch User  │ → GET /api/auth/me
   │   Profile    │ → Load role-specific data
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │  Redirect to │ → /student/dashboard
   │ Role Dashboard│ → /college/dashboard
   │              │ → /recruiter/dashboard
   └──────────────┘

3. Token Management
   ┌──────────────┐
   │ API Request  │ → Add Authorization Header
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Token Valid? │ → Yes → Proceed
   └──────┬───────┘ → No → Refresh Token
          │
          ▼
   ┌──────────────┐
   │ Refresh      │ → POST /api/auth/refresh
   │   Token      │ → Update Token
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Still Invalid│ → Logout → /login
   └──────────────┘

4. Logout
   ┌──────────────┐
   │  Logout      │ → POST /api/auth/logout
   └──────┬───────┘ → Clear Token
          │          → Clear AuthContext
          ▼
   ┌──────────────┐
   │  Redirect    │ → /login
   └──────────────┘
```

### 6.2 Auth Implementation Details

#### 6.2.1 Token Storage
- **Access Token**: Stored in memory (React state) + localStorage backup
- **Refresh Token**: Stored in httpOnly cookie (if backend supports) or localStorage
- **Token Expiry**: Checked before each API call

#### 6.2.2 Auth Context Structure
```javascript
AuthContext {
  user: {
    id, email, role, profile
  },
  isAuthenticated: boolean,
  isLoading: boolean,
  login: (email, password) => Promise,
  register: (data, role) => Promise,
  logout: () => void,
  refreshToken: () => Promise,
  updateUser: (data) => void
}
```

#### 6.2.3 Protected Route Wrapper
- **PrivateRoute**: Checks authentication, redirects to login if not authenticated
- **RoleRoute**: Checks role, redirects to unauthorized if wrong role

#### 6.2.4 API Interceptor
- **Request Interceptor**: Adds Authorization header with token
- **Response Interceptor**: 
  - 401 → Attempt token refresh → Retry request
  - 403 → Redirect to unauthorized
  - 401 after refresh → Logout and redirect to login

---

## 7. Role-Based Dashboards

### 7.1 Student Dashboard

**Layout**: Grid-based with cards and widgets

**Sections**:
1. **Header Stats Cards**
   - Total Applications
   - Pending Applications
   - Matched Opportunities
   - Profile Completion %

2. **Quick Actions**
   - Add Skill
   - Add Project
   - Add Achievement
   - Browse Opportunities

3. **Recent Matches**
   - Top 5 matched opportunities
   - Match score indicator
   - Quick apply button

4. **Profile Completion**
   - Progress bar
   - Missing sections checklist
   - Suggestions for improvement

5. **Recent Activity**
   - Latest applications
   - Recent profile updates
   - Achievement verifications

**Data Sources**:
- `GET /api/students/dashboard` → Aggregated stats
- `GET /api/matching/opportunities?limit=5` → Recent matches
- `GET /api/students/applications?limit=5` → Recent applications

### 7.2 College Dashboard

**Layout**: Split view with stats and pending items

**Sections**:
1. **College Stats**
   - Total Students
   - Verified Students
   - Pending Verifications
   - Verified Achievements

2. **Pending Verifications**
   - Achievement verifications queue
   - Project verifications queue
   - Quick action buttons

3. **Student Overview**
   - Recent student registrations
   - Top performing students
   - Students needing verification

4. **Activity Feed**
   - Recent verification actions
   - Student profile updates

**Data Sources**:
- `GET /api/colleges/:id/students` → Student list
- `GET /api/achievements/pending` → Pending verifications
- `GET /api/projects?verified=false` → Unverified projects

### 7.3 Recruiter Dashboard

**Layout**: Analytics-focused with charts and lists

**Sections**:
1. **Recruiter Stats**
   - Active Opportunities
   - Total Applications
   - Pending Reviews
   - Average Match Score

2. **Recent Applications**
   - Latest applications with status
   - Quick status update
   - Filter by opportunity

3. **Top Matches**
   - Highest matched students for active opportunities
   - Match score breakdown
   - Quick view profile

4. **Opportunity Performance**
   - Applications per opportunity
   - Conversion rates
   - Best performing opportunities

**Data Sources**:
- `GET /api/recruiters/dashboard` → Aggregated stats
- `GET /api/applications?recruiterId=:id&limit=10` → Recent applications
- `GET /api/matching/students?opportunityId=:id` → Top matches

---

## 8. API Integration Plan

### 8.1 API Client Setup

**Base Configuration**:
```javascript
// services/api/client.js
- Base URL: process.env.VITE_API_URL
- Timeout: 30 seconds
- Headers: Content-Type: application/json
- Request Interceptor: Add Authorization token
- Response Interceptor: Handle errors, token refresh
```

### 8.2 API Service Structure

Each domain has a dedicated service file:

#### 8.2.1 Auth Service (`services/api/auth.js`)
```javascript
- login(email, password)
- register(data, role)
- logout()
- refreshToken()
- getCurrentUser()
- verifyEmail(token)
- forgotPassword(email)
- resetPassword(token, newPassword)
```

#### 8.2.2 Student Service (`services/api/students.js`)
```javascript
- getProfile()
- updateProfile(data)
- getPublicProfile(id)
- getSkills()
- addSkill(skillId)
- removeSkill(skillId)
- getProjects()
- createProject(data)
- updateProject(id, data)
- deleteProject(id)
- getAchievements()
- createAchievement(data)
- updateAchievement(id, data)
- deleteAchievement(id)
- getApplications(filters)
- getMatches(filters)
- getDashboard()
```

#### 8.2.3 Opportunity Service (`services/api/opportunities.js`)
```javascript
- getOpportunities(filters, pagination)
- getOpportunity(id)
- createOpportunity(data) [Recruiter]
- updateOpportunity(id, data) [Recruiter]
- deleteOpportunity(id) [Recruiter]
- toggleStatus(id, isActive) [Recruiter]
```

#### 8.2.4 Application Service (`services/api/applications.js`)
```javascript
- getApplications(filters, pagination)
- getApplication(id)
- createApplication(data) [Student]
- updateApplicationStatus(id, status) [Recruiter]
- getApplicationsByOpportunity(opportunityId) [Recruiter]
```

#### 8.2.5 Matching Service (`services/api/matching.js`)
```javascript
- getMatchedOpportunities(filters) [Student]
- getMatchedStudents(opportunityId) [Recruiter]
- getMatchDetails(studentId, opportunityId)
```

#### 8.2.6 College Service (`services/api/colleges.js`)
```javascript
- getColleges()
- getCollege(id)
- updateProfile(data) [College]
- getStudents(filters) [College]
- getPendingVerifications() [College]
- verifyAchievement(achievementId, status) [College]
- verifyProject(projectId, status) [College]
```

#### 8.2.7 Recruiter Service (`services/api/recruiters.js`)
```javascript
- getRecruiters()
- getRecruiter(id)
- updateProfile(data) [Recruiter]
- getDashboard() [Recruiter]
- getAnalytics() [Recruiter]
```

#### 8.2.8 Skill Service (`services/api/skills.js`)
```javascript
- getSkills(filters)
- getSkill(id)
- getSkillsByCategory()
```

### 8.3 React Query Integration

**Query Hooks Pattern**:
```javascript
// hooks/useStudentProfile.js
export const useStudentProfile = () => {
  return useQuery({
    queryKey: ['students', 'profile'],
    queryFn: () => studentsApi.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// hooks/useOpportunities.js
export const useOpportunities = (filters) => {
  return useQuery({
    queryKey: ['opportunities', filters],
    queryFn: () => opportunitiesApi.getOpportunities(filters),
    staleTime: 2 * 60 * 1000,
  });
};

// hooks/useCreateProject.js
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => projectsApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['students', 'projects']);
      queryClient.invalidateQueries(['students', 'profile']);
    },
  });
};
```

### 8.4 Error Handling Strategy

**Error Types**:
- **Network Errors**: Show connection error message
- **401 Unauthorized**: Attempt token refresh, logout if fails
- **403 Forbidden**: Show unauthorized message, redirect if needed
- **404 Not Found**: Show not found message
- **422 Validation Error**: Display field-specific errors
- **500 Server Error**: Show generic error, log details

**Error Display**:
- Toast notifications for user actions
- Inline errors for form fields
- Error boundaries for component crashes

### 8.5 Request/Response Transformation

**Request Transformation**:
- Convert form data to API format
- Add pagination params
- Add filter params as query strings

**Response Transformation**:
- Normalize data structure
- Format dates
- Transform nested objects
- Handle pagination metadata

---

## 9. Form Handling Strategy

### 9.1 Form Library: React Hook Form + Zod

**Benefits**:
- Performance (uncontrolled components)
- Built-in validation
- Type safety with Zod
- Easy error handling

### 9.2 Form Patterns

**Registration Forms**:
- Multi-step forms for complex registration
- Role-specific fields
- Real-time validation
- College/Recruiter selection with search

**Profile Forms**:
- Sectioned forms (Personal Info, Skills, Preferences)
- Auto-save draft functionality
- Image upload with preview
- Dynamic skill/project/achievement lists

**Application Forms**:
- Resume upload
- Cover letter editor
- Pre-filled opportunity details
- Match score display

### 9.3 Validation Schemas

**Zod Schemas Location**: `lib/react-hook-form/schemas.js`

**Example Schema**:
```javascript
export const studentRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  collegeId: z.string().min(1),
  enrollmentNumber: z.string().min(1),
  yearOfStudy: z.number().min(1).max(5),
});
```

---

## 10. Styling Strategy

### 10.1 TailwindCSS Configuration

**Custom Theme**:
- Primary colors (brand colors)
- Secondary colors
- Status colors (success, error, warning, info)
- Spacing scale
- Typography scale
- Border radius
- Shadows

### 10.2 Component Styling Approach

- **Utility-First**: Use Tailwind classes directly
- **Component Variants**: Use `clsx` or `class-variance-authority` for variants
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Support via ThemeContext (future enhancement)

### 10.3 Design System

**Color Palette**:
- Primary: Blue shades
- Secondary: Gray shades
- Success: Green
- Error: Red
- Warning: Yellow/Orange
- Info: Blue

**Typography**:
- Headings: Inter/Bold
- Body: Inter/Regular
- Code: Mono font

**Spacing**:
- Consistent spacing scale (4px base)
- Component padding/margin standards

---

## 11. Performance Optimization

### 11.1 Code Splitting
- Route-based code splitting (React.lazy)
- Component-level lazy loading for heavy components
- Dynamic imports for large libraries

### 11.2 Caching Strategy
- React Query caching (staleTime, cacheTime)
- localStorage for user preferences
- Service worker for offline support (future)

### 11.3 Image Optimization
- Lazy loading images
- Responsive images (srcset)
- Placeholder images while loading
- Optimize images before upload

### 11.4 Bundle Optimization
- Tree shaking
- Minification
- Gzip compression
- CDN for static assets

---

## 12. Testing Strategy

### 12.1 Testing Levels
- **Unit Tests**: Components, utilities, hooks
- **Integration Tests**: API services, form submissions
- **E2E Tests**: Critical user flows (login, apply, verify)

### 12.2 Testing Tools
- **Vitest**: Unit testing
- **React Testing Library**: Component testing
- **MSW**: API mocking
- **Playwright/Cypress**: E2E testing (future)

---

## 13. Environment Configuration

### 13.1 Environment Variables

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=CampusHubX
VITE_ENABLE_ANALYTICS=false
```

### 13.2 Configuration Management
- Environment-specific configs
- Runtime config validation
- Feature flags

---

## 14. Deployment Considerations

### 14.1 Build Configuration
- Production build optimization
- Environment variable injection
- Asset optimization
- Source maps (dev only)

### 14.2 Vercel Deployment
- Automatic deployments on push
- Preview deployments for PRs
- Environment variables setup
- Custom domain configuration

### 14.3 Post-Deployment
- Error tracking (Sentry - future)
- Analytics integration (future)
- Performance monitoring

---

## 15. Security Considerations

### 15.1 Frontend Security
- XSS prevention (sanitize user inputs)
- CSRF protection (token-based)
- Secure token storage
- HTTPS only in production
- Content Security Policy headers

### 15.2 Data Protection
- No sensitive data in localStorage
- Encrypt sensitive data if needed
- Clear tokens on logout
- Session timeout handling

---

## 16. Accessibility (a11y)

### 16.1 WCAG Compliance
- Keyboard navigation
- Screen reader support
- ARIA labels
- Focus management
- Color contrast compliance

### 16.2 Implementation
- Semantic HTML
- Proper heading hierarchy
- Alt text for images
- Form labels and error messages
- Skip navigation links

---

## 17. Future Enhancements

### 17.1 Planned Features
- Real-time notifications (WebSocket)
- Advanced search with filters
- Dark mode
- Multi-language support (i18n)
- Progressive Web App (PWA)
- Mobile app (React Native)

### 17.2 Performance Improvements
- Virtual scrolling for long lists
- Infinite scroll pagination
- Image CDN integration
- Service worker for offline support

---

## 18. Development Workflow

### 18.1 Development Setup
1. Install dependencies: `npm install`
2. Configure environment variables
3. Start dev server: `npm run dev`
4. Backend should be running on port 5000

### 18.2 Code Quality
- ESLint for linting
- Prettier for formatting
- Husky for pre-commit hooks
- Commit message conventions

### 18.3 Git Workflow
- Feature branches
- Pull request reviews
- Semantic versioning
- Changelog maintenance

---

This architecture provides a solid foundation for building a scalable, maintainable, and user-friendly frontend for CampusHubX. The modular structure allows for easy expansion and modification as the application grows.
