import express from 'express';
import * as matchingController from '../controllers/matchingController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();

// Student routes
router.get('/opportunities', authenticate, authorize(USER_ROLES.STUDENT), matchingController.getMatchedOpportunities);

// Recruiter routes
router.get('/students/:opportunityId', authenticate, authorize(USER_ROLES.RECRUITER), matchingController.getMatchedStudents);

// Admin routes
router.post('/calculate', authenticate, authorize(USER_ROLES.ADMIN), matchingController.calculateMatches);
router.get('/stats', authenticate, authorize(USER_ROLES.ADMIN), matchingController.getMatchingStats);

export default router;
