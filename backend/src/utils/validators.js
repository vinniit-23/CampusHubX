import Joi from 'joi';

// User validation schemas
export const registerStudentSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  collegeId: Joi.string().required(),
  enrollmentNumber: Joi.string().required(),
  yearOfStudy: Joi.number().integer().min(1).max(5).optional(),
  branch: Joi.string().optional()
});

export const registerCollegeSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).max(200).required(),
  code: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    pincode: Joi.string().optional(),
    country: Joi.string().optional()
  }).optional()
});

export const registerRecruiterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  companyName: Joi.string().min(2).max(200).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  website: Joi.string().uri().optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    pincode: Joi.string().optional(),
    country: Joi.string().optional()
  }).optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

export const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().min(8).required()
});

// Student validation schemas
export const updateStudentProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  yearOfStudy: Joi.number().integer().min(1).max(5).optional(),
  branch: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  phone: Joi.string().optional(),
  bio: Joi.string().max(500).optional(),
  preferences: Joi.object({
    jobTypes: Joi.array().items(Joi.string()).optional(),
    locations: Joi.array().items(Joi.string()).optional(),
    salaryRange: Joi.object({
      min: Joi.number().optional(),
      max: Joi.number().optional()
    }).optional()
  }).optional()
});

// Skill validation schemas
export const createSkillSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  category: Joi.string().valid('technical', 'soft', 'language', 'domain').required(),
  description: Joi.string().max(500).optional()
});

export const updateSkillSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  category: Joi.string().valid('technical', 'soft', 'language', 'domain').optional(),
  description: Joi.string().max(500).optional()
});

// Project validation schemas
export const createProjectSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().min(10).required(),
  technologies: Joi.array().items(Joi.string()).optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  githubUrl: Joi.string().uri().optional(),
  liveUrl: Joi.string().uri().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  images: Joi.array().items(Joi.string().uri()).optional()
});

export const updateProjectSchema = Joi.object({
  title: Joi.string().min(2).max(200).optional(),
  description: Joi.string().min(10).optional(),
  technologies: Joi.array().items(Joi.string()).optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  githubUrl: Joi.string().uri().optional(),
  liveUrl: Joi.string().uri().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  isActive: Joi.boolean().optional(),
  images: Joi.array().items(Joi.string().uri()).optional()
});

// Achievement validation schemas
export const createAchievementSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().optional(),
  type: Joi.string().valid('certification', 'award', 'competition', 'publication', 'other').required(),
  issuer: Joi.string().required(),
  issueDate: Joi.date().required(),
  expiryDate: Joi.date().optional(),
  certificateUrl: Joi.string().uri().optional(),
  evidenceUrl: Joi.string().uri().optional(),
  skills: Joi.array().items(Joi.string()).optional()
});

export const verifyAchievementSchema = Joi.object({
  status: Joi.string().valid('verified', 'rejected').required(),
  comments: Joi.string().optional()
});

// Opportunity validation schemas
export const createOpportunitySchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().min(10).required(),
  type: Joi.string().valid('full-time', 'internship', 'contract', 'freelance').required(),
  location: Joi.object({
    type: Joi.string().valid('remote', 'onsite', 'hybrid').required(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional()
  }).required(),
  salaryRange: Joi.object({
    min: Joi.number().required(),
    max: Joi.number().required(),
    currency: Joi.string().default('INR').optional()
  }).required(),
  requiredSkills: Joi.array().items(Joi.string()).required(),
  requiredExperience: Joi.number().min(0).optional(),
  requirements: Joi.array().items(Joi.string()).optional(),
  responsibilities: Joi.array().items(Joi.string()).optional(),
  benefits: Joi.array().items(Joi.string()).optional(),
  applicationDeadline: Joi.date().optional(),
  matchScoreThreshold: Joi.number().min(0).max(100).default(60).optional()
});

export const updateOpportunitySchema = Joi.object({
  title: Joi.string().min(2).max(200).optional(),
  description: Joi.string().min(10).optional(),
  type: Joi.string().valid('full-time', 'internship', 'contract', 'freelance').optional(),
  location: Joi.object({
    type: Joi.string().valid('remote', 'onsite', 'hybrid').optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional()
  }).optional(),
  salaryRange: Joi.object({
    min: Joi.number().optional(),
    max: Joi.number().optional(),
    currency: Joi.string().optional()
  }).optional(),
  requiredSkills: Joi.array().items(Joi.string()).optional(),
  requiredExperience: Joi.number().min(0).optional(),
  requirements: Joi.array().items(Joi.string()).optional(),
  responsibilities: Joi.array().items(Joi.string()).optional(),
  benefits: Joi.array().items(Joi.string()).optional(),
  applicationDeadline: Joi.date().optional(),
  isActive: Joi.boolean().optional(),
  matchScoreThreshold: Joi.number().min(0).max(100).optional()
});

// Application validation schemas
export const createApplicationSchema = Joi.object({
  opportunityId: Joi.string().required(),
  coverLetter: Joi.string().max(2000).optional(),
  resumeUrl: Joi.string().uri().optional()
});

export const updateApplicationStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'reviewing', 'shortlisted', 'rejected', 'accepted').required(),
  notes: Joi.string().optional()
});

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors
        }
      });
    }

    req.body = value;
    next();
  };
};
