import express from 'express';
import * as skillController from '../controllers/skillController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';
import { validate } from '../utils/validators.js';
import {
  createSkillSchema,
  updateSkillSchema
} from '../utils/validators.js';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();

// Public routes
router.get('/', skillController.getAllSkills);
router.get('/categories/:category', skillController.getSkillsByCategory);

// Parameterized routes
router.get('/:id', skillController.getSkillById);

// Protected routes
router.post('/', authenticate, authorize(USER_ROLES.COLLEGE, USER_ROLES.ADMIN), validate(createSkillSchema), skillController.createSkill);
router.put('/:id', authenticate, authorize(USER_ROLES.ADMIN), validate(updateSkillSchema), skillController.updateSkill);
router.delete('/:id', authenticate, authorize(USER_ROLES.ADMIN), skillController.deleteSkill);
router.post('/bulk', authenticate, authorize(USER_ROLES.ADMIN), skillController.bulkCreateSkills);

export default router;
