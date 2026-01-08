import express from 'express';
import * as opportunityController from '../controllers/opportunityController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';
import { checkOwnership } from '../middleware/roleAuth.js';
import { validate } from '../utils/validators.js';
import {
  createOpportunitySchema,
  updateOpportunitySchema
} from '../utils/validators.js';
import Opportunity from '../models/Opportunity.js';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();

// Public routes
router.get('/', opportunityController.getAllOpportunities);
router.get('/recruiter/:recruiterId', opportunityController.getRecruiterOpportunities);
router.get('/:id', opportunityController.getOpportunityById);

// Recruiter routes
router.post('/', authenticate, authorize(USER_ROLES.RECRUITER), validate(createOpportunitySchema), opportunityController.createOpportunity);
router.put('/:id', authenticate, authorize(USER_ROLES.RECRUITER), checkOwnership(Opportunity, 'recruiterId'), validate(updateOpportunitySchema), opportunityController.updateOpportunity);
router.delete('/:id', authenticate, authorize(USER_ROLES.RECRUITER), checkOwnership(Opportunity, 'recruiterId'), opportunityController.deleteOpportunity);
router.patch('/:id/status', authenticate, authorize(USER_ROLES.RECRUITER), checkOwnership(Opportunity, 'recruiterId'), opportunityController.toggleOpportunityStatus);

export default router;
