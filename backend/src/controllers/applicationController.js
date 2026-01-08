import { asyncHandler, formatResponse, paginate, formatPaginationResponse } from '../utils/helpers.js';
import Application from '../models/Application.js';
import Opportunity from '../models/Opportunity.js';
import Student from '../models/Student.js';
import Recruiter from '../models/Recruiter.js';
import { APPLICATION_STATUS } from '../utils/constants.js';

/**
 * List applications (role-based)
 */
export const getAllApplications = asyncHandler(async (req, res) => {
  const { page, limit } = paginate(req.query.page, req.query.limit);
  
  let query = {};

  // Filter based on user role
  if (req.user.role === 'student') {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json(
        formatResponse(false, null, 'Student profile not found', { code: 'NOT_FOUND' })
      );
    }
    query.studentId = student._id;
  } else if (req.user.role === 'recruiter') {
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter) {
      return res.status(404).json(
        formatResponse(false, null, 'Recruiter profile not found', { code: 'NOT_FOUND' })
      );
    }
    const opportunities = await Opportunity.find({ recruiterId: recruiter._id }).select('_id');
    query.opportunityId = { $in: opportunities.map(o => o._id) };
  }

  if (req.query.status) {
    query.status = req.query.status;
  }
  if (req.query.opportunityId) {
    query.opportunityId = req.query.opportunityId;
  }

  const total = await Application.countDocuments(query);
  const applications = await Application.find(query)
    .populate('studentId', 'firstName lastName profilePicture collegeId')
    .populate({
      path: 'studentId',
      populate: { path: 'collegeId', select: 'name' }
    })
    .populate('opportunityId', 'title type location recruiterId')
    .populate({
      path: 'opportunityId',
      populate: { path: 'recruiterId', select: 'companyName logo' }
    })
    .populate('reviewedBy', 'companyName')
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
 * Get application by ID
 */
export const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('studentId', 'firstName lastName profilePicture skills achievements projects')
    .populate({
      path: 'studentId',
      populate: [
        { path: 'skills' },
        { path: 'collegeId', select: 'name' }
      ]
    })
    .populate('opportunityId')
    .populate({
      path: 'opportunityId',
      populate: { path: 'recruiterId', select: 'companyName logo' }
    })
    .populate('reviewedBy', 'companyName');

  if (!application) {
    return res.status(404).json(
      formatResponse(false, null, 'Application not found', { code: 'NOT_FOUND' })
    );
  }

  // Check permissions
  if (req.user.role === 'student') {
    const student = await Student.findOne({ userId: req.user._id });
    if (application.studentId.toString() !== student._id.toString()) {
      return res.status(403).json(
        formatResponse(false, null, 'You do not have permission to view this application', { code: 'FORBIDDEN' })
      );
    }
  } else if (req.user.role === 'recruiter') {
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    const opportunity = await Opportunity.findById(application.opportunityId);
    if (opportunity.recruiterId.toString() !== recruiter._id.toString()) {
      return res.status(403).json(
        formatResponse(false, null, 'You do not have permission to view this application', { code: 'FORBIDDEN' })
      );
    }
  }

  res.status(200).json(
    formatResponse(true, application, 'Application retrieved successfully')
  );
});

/**
 * Apply to opportunity
 */
export const createApplication = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  
  if (!student) {
    return res.status(404).json(
      formatResponse(false, null, 'Student profile not found', { code: 'NOT_FOUND' })
    );
  }

  const opportunity = await Opportunity.findById(req.body.opportunityId);
  
  if (!opportunity) {
    return res.status(404).json(
      formatResponse(false, null, 'Opportunity not found', { code: 'NOT_FOUND' })
    );
  }

  if (!opportunity.isActive) {
    return res.status(400).json(
      formatResponse(false, null, 'This opportunity is not currently active', { code: 'INVALID_OPPORTUNITY' })
    );
  }

  // Check if already applied
  const existingApplication = await Application.findOne({
    studentId: student._id,
    opportunityId: opportunity._id
  });

  if (existingApplication) {
    return res.status(409).json(
      formatResponse(false, null, 'You have already applied to this opportunity', { code: 'DUPLICATE_APPLICATION' })
    );
  }

  // Calculate match score
  const matchingService = (await import('../services/matchingService.js')).default;
  const matchScore = await matchingService.calculateMatchScore(student._id, opportunity._id);

  const application = await Application.create({
    opportunityId: opportunity._id,
    studentId: student._id,
    coverLetter: req.body.coverLetter,
    resumeUrl: req.body.resumeUrl,
    matchScore,
    status: APPLICATION_STATUS.PENDING
  });

  // Add to student's applications
  student.applications.push(application._id);
  await student.save();

  // Add to opportunity's applications
  opportunity.applications.push(application._id);
  await opportunity.save();

  const populated = await Application.findById(application._id)
    .populate('opportunityId', 'title type')
    .populate('studentId', 'firstName lastName');

  res.status(201).json(
    formatResponse(true, populated, 'Application submitted successfully')
  );
});

/**
 * Update application status (Recruiter)
 */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const recruiter = await Recruiter.findOne({ userId: req.user._id });
  
  if (!recruiter) {
    return res.status(404).json(
      formatResponse(false, null, 'Recruiter profile not found', { code: 'NOT_FOUND' })
    );
  }

  const application = await Application.findById(req.params.id)
    .populate('opportunityId');
  
  if (!application) {
    return res.status(404).json(
      formatResponse(false, null, 'Application not found', { code: 'NOT_FOUND' })
    );
  }

  const opportunity = application.opportunityId;
  if (opportunity.recruiterId.toString() !== recruiter._id.toString()) {
    return res.status(403).json(
      formatResponse(false, null, 'You do not have permission to update this application', { code: 'FORBIDDEN' })
    );
  }

  application.status = req.body.status;
  application.reviewedBy = recruiter._id;
  application.reviewedAt = new Date();
  if (req.body.notes) {
    application.notes = req.body.notes;
  }
  await application.save();

  const updated = await Application.findById(application._id)
    .populate('studentId', 'firstName lastName')
    .populate('opportunityId', 'title')
    .populate('reviewedBy', 'companyName');

  res.status(200).json(
    formatResponse(true, updated, 'Application status updated successfully')
  );
});

/**
 * Get applications for opportunity (Recruiter)
 */
export const getOpportunityApplications = asyncHandler(async (req, res) => {
  const recruiter = await Recruiter.findOne({ userId: req.user._id });
  
  if (!recruiter) {
    return res.status(404).json(
      formatResponse(false, null, 'Recruiter profile not found', { code: 'NOT_FOUND' })
    );
  }

  const opportunity = await Opportunity.findById(req.params.opportunityId);
  
  if (!opportunity) {
    return res.status(404).json(
      formatResponse(false, null, 'Opportunity not found', { code: 'NOT_FOUND' })
    );
  }

  if (opportunity.recruiterId.toString() !== recruiter._id.toString()) {
    return res.status(403).json(
      formatResponse(false, null, 'You do not have permission to view these applications', { code: 'FORBIDDEN' })
    );
  }

  const { page, limit } = paginate(req.query.page, req.query.limit);
  
  const query = { opportunityId: opportunity._id };
  if (req.query.status) {
    query.status = req.query.status;
  }

  const total = await Application.countDocuments(query);
  const applications = await Application.find(query)
    .populate('studentId', 'firstName lastName profilePicture skills')
    .populate({
      path: 'studentId',
      populate: { path: 'collegeId', select: 'name' }
    })
    .sort({ matchScore: -1, appliedAt: -1 })
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
 * Get student's applications
 */
export const getStudentApplications = asyncHandler(async (req, res) => {
  const { page, limit } = paginate(req.query.page, req.query.limit);
  
  const query = { studentId: req.params.studentId };
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
