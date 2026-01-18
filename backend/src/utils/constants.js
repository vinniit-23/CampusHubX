export const USER_ROLES = {
  STUDENT: 'student',
  COLLEGE: 'college',
  RECRUITER: 'recruiter',
  ADMIN: 'admin'
};



export const SKILL_CATEGORIES = {
  TECHNICAL: 'technical',
  SOFT: 'soft',
  LANGUAGE: 'language',
  DOMAIN: 'domain'
};

export const ACHIEVEMENT_TYPES = {
  CERTIFICATION: 'certification',
  AWARD: 'award',
  COMPETITION: 'competition',
  PUBLICATION: 'publication',
  OTHER: 'other'
};

export const ACHIEVEMENT_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

export const OPPORTUNITY_TYPES = {
  FULL_TIME: 'full-time',
  INTERNSHIP: 'internship',
  CONTRACT: 'contract',
  FREELANCE: 'freelance'
};

export const LOCATION_TYPES = {
  REMOTE: 'remote',
  ONSITE: 'onsite',
  HYBRID: 'hybrid'
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWING: 'reviewing',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted',
  WITHDRAWN: 'withdrawn' // <--- ADD THIS
};

export const ANALYTICS_ENTITY_TYPES = {
  STUDENT: 'student',
  COLLEGE: 'college',
  RECRUITER: 'recruiter',
  OPPORTUNITY: 'opportunity'
};

export const ANALYTICS_METRIC_TYPES = {
  VIEWS: 'views',
  APPLICATIONS: 'applications',
  MATCHES: 'matches',
  CONVERSIONS: 'conversions'
};

export const MATCHING_WEIGHTS = {
  SKILL_MATCH: 0.40,
  PROJECT_RELEVANCE: 0.25,
  ACHIEVEMENT_MATCH: 0.20,
  EXPERIENCE_LEVEL: 0.10,
  LOCATION_PREFERENCE: 0.05
};

export const DEFAULT_MATCH_SCORE_THRESHOLD = 60;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100
};
