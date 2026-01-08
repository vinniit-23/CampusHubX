import { asyncHandler, formatResponse, paginate, formatPaginationResponse } from '../utils/helpers.js';
import Student from '../models/Student.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';
import Application from '../models/Application.js';
import { USER_ROLES } from '../utils/constants.js';

/**
 * Get own profile
 */
export const getOwnProfile = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id })
    .populate('skills')
    .populate('collegeId')
    .populate('projects')
    .populate('achievements');

  if (!student) {
    return res.status(404).json(
      formatResponse(false, null, 'Student profile not found', { code: 'NOT_FOUND' })
    );
  }

  res.status(200).json(
    formatResponse(true, student, 'Profile retrieved successfully')
  );
});

/**
 * Update own profile
 */
export const updateOwnProfile = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });

  if (!student) {
    return res.status(404).json(
      formatResponse(false, null, 'Student profile not found', { code: 'NOT_FOUND' })
    );
  }

  Object.assign(student, req.body);
  await student.save();

  const updated = await Student.findById(student._id)
    .populate('skills')
    .populate('collegeId');

  res.status(200).json(
    formatResponse(true, updated, 'Profile updated successfully')
  );
});

/**
 * Get student public profile
 */
export const getStudentProfile = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate('skills')
    .populate('collegeId')
    .populate({
      path: 'projects',
      match: { isActive: true }
    })
    .populate({
      path: 'achievements',
      match: { verificationStatus: 'verified' }
    });

  if (!student) {
    return res.status(404).json(
      formatResponse(false, null, 'Student not found', { code: 'NOT_FOUND' })
    );
  }

  res.status(200).json(
    formatResponse(true, student, 'Student profile retrieved successfully')
  );
});

/**
 * Get student skills
 */
export const getStudentSkills = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate('skills')
    .select('skills');

  if (!student) {
    return res.status(404).json(
      formatResponse(false, null, 'Student not found', { code: 'NOT_FOUND' })
    );
  }

  res.status(200).json(
    formatResponse(true, student.skills, 'Skills retrieved successfully')
  );
});

/**
 * Get student projects
 */
export const getStudentProjects = asyncHandler(async (req, res) => {
  const { page, limit } = paginate(req.query.page, req.query.limit);
  
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).json(
      formatResponse(false, null, 'Student not found', { code: 'NOT_FOUND' })
    );
  }

  const query = { studentId: req.params.id, isActive: true };
  const total = await Project.countDocuments(query);
  const projects = await Project.find(query)
    .populate('skills')
    .populate('verifiedBy')
    .sort({ createdAt: -1 })
    .skip(page.skip)
    .limit(page.limit);

  res.status(200).json(
    formatResponse(
      true,
      formatPaginationResponse(projects, total, page.page, page.limit),
      'Projects retrieved successfully'
    )
  );
});

/**
 * Get student achievements
 */
export const getStudentAchievements = asyncHandler(async (req, res) => {
  const { page, limit } = paginate(req.query.page, req.query.limit);
  
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).json(
      formatResponse(false, null, 'Student not found', { code: 'NOT_FOUND' })
    );
  }

  const query = { studentId: req.params.id };
  if (req.query.status) {
    query.verificationStatus = req.query.status;
  }

  const total = await Achievement.countDocuments(query);
  const achievements = await Achievement.find(query)
    .populate('skills')
    .populate('verifiedBy')
    .sort({ issueDate: -1 })
    .skip(page.skip)
    .limit(page.limit);

  res.status(200).json(
    formatResponse(
      true,
      formatPaginationResponse(achievements, total, page.page, page.limit),
      'Achievements retrieved successfully'
    )
  );
});

/**
 * Get own applications
 */
export const getOwnApplications = asyncHandler(async (req, res) => {
  const { page, limit } = paginate(req.query.page, req.query.limit);
  
  const student = await Student.findOne({ userId: req.user._id });
  if (!student) {
    return res.status(404).json(
      formatResponse(false, null, 'Student profile not found', { code: 'NOT_FOUND' })
    );
  }

  const query = { studentId: student._id };
  if (req.query.status) {
    query.status = req.query.status;
  }

  const total = await Application.countDocuments(query);
  const applications = await Application.find(query)
    .populate('opportunityId', 'title type location recruiterId')
    .populate({
      path: 'opportunityId',
      populate: { path: 'recruiterId', select: 'companyName logo' }
    })
    .sort({ appliedAt: -1 })
    .skip(page.skip)
    .limit(page.limit);

  res.status(200).json(
    formatResponse(
      true,
      formatPaginationResponse(applications, total, page.page, page.limit),
      'Applications retrieved successfully'
    )
  );
});

/**
 * Get matched opportunities (from matching service)
 */
export const getMatchedOpportunities = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  if (!student) {
    return res.status(404).json(
      formatResponse(false, null, 'Student profile not found', { code: 'NOT_FOUND' })
    );
  }

  const { page, limit } = paginate(req.query.page, req.query.limit);
  const minScore = parseInt(req.query.minScore) || 60;

  // This will be handled by matchingController
  res.status(200).json(
    formatResponse(true, null, 'Use /api/matching/opportunities endpoint')
  );
});

/**
 * Get dashboard data
 */
export const getDashboard = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  if (!student) {
    return res.status(404).json(
      formatResponse(false, null, 'Student profile not found', { code: 'NOT_FOUND' })
    );
  }

  const [projectsCount, achievementsCount, applicationsCount, verifiedAchievementsCount] = await Promise.all([
    Project.countDocuments({ studentId: student._id, isActive: true }),
    Achievement.countDocuments({ studentId: student._id }),
    Application.countDocuments({ studentId: student._id }),
    Achievement.countDocuments({ studentId: student._id, verificationStatus: 'verified' })
  ]);

  const recentApplications = await Application.find({ studentId: student._id })
    .populate('opportunityId', 'title type')
    .sort({ appliedAt: -1 })
    .limit(5);

  res.status(200).json(
    formatResponse(true, {
      stats: {
        projects: projectsCount,
        achievements: achievementsCount,
        verifiedAchievements: verifiedAchievementsCount,
        applications: applicationsCount
      },
      recentApplications
    }, 'Dashboard data retrieved successfully')
  );
});
