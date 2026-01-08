import { asyncHandler, formatResponse, paginate, formatPaginationResponse } from '../utils/helpers.js';
import Achievement from '../models/Achievement.js';
import Student from '../models/Student.js';
import College from '../models/College.js';
import { ACHIEVEMENT_STATUS } from '../utils/constants.js';

/**
 * List achievements
 */
export const getAllAchievements = asyncHandler(async (req, res) => {
  const { page, limit } = paginate(req.query.page, req.query.limit);
  
  const query = {};
  
  if (req.query.studentId) {
    query.studentId = req.query.studentId;
  }
  if (req.query.status) {
    query.verificationStatus = req.query.status;
  }
  if (req.query.type) {
    query.type = req.query.type;
  }
  if (req.query.verified === 'true') {
    query.verificationStatus = 'verified';
  }

  const total = await Achievement.countDocuments(query);
  const achievements = await Achievement.find(query)
    .populate('studentId', 'firstName lastName profilePicture')
    .populate('skills')
    .populate('verifiedBy', 'name logo')
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
 * Get achievement by ID
 */
export const getAchievementById = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findById(req.params.id)
    .populate('studentId', 'firstName lastName profilePicture collegeId')
    .populate('skills')
    .populate('verifiedBy', 'name logo');

  if (!achievement) {
    return res.status(404).json(
      formatResponse(false, null, 'Achievement not found', { code: 'NOT_FOUND' })
    );
  }

  res.status(200).json(
    formatResponse(true, achievement, 'Achievement retrieved successfully')
  );
});

/**
 * Create achievement
 */
export const createAchievement = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  
  if (!student) {
    return res.status(404).json(
      formatResponse(false, null, 'Student profile not found', { code: 'NOT_FOUND' })
    );
  }

  const achievement = await Achievement.create({
    ...req.body,
    studentId: student._id,
    verificationStatus: ACHIEVEMENT_STATUS.PENDING
  });

  // Add achievement to student's achievements array
  student.achievements.push(achievement._id);
  await student.save();

  const populated = await Achievement.findById(achievement._id)
    .populate('skills');

  res.status(201).json(
    formatResponse(true, populated, 'Achievement created successfully')
  );
});

/**
 * Update achievement
 */
export const updateAchievement = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  
  if (!student) {
    return res.status(404).json(
      formatResponse(false, null, 'Student profile not found', { code: 'NOT_FOUND' })
    );
  }

  const achievement = await Achievement.findById(req.params.id);
  
  if (!achievement) {
    return res.status(404).json(
      formatResponse(false, null, 'Achievement not found', { code: 'NOT_FOUND' })
    );
  }

  if (achievement.studentId.toString() !== student._id.toString()) {
    return res.status(403).json(
      formatResponse(false, null, 'You do not have permission to update this achievement', { code: 'FORBIDDEN' })
    );
  }

  // Don't allow updating verification status
  delete req.body.verificationStatus;
  delete req.body.verifiedBy;
  delete req.body.verifiedAt;

  Object.assign(achievement, req.body);
  
  // If updating, reset to pending if it was verified/rejected
  if (achievement.verificationStatus !== ACHIEVEMENT_STATUS.PENDING) {
    achievement.verificationStatus = ACHIEVEMENT_STATUS.PENDING;
    achievement.verifiedBy = undefined;
    achievement.verifiedAt = undefined;
  }

  await achievement.save();

  const updated = await Achievement.findById(achievement._id)
    .populate('skills')
    .populate('verifiedBy', 'name');

  res.status(200).json(
    formatResponse(true, updated, 'Achievement updated successfully')
  );
});

/**
 * Delete achievement
 */
export const deleteAchievement = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  
  if (!student) {
    return res.status(404).json(
      formatResponse(false, null, 'Student profile not found', { code: 'NOT_FOUND' })
    );
  }

  const achievement = await Achievement.findById(req.params.id);
  
  if (!achievement) {
    return res.status(404).json(
      formatResponse(false, null, 'Achievement not found', { code: 'NOT_FOUND' })
    );
  }

  if (achievement.studentId.toString() !== student._id.toString()) {
    return res.status(403).json(
      formatResponse(false, null, 'You do not have permission to delete this achievement', { code: 'FORBIDDEN' })
    );
  }

  // Remove from student's achievements array
  student.achievements = student.achievements.filter(a => a.toString() !== achievement._id.toString());
  await student.save();

  await achievement.deleteOne();

  res.status(200).json(
    formatResponse(true, null, 'Achievement deleted successfully')
  );
});

/**
 * Verify achievement (College)
 */
export const verifyAchievement = asyncHandler(async (req, res) => {
  const { status, comments } = req.body;
  const college = await College.findOne({ userId: req.user._id });
  
  if (!college) {
    return res.status(404).json(
      formatResponse(false, null, 'College profile not found', { code: 'NOT_FOUND' })
    );
  }

  const achievement = await Achievement.findById(req.params.id)
    .populate('studentId');
  
  if (!achievement) {
    return res.status(404).json(
      formatResponse(false, null, 'Achievement not found', { code: 'NOT_FOUND' })
    );
  }

  // Check if student belongs to this college
  if (achievement.studentId.collegeId && achievement.studentId.collegeId.toString() !== college._id.toString()) {
    return res.status(403).json(
      formatResponse(false, null, 'You can only verify achievements from students in your college', { code: 'FORBIDDEN' })
    );
  }

  achievement.verificationStatus = status;
  achievement.verifiedBy = college._id;
  achievement.verifiedAt = new Date();
  if (comments) {
    achievement.description = (achievement.description || '') + `\n\nVerification Note: ${comments}`;
  }
  await achievement.save();

  const updated = await Achievement.findById(achievement._id)
    .populate('studentId', 'firstName lastName')
    .populate('verifiedBy', 'name logo')
    .populate('skills');

  res.status(200).json(
    formatResponse(true, updated, `Achievement ${status} successfully`)
  );
});

/**
 * Get student's achievements
 */
export const getStudentAchievements = asyncHandler(async (req, res) => {
  const { page, limit } = paginate(req.query.page, req.query.limit);
  
  const query = { studentId: req.params.studentId };
  if (req.query.status) {
    query.verificationStatus = req.query.status;
  }

  const total = await Achievement.countDocuments(query);
  const achievements = await Achievement.find(query)
    .populate('skills')
    .populate('verifiedBy', 'name logo')
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
 * Get pending verifications (College)
 */
export const getPendingVerifications = asyncHandler(async (req, res) => {
  const college = await College.findOne({ userId: req.user._id });
  
  if (!college) {
    return res.status(404).json(
      formatResponse(false, null, 'College profile not found', { code: 'NOT_FOUND' })
    );
  }

  const { page, limit } = paginate(req.query.page, req.query.limit);

  // Get achievements from students in this college
  const Student = (await import('../models/Student.js')).default;
  const students = await Student.find({ collegeId: college._id }).select('_id');
  const studentIds = students.map(s => s._id);

  const query = {
    studentId: { $in: studentIds },
    verificationStatus: ACHIEVEMENT_STATUS.PENDING
  };

  const total = await Achievement.countDocuments(query);
  const achievements = await Achievement.find(query)
    .populate('studentId', 'firstName lastName enrollmentNumber')
    .populate('skills')
    .sort({ createdAt: -1 })
    .skip(page.skip)
    .limit(page.limit);

  res.status(200).json(
    formatResponse(
      true,
      formatPaginationResponse(achievements, total, page.page, page.limit),
      'Pending verifications retrieved successfully'
    )
  );
});
