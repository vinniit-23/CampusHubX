import express from 'express';
import authRoutes from './authRoutes.js';
import studentRoutes from './studentRoutes.js';
import skillRoutes from './skillRoutes.js';
import projectRoutes from './projectRoutes.js';
import achievementRoutes from './achievementRoutes.js';
import opportunityRoutes from './opportunityRoutes.js';
import applicationRoutes from './applicationRoutes.js';
import matchingRoutes from './matchingRoutes.js';
import collegeRoutes from './collegeRoutes.js';
import recruiterRoutes from './recruiterRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = express.Router();

// API routes
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/skills', skillRoutes);
router.use('/projects', projectRoutes);
router.use('/achievements', achievementRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/applications', applicationRoutes);
router.use('/matching', matchingRoutes);
router.use('/colleges', collegeRoutes);
router.use('/recruiters', recruiterRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
