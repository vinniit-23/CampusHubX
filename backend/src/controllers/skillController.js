import { asyncHandler, formatResponse, paginate, formatPaginationResponse } from '../utils/helpers.js';
import Skill from '../models/Skill.js';

/**
 * List all skills
 */
export const getAllSkills = asyncHandler(async (req, res) => {
  const { page, limit } = paginate(req.query.page, req.query.limit);
  
  const query = {};
  if (req.query.category) {
    query.category = req.query.category;
  }
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  const total = await Skill.countDocuments(query);
  const skills = await Skill.find(query)
    .sort(req.query.search ? { score: { $meta: 'textScore' } } : { name: 1 })
    .skip(page.skip)
    .limit(page.limit);

  res.status(200).json(
    formatResponse(
      true,
      formatPaginationResponse(skills, total, page.page, page.limit),
      'Skills retrieved successfully'
    )
  );
});

/**
 * Get skill by ID
 */
export const getSkillById = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    return res.status(404).json(
      formatResponse(false, null, 'Skill not found', { code: 'NOT_FOUND' })
    );
  }

  res.status(200).json(
    formatResponse(true, skill, 'Skill retrieved successfully')
  );
});

/**
 * Create skill
 */
export const createSkill = asyncHandler(async (req, res) => {
  const skillData = {
    ...req.body,
    name: req.body.name.toLowerCase()
  };

  const skill = await Skill.create(skillData);

  res.status(201).json(
    formatResponse(true, skill, 'Skill created successfully')
  );
});

/**
 * Update skill
 */
export const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    return res.status(404).json(
      formatResponse(false, null, 'Skill not found', { code: 'NOT_FOUND' })
    );
  }

  if (req.body.name) {
    req.body.name = req.body.name.toLowerCase();
  }

  Object.assign(skill, req.body);
  await skill.save();

  res.status(200).json(
    formatResponse(true, skill, 'Skill updated successfully')
  );
});

/**
 * Delete skill
 */
export const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    return res.status(404).json(
      formatResponse(false, null, 'Skill not found', { code: 'NOT_FOUND' })
    );
  }

  await skill.deleteOne();

  res.status(200).json(
    formatResponse(true, null, 'Skill deleted successfully')
  );
});

/**
 * Get skills by category
 */
export const getSkillsByCategory = asyncHandler(async (req, res) => {
  const skills = await Skill.find({ category: req.params.category })
    .sort({ name: 1 });

  res.status(200).json(
    formatResponse(true, skills, 'Skills retrieved successfully')
  );
});

/**
 * Bulk create skills
 */
export const bulkCreateSkills = asyncHandler(async (req, res) => {
  const { skills } = req.body;

  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json(
      formatResponse(false, null, 'Skills array is required', { code: 'VALIDATION_ERROR' })
    );
  }

  const skillsData = skills.map(skill => ({
    ...skill,
    name: skill.name.toLowerCase()
  }));

  const created = await Skill.insertMany(skillsData, { ordered: false });

  res.status(201).json(
    formatResponse(true, created, 'Skills created successfully')
  );
});
