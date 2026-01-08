import express from 'express';
import * as recruiterController from '../controllers/recruiterController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();

// Public routes
router.get('/', recruiterController.getAllRecruiters);
router.get('/:id', recruiterController.getRecruiterById);

// Recruiter routes
router.put('/profile', authenticate, authorize(USER_ROLES.RECRUITER), recruiterController.updateOwnProfile);
router.get('/dashboard', authenticate, authorize(USER_ROLES.RECRUITER), recruiterController.getDashboard);
router.get('/analytics', authenticate, authorize(USER_ROLES.RECRUITER), recruiterController.getAnalytics);

export default router;
