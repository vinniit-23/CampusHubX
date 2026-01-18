import Match from "../models/Match.js";
import Student from "../models/Student.js";
import Opportunity from "../models/Opportunity.js";
import Project from "../models/Project.js";
import Achievement from "../models/Achievement.js";
import { MATCHING_WEIGHTS } from "../utils/constants.js";

/**
 * Calculate match score between student and opportunity
 */
export const calculateMatchScore = async (student, opportunity) => {
  let totalScore = 0;

  // 1. Skill Match (40%)
  const skillScore = calculateSkillMatch(
    student.skills,
    opportunity.requiredSkills,
  );
  totalScore += skillScore * MATCHING_WEIGHTS.SKILL_MATCH;

  // 2. Project Relevance (25%)
  const projectScore = await calculateProjectRelevance(
    student._id,
    opportunity,
  );
  totalScore += projectScore * MATCHING_WEIGHTS.PROJECT_RELEVANCE;

  // 3. Achievement Match (20%)
  const achievementScore = await calculateAchievementMatch(
    student._id,
    opportunity.requiredSkills,
  );
  totalScore += achievementScore * MATCHING_WEIGHTS.ACHIEVEMENT_MATCH;

  // 4. Experience Level (10%)
  const experienceScore = calculateExperienceMatch(
    student.yearOfStudy,
    opportunity.requiredExperience,
  );
  totalScore += experienceScore * MATCHING_WEIGHTS.EXPERIENCE_LEVEL;

  // 5. Location Preference (5%)
  const locationScore = calculateLocationMatch(
    student.preferences?.locations,
    opportunity.location,
  );
  totalScore += locationScore * MATCHING_WEIGHTS.LOCATION_PREFERENCE;

  return Math.round(totalScore);
};

/**
 * Calculate skill match percentage
 */
const calculateSkillMatch = (studentSkills, requiredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) return 100;
  if (!studentSkills || studentSkills.length === 0) return 0;

  const studentSkillIds = studentSkills.map((s) => s.toString());
  const requiredSkillIds = requiredSkills.map((s) => s.toString());

  const matchedCount = requiredSkillIds.filter((skillId) =>
    studentSkillIds.includes(skillId),
  ).length;

  return (matchedCount / requiredSkillIds.length) * 100;
};

/**
 * Calculate project relevance score
 */
const calculateProjectRelevance = async (studentId, opportunity) => {
  try {
    const projects = await Project.find({
      studentId,
      isActive: true,
    }).populate("skills");

    if (projects.length === 0) return 0;

    // ✅ FIX: Safely access requiredSkills with fallback
    const requiredSkillIds = (opportunity.requiredSkills || []).map((s) =>
      s.toString(),
    );

    if (requiredSkillIds.length === 0) return 100;

    let totalRelevance = 0;

    for (const project of projects) {
      const projectSkillIds = project.skills.map((s) => s.toString());
      const matchingSkills = requiredSkillIds.filter((skillId) =>
        projectSkillIds.includes(skillId),
      ).length;

      const projectRelevance = (matchingSkills / requiredSkillIds.length) * 100;
      totalRelevance += projectRelevance;
    }

    return Math.min(totalRelevance / projects.length, 100);
  } catch (error) {
    console.error("Error calculating project relevance:", error);
    return 0;
  }
};

/**
 * Calculate achievement match score
 */
const calculateAchievementMatch = async (studentId, requiredSkills) => {
  try {
    const achievements = await Achievement.find({
      studentId,
      verificationStatus: "verified",
    }).populate("skills");

    if (achievements.length === 0) return 0;

    // ✅ FIX: Safely access requiredSkills with fallback
    const requiredSkillIds = (requiredSkills || []).map((s) => s.toString());

    if (requiredSkillIds.length === 0) return 100;

    let totalMatch = 0;

    for (const achievement of achievements) {
      const achievementSkillIds = achievement.skills.map((s) => s.toString());
      const matchingSkills = requiredSkillIds.filter((skillId) =>
        achievementSkillIds.includes(skillId),
      ).length;

      if (matchingSkills > 0) {
        totalMatch += (matchingSkills / requiredSkillIds.length) * 100;
      }
    }

    return Math.min((totalMatch / achievements.length) * 100, 100);
  } catch (error) {
    console.error("Error calculating achievement match:", error);
    return 0;
  }
};

/**
 * Calculate experience level match
 */
const calculateExperienceMatch = (yearOfStudy, requiredExperience) => {
  if (!requiredExperience || requiredExperience === 0) return 100;
  if (!yearOfStudy) return 0;

  const studentExperience = (yearOfStudy - 1) * 0.75;

  if (studentExperience >= requiredExperience) return 100;
  return Math.max((studentExperience / requiredExperience) * 100, 0);
};

/**
 * Calculate location preference match
 */
const calculateLocationMatch = (studentLocations, opportunityLocation) => {
  if (!studentLocations || studentLocations.length === 0) return 50;

  if (opportunityLocation.type === "remote") {
    return 100;
  }

  const opportunityLocationStr =
    `${opportunityLocation.city || ""} ${opportunityLocation.state || ""} ${opportunityLocation.country || ""}`.toLowerCase();

  const hasMatch = studentLocations.some((loc) =>
    opportunityLocationStr.includes(loc.toLowerCase()),
  );

  return hasMatch ? 100 : 0;
};

/**
 * Find matched skills and missing skills
 */
export const findMatchedAndMissingSkills = (studentSkills, requiredSkills) => {
  const studentSkillIds = (studentSkills || []).map((s) => s.toString());
  const requiredSkillIds = (requiredSkills || []).map((s) => s.toString());

  const matchedSkills = (requiredSkills || []).filter((skill) =>
    studentSkillIds.includes(skill.toString()),
  );

  const missingSkills = (requiredSkills || []).filter(
    (skill) => !studentSkillIds.includes(skill.toString()),
  );

  return { matchedSkills, missingSkills };
};

/**
 * Match student with opportunities
 */
export const matchStudentWithOpportunities = async (studentId) => {
  try {
    const student = await Student.findById(studentId).populate("skills");
    if (!student) throw new Error("Student not found");

    const activeOpportunities = await Opportunity.find({
      isActive: true,
    }).populate("requiredSkills");
    const matches = [];

    for (const opportunity of activeOpportunities) {
      const score = await calculateMatchScore(student, opportunity);

      if (score >= opportunity.matchScoreThreshold) {
        const { matchedSkills, missingSkills } = findMatchedAndMissingSkills(
          student.skills,
          opportunity.requiredSkills,
        );

        await Match.findOneAndUpdate(
          { studentId, opportunityId: opportunity._id },
          {
            studentId,
            opportunityId: opportunity._id,
            score,
            matchedSkills: matchedSkills.map((s) => s._id),
            missingSkills: missingSkills.map((s) => s._id),
            calculatedAt: new Date(),
          },
          { upsert: true, new: true },
        );

        matches.push({
          opportunity,
          matchScore: score,
          matchedSkills,
          missingSkills,
        });
      }
    }
    matches.sort((a, b) => b.matchScore - a.matchScore);
    return matches;
  } catch (error) {
    console.error("Error matching student with opportunities:", error);
    throw error;
  }
};

/**
 * Match opportunity with students
 */
export const matchOpportunityWithStudents = async (opportunityId) => {
  try {
    const opportunity =
      await Opportunity.findById(opportunityId).populate("requiredSkills");
    if (!opportunity) throw new Error("Opportunity not found");

    const students = await Student.find().populate("skills");
    const matches = [];

    for (const student of students) {
      const score = await calculateMatchScore(student, opportunity);

      if (score >= opportunity.matchScoreThreshold) {
        const { matchedSkills, missingSkills } = findMatchedAndMissingSkills(
          student.skills,
          opportunity.requiredSkills,
        );

        matches.push({
          student,
          matchScore: score,
          matchedSkills,
          missingSkills,
        });
      }
    }
    matches.sort((a, b) => b.matchScore - a.matchScore);
    return matches;
  } catch (error) {
    console.error("Error matching opportunity with students:", error);
    throw error;
  }
};

/**
 * Recalculate all matches (for batch jobs)
 */
export const recalculateAllMatches = async () => {
  try {
    const students = await Student.find().populate("skills");
    for (const student of students) {
      await matchStudentWithOpportunities(student._id);
    }
    console.log(`Recalculated matches for ${students.length} students`);
    return true;
  } catch (error) {
    console.error("Error recalculating all matches:", error);
    throw error;
  }
};

const matchingService = {
  calculateMatchScore,
  findMatchedAndMissingSkills,
  matchStudentWithOpportunities,
  matchOpportunityWithStudents,
  recalculateAllMatches,
};

export default matchingService;
