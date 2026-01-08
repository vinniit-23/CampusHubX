import express from 'express';
import * as applicationController from '../controllers/applicationController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';
import { validate } from '../utils/validators.js';
import {
  createApplicationSchema,
  updateApplicationStatusSchema
} from '../utils/validators.js';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();

// Protected routes - role-based
router.get('/', authenticate, applicationController.getAllApplications);
router.get('/opportunity/:opportunityId', authenticate, authorize(USER_ROLES.RECRUITER), applicationController.getOpportunityApplications);
router.get('/student/:studentId', authenticate, applicationController.getStudentApplications);
router.get('/:id', authenticate, applicationController.getApplicationById);

// Student routes
router.post('/', authenticate, authorize(USER_ROLES.STUDENT), validate(createApplicationSchema), applicationController.createApplication);

// Recruiter routes
router.put('/:id/status', authenticate, authorize(USER_ROLES.RECRUITER), validate(updateApplicationStatusSchema), applicationController.updateApplicationStatus);

export default router;
