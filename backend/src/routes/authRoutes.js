import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../utils/validators.js';
import {
  registerStudentSchema,
  registerCollegeSchema,
  registerRecruiterSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../utils/validators.js';
import { loginLimiter, registerLimiter, passwordResetLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/register/student', registerLimiter, validate(registerStudentSchema), authController.registerStudent);
router.post('/register/college', registerLimiter, validate(registerCollegeSchema), authController.registerCollege);
router.post('/register/recruiter', registerLimiter, validate(registerRecruiterSchema), authController.registerRecruiter);
router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', passwordResetLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password/:token', passwordResetLimiter, validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/refresh', authenticate, authController.refreshToken);
router.post('/logout', authenticate, authController.logout);

export default router;
