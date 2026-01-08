import express from 'express';
import * as achievementController from '../controllers/achievementController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';
import { checkOwnership } from '../middleware/roleAuth.js';
import { validate } from '../utils/validators.js';
import {
  createAchievementSchema,
  verifyAchievementSchema
} from '../utils/validators.js';
import Achievement from '../models/Achievement.js';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();

// Public routes
router.get('/', achievementController.getAllAchievements);
router.get('/student/:studentId', achievementController.getStudentAchievements);
router.get('/:id', achievementController.getAchievementById);

// Student routes
router.post('/', authenticate, authorize(USER_ROLES.STUDENT), validate(createAchievementSchema), achievementController.createAchievement);
router.put('/:id', authenticate, authorize(USER_ROLES.STUDENT), checkOwnership(Achievement, 'studentId'), achievementController.updateAchievement);
router.delete('/:id', authenticate, authorize(USER_ROLES.STUDENT), checkOwnership(Achievement, 'studentId'), achievementController.deleteAchievement);

// College routes
router.get('/pending', authenticate, authorize(USER_ROLES.COLLEGE), achievementController.getPendingVerifications);
router.post('/:id/verify', authenticate, authorize(USER_ROLES.COLLEGE), validate(verifyAchievementSchema), achievementController.verifyAchievement);

export default router;
