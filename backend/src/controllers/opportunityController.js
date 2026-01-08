import { asyncHandler, formatResponse, paginate, formatPaginationResponse } from '../utils/helpers.js';
import Opportunity from '../models/Opportunity.js';
import Recruiter from '../models/Recruiter.js';

/**
 * List opportunities
 */
export const getAllOpportunities = asyncHandler(async (req, res) => {
  const { page, limit } = paginate(req.query.page, req.query.limit);
  
  const query = { isActive: true };
  
  if (req.query.type) {
    query.type = req.query.type;
  }
  if (req.query.locationType) {
    query['location.type'] = req.query.locationType;
  }
  if (req.query.recruiterId) {
    query.recruiterId = req.query.recruiterId;
  }
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }
  if (req.query.skills) {
    const skillIds = Array.isArray(req.query.skills) ? req.query.skills : [req.query.skills];
    query.requiredSkills = { $in: skillIds };
  }

  const total = await Opportunity.countDocuments(query);
  const opportunities = await Opportunity.find(query)
    .populate('recruiterId', 'companyName logo verified')
    .populate('requiredSkills')
    .sort(req.query.search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
    .skip(page.skip)
    .limit(page.limit);

  res.status(200).json(
    formatResponse(
      true,
      formatPaginationResponse(opportunities, total, page.page, page.limit),
      'Opportunities retrieved successfully'
    )
  );
});

/**
 * Get opportunity by ID
 */
export const getOpportunityById = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id)
    .populate('recruiterId', 'companyName logo description website verified')
    .populate('requiredSkills');

  if (!opportunity) {
    return res.status(404).json(
      formatResponse(false, null, 'Opportunity not found', { code: 'NOT_FOUND' })
    );
  }

  res.status(200).json(
    formatResponse(true, opportunity, 'Opportunity retrieved successfully')
  );
});

/**
 * Create opportunity
 */
export const createOpportunity = asyncHandler(async (req, res) => {
  const recruiter = await Recruiter.findOne({ userId: req.user._id });
  
  if (!recruiter) {
    return res.status(404).json(
      formatResponse(false, null, 'Recruiter profile not found', { code: 'NOT_FOUND' })
    );
  }

  const opportunity = await Opportunity.create({
    ...req.body,
    recruiterId: recruiter._id
  });

  // Add opportunity to recruiter's opportunities array
  recruiter.opportunities.push(opportunity._id);
  await recruiter.save();

  const populated = await Opportunity.findById(opportunity._id)
    .populate('requiredSkills')
    .populate('recruiterId', 'companyName logo');

  res.status(201).json(
    formatResponse(true, populated, 'Opportunity created successfully')
  );
});

/**
 * Update opportunity
 */
export const updateOpportunity = asyncHandler(async (req, res) => {
  const recruiter = await Recruiter.findOne({ userId: req.user._id });
  
  if (!recruiter) {
    return res.status(404).json(
      formatResponse(false, null, 'Recruiter profile not found', { code: 'NOT_FOUND' })
    );
  }

  const opportunity = await Opportunity.findById(req.params.id);
  
  if (!opportunity) {
    return res.status(404).json(
      formatResponse(false, null, 'Opportunity not found', { code: 'NOT_FOUND' })
    );
  }

  if (opportunity.recruiterId.toString() !== recruiter._id.toString()) {
    return res.status(403).json(
      formatResponse(false, null, 'You do not have permission to update this opportunity', { code: 'FORBIDDEN' })
    );
  }

  Object.assign(opportunity, req.body);
  await opportunity.save();

  const updated = await Opportunity.findById(opportunity._id)
    .populate('requiredSkills')
    .populate('recruiterId', 'companyName logo');

  res.status(200).json(
    formatResponse(true, updated, 'Opportunity updated successfully')
  );
});

/**
 * Delete opportunity
 */
export const deleteOpportunity = asyncHandler(async (req, res) => {
  const recruiter = await Recruiter.findOne({ userId: req.user._id });
  
  if (!recruiter) {
    return res.status(404).json(
      formatResponse(false, null, 'Recruiter profile not found', { code: 'NOT_FOUND' })
    );
  }

  const opportunity = await Opportunity.findById(req.params.id);
  
  if (!opportunity) {
    return res.status(404).json(
      formatResponse(false, null, 'Opportunity not found', { code: 'NOT_FOUND' })
    );
  }

  if (opportunity.recruiterId.toString() !== recruiter._id.toString()) {
    return res.status(403).json(
      formatResponse(false, null, 'You do not have permission to delete this opportunity', { code: 'FORBIDDEN' })
    );
  }

  // Remove from recruiter's opportunities array
  recruiter.opportunities = recruiter.opportunities.filter(o => o.toString() !== opportunity._id.toString());
  await recruiter.save();

  await opportunity.deleteOne();

  res.status(200).json(
    formatResponse(true, null, 'Opportunity deleted successfully')
  );
});

/**
 * Toggle opportunity status
 */
export const toggleOpportunityStatus = asyncHandler(async (req, res) => {
  const recruiter = await Recruiter.findOne({ userId: req.user._id });
  
  if (!recruiter) {
    return res.status(404).json(
      formatResponse(false, null, 'Recruiter profile not found', { code: 'NOT_FOUND' })
    );
  }

  const opportunity = await Opportunity.findById(req.params.id);
  
  if (!opportunity) {
    return res.status(404).json(
      formatResponse(false, null, 'Opportunity not found', { code: 'NOT_FOUND' })
    );
  }

  if (opportunity.recruiterId.toString() !== recruiter._id.toString()) {
    return res.status(403).json(
      formatResponse(false, null, 'You do not have permission to update this opportunity', { code: 'FORBIDDEN' })
    );
  }

  opportunity.isActive = !opportunity.isActive;
  await opportunity.save();

  res.status(200).json(
    formatResponse(true, opportunity, `Opportunity ${opportunity.isActive ? 'activated' : 'deactivated'} successfully`)
  );
});

/**
 * Get recruiter's opportunities
 */
export const getRecruiterOpportunities = asyncHandler(async (req, res) => {
  const { page, limit } = paginate(req.query.page, req.query.limit);
  
  const query = { recruiterId: req.params.recruiterId };
  if (req.query.active !== undefined) {
    query.isActive = req.query.active === 'true';
  }

  const total = await Opportunity.countDocuments(query);
  const opportunities = await Opportunity.find(query)
    .populate('requiredSkills')
    .sort({ createdAt: -1 })
    .skip(page.skip)
    .limit(page.limit);

  res.status(200).json(
    formatResponse(
      true,
      formatPaginationResponse(opportunities, total, page.page, page.limit),
      'Opportunities retrieved successfully'
    )
  );
});
