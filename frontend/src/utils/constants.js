export const ROLES = {
  STUDENT: 'student',
  COLLEGE: 'college',
  RECRUITER: 'recruiter',
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWING: 'reviewing',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted',
};

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

export const OPPORTUNITY_TYPES = {
  FULL_TIME: 'full-time',
  INTERNSHIP: 'internship',
  CONTRACT: 'contract',
  FREELANCE: 'freelance',
};

export const LOCATION_TYPES = {
  REMOTE: 'remote',
  ONSITE: 'onsite',
  HYBRID: 'hybrid',
};

export const SKILL_CATEGORIES = {
  TECHNICAL: 'technical',
  SOFT: 'soft',
  LANGUAGE: 'language',
  DOMAIN: 'domain',
};

export const ACHIEVEMENT_TYPES = {
  CERTIFICATION: 'certification',
  AWARD: 'award',
  COMPETITION: 'competition',
  PUBLICATION: 'publication',
  OTHER: 'other',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_PROFILE: '/student/profile',
  STUDENT_SKILLS: '/student/skills',
  STUDENT_PROJECTS: '/student/projects',
  STUDENT_ACHIEVEMENTS: '/student/achievements',
  STUDENT_OPPORTUNITIES: '/student/opportunities',
  STUDENT_APPLICATIONS: '/student/applications',
  STUDENT_MATCHES: '/student/matches',
  COLLEGE_DASHBOARD: '/college/dashboard',
  COLLEGE_PROFILE: '/college/profile',
  COLLEGE_STUDENTS: '/college/students',
  COLLEGE_VERIFICATIONS: '/college/verifications',
  RECRUITER_DASHBOARD: '/recruiter/dashboard',
  RECRUITER_PROFILE: '/recruiter/profile',
  RECRUITER_OPPORTUNITIES: '/recruiter/opportunities',
  RECRUITER_APPLICATIONS: '/recruiter/applications',
  RECRUITER_MATCHES: '/recruiter/matches',
};
