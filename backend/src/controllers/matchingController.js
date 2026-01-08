import { asyncHandler, formatResponse, paginate, formatPaginationResponse } from '../utils/helpers.js';
import Student from '../models/Student.js';
import Opportunity from '../models/Opportunity.js';
import Match from '../models/Match.js';
import matchingService from '../services/matchingService.js';
import { DEFAULT_MATCH_SCORE_THRESHOLD } from '../utils/constants.js';

/**
 * Get matched opportunities for student
 */
export const getMatchedOpportunities = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  
  if (!student) {
    return res.status(404).json(
      formatResponse(false, null, 'Student profile not found', { code: 'NOT_FOUND' })
    );
  }

  const { page, limit } = paginate(req.query.page, req.query.limit);
  const minScore = parseInt(req.query.minScore) || DEFAULT_MATCH_SCORE_THRESHOLD;

  // Get all active opportunities
  const opportunities = await Opportunity.find({ isActive: true })
    .populate('recruiterId', 'companyName logo verified')
    .populate('requiredSkills');

  // Calculate matches
  const matches = [];
  const studentPopulated = await Student.findById(student._id).populate('skills');
  
  for (const opportunity of opportunities) {
    const opportunityPopulated = await Opportunity.findById(opportunity._id).populate('requiredSkills');
    const matchScore = await matchingService.calculateMatchScore(studentPopulated, opportunityPopulated);
    
    if (matchScore >= minScore || matchScore >= (opportunity.matchScoreThreshold || DEFAULT_MATCH_SCORE_THRESHOLD)) {
      const { matchedSkills, missingSkills } = matchingService.findMatchedAndMissingSkills(
        studentPopulated.skills,
        opportunityPopulated.requiredSkills
      );
      
      matches.push({
        opportunity: opportunityPopulated,
        matchScore,
        matchedSkills,
        missingSkills
      });
    }
  }

  // Sort by match score
  matches.sort((a, b) => b.matchScore - a.matchScore);

  // Paginate
  const startIndex = (page.page - 1) * page.limit;
  const endIndex = startIndex + page.limit;
  const paginatedMatches = matches.slice(startIndex, endIndex);

  const total = matches.length;

  res.status(200).json(
    formatResponse(
      true,
      formatPaginationResponse(paginatedMatches, total, page.page, page.limit),
      'Matched opportunities retrieved successfully'
    )
  );
});

/**
 * Get matched students for opportunity (Recruiter)
 */
export const getMatchedStudents = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.opportunityId)
    .populate('recruiterId');

  if (!opportunity) {
    return res.status(404).json(
      formatResponse(false, null, 'Opportunity not found', { code: 'NOT_FOUND' })
    );
  }

  // Verify recruiter ownership
  if (opportunity.recruiterId.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json(
      formatResponse(false, null, 'You do not have permission to view matches for this opportunity', { code: 'FORBIDDEN' })
    );
  }

  const { page, limit } = paginate(req.query.page, req.query.limit);
  const minScore = parseInt(req.query.minScore) || DEFAULT_MATCH_SCORE_THRESHOLD;

  // Get all active students
  const students = await Student.find()
    .populate('skills')
    .populate('collegeId', 'name');

  // Calculate matches
  const opportunityPopulated = await Opportunity.findById(opportunity._id).populate('requiredSkills');
  const matches = [];
  
  for (const student of students) {
    const studentPopulated = await Student.findById(student._id).populate('skills');
    const matchScore = await matchingService.calculateMatchScore(studentPopulated, opportunityPopulated);
    
    if (matchScore >= minScore || matchScore >= opportunity.matchScoreThreshold) {
      const { matchedSkills, missingSkills } = matchingService.findMatchedAndMissingSkills(
        studentPopulated.skills,
        opportunityPopulated.requiredSkills
      );
      
      matches.push({
        student: studentPopulated,
        matchScore,
        matchedSkills,
        missingSkills
      });
    }
  }

  // Sort by match score
  matches.sort((a, b) => b.matchScore - a.matchScore);

  // Paginate
  const startIndex = (page.page - 1) * page.limit;
  const endIndex = startIndex + page.limit;
  const paginatedMatches = matches.slice(startIndex, endIndex);

  const total = matches.length;

  res.status(200).json(
    formatResponse(
      true,
      formatPaginationResponse(paginatedMatches, total, page.page, page.limit),
      'Matched students retrieved successfully'
    )
  );
});

/**
 * Manually trigger matching calculation (Admin)
 */
export const calculateMatches = asyncHandler(async (req, res) => {
  const opportunities = await Opportunity.find({ isActive: true });
  const students = await Student.find();

  let totalMatches = 0;

  for (const opportunity of opportunities) {
    const opportunityPopulated = await Opportunity.findById(opportunity._id).populate('requiredSkills');
    for (const student of students) {
      const studentPopulated = await Student.findById(student._id).populate('skills');
      const matchScore = await matchingService.calculateMatchScore(studentPopulated, opportunityPopulated);
      
      const { matchedSkills, missingSkills } = matchingService.findMatchedAndMissingSkills(
        studentPopulated.skills,
        opportunityPopulated.requiredSkills
      );
      
      // Save match record
      await Match.findOneAndUpdate(
        { studentId: student._id, opportunityId: opportunity._id },
        {
          studentId: student._id,
          opportunityId: opportunity._id,
          score: matchScore,
          matchedSkills: matchedSkills.map(s => s._id),
          missingSkills: missingSkills.map(s => s._id),
          calculatedAt: new Date()
        },
        { upsert: true, new: true }
      );

      totalMatches++;
    }
  }

  res.status(200).json(
    formatResponse(true, { totalMatches, opportunities: opportunities.length, students: students.length }, 'Matching calculation completed')
  );
});

/**
 * Get matching statistics
 */
export const getMatchingStats = asyncHandler(async (req, res) => {
  const totalMatches = await Match.countDocuments();
  const avgMatchScore = await Match.aggregate([
    {
      $group: {
        _id: null,
        avgScore: { $avg: '$score' }
      }
    }
  ]);

  const highMatches = await Match.countDocuments({ score: { $gte: 80 } });
  const mediumMatches = await Match.countDocuments({ score: { $gte: 60, $lt: 80 } });
  const lowMatches = await Match.countDocuments({ score: { $lt: 60 } });

  res.status(200).json(
    formatResponse(true, {
      totalMatches,
      averageScore: avgMatchScore[0]?.avgScore || 0,
      highMatches,
      mediumMatches,
      lowMatches
    }, 'Matching statistics retrieved successfully')
  );
});
