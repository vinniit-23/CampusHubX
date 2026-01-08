import Analytics from '../models/Analytics.js';
import Application from '../models/Application.js';
import Match from '../models/Match.js';
import Opportunity from '../models/Opportunity.js';
import Student from '../models/Student.js';

/**
 * Track analytics event
 */
export const trackEvent = async (entityType, entityId, metricType, metadata = {}) => {
  try {
    await Analytics.create({
      entityType,
      entityId,
      metricType,
      value: 1,
      metadata,
      date: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return false;
  }
};

/**
 * Get analytics overview
 */
export const getOverviewAnalytics = async () => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalOpportunities = await Opportunity.countDocuments({ isActive: true });
    const totalApplications = await Application.countDocuments();
    const totalMatches = await Match.countDocuments();

    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const opportunitiesByType = await Opportunity.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    return {
      totalStudents,
      totalOpportunities,
      totalApplications,
      totalMatches,
      applicationsByStatus,
      opportunitiesByType
    };
  } catch (error) {
    console.error('Error getting overview analytics:', error);
    throw error;
  }
};

/**
 * Get student analytics
 */
export const getStudentAnalytics = async (studentId) => {
  try {
    const totalApplications = await Application.countDocuments({ studentId });
    const totalMatches = await Match.countDocuments({ studentId });
    
    const applicationsByStatus = await Application.aggregate([
      { $match: { studentId: studentId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const averageMatchScore = await Match.aggregate([
      { $match: { studentId: studentId } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$score' }
        }
      }
    ]);

    return {
      totalApplications,
      totalMatches,
      applicationsByStatus,
      averageMatchScore: averageMatchScore[0]?.avgScore || 0
    };
  } catch (error) {
    console.error('Error getting student analytics:', error);
    throw error;
  }
};

/**
 * Get recruiter analytics
 */
export const getRecruiterAnalytics = async (recruiterId) => {
  try {
    const opportunities = await Opportunity.find({ recruiterId });
    const opportunityIds = opportunities.map(opp => opp._id);

    const totalApplications = await Application.countDocuments({
      opportunityId: { $in: opportunityIds }
    });

    const applicationsByStatus = await Application.aggregate([
      { $match: { opportunityId: { $in: opportunityIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const opportunitiesByType = opportunities.reduce((acc, opp) => {
      acc[opp.type] = (acc[opp.type] || 0) + 1;
      return acc;
    }, {});

    return {
      totalOpportunities: opportunities.length,
      totalApplications,
      applicationsByStatus,
      opportunitiesByType
    };
  } catch (error) {
    console.error('Error getting recruiter analytics:', error);
    throw error;
  }
};

/**
 * Get opportunity analytics
 */
export const getOpportunityAnalytics = async (opportunityId) => {
  try {
    const totalApplications = await Application.countDocuments({ opportunityId });
    const totalMatches = await Match.countDocuments({ opportunityId });
    
    const applicationsByStatus = await Application.aggregate([
      { $match: { opportunityId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const averageMatchScore = await Application.aggregate([
      { $match: { opportunityId } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$matchScore' }
        }
      }
    ]);

    return {
      totalApplications,
      totalMatches,
      applicationsByStatus,
      averageMatchScore: averageMatchScore[0]?.avgScore || 0
    };
  } catch (error) {
    console.error('Error getting opportunity analytics:', error);
    throw error;
  }
};

/**
 * Get trend data
 */
export const getTrendData = async (days = 30, metricType = 'applications') => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trends = await Analytics.aggregate([
      {
        $match: {
          metricType,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          count: { $sum: '$value' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    return trends;
  } catch (error) {
    console.error('Error getting trend data:', error);
    throw error;
  }
};
