import express from "express";
import * as studentController from "../controllers/studentController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/roleAuth.js";
import { USER_ROLES } from "../utils/constants.js";

const router = express.Router();

// Student-only routes (Protected)
router.get(
  "/profile",
  authenticate,
  authorize(USER_ROLES.STUDENT),
  studentController.getOwnProfile
);
router.put(
  "/profile",
  authenticate,
  authorize(USER_ROLES.STUDENT),
  studentController.updateOwnProfile
);
router.get(
  "/applications",
  authenticate,
  authorize(USER_ROLES.STUDENT),
  studentController.getOwnApplications
);
router.get(
  "/matches",
  authenticate,
  authorize(USER_ROLES.STUDENT),
  studentController.getMatchedOpportunities
);
router.get(
  "/dashboard",
  authenticate,
  authorize(USER_ROLES.STUDENT),
  studentController.getDashboard
);

// 🟢 NEW ROUTE: Specific route for adding skills (This was the missing piece)
router.post(
  "/skills",
  authenticate,
  authorize(USER_ROLES.STUDENT),
  studentController.addSkill
);

// Public routes (No Auth required)
router.get("/:id", studentController.getStudentProfile);
router.get("/:id/skills", studentController.getStudentSkills);
router.get("/:id/projects", studentController.getStudentProjects);
router.get("/:id/achievements", studentController.getStudentAchievements);

export default router;
