import { PAGINATION_DEFAULTS } from './constants.js';

export const paginate = (page, limit) => {
  const pageNum = parseInt(page) || PAGINATION_DEFAULTS.PAGE;
  const limitNum = parseInt(limit) || PAGINATION_DEFAULTS.LIMIT;
  const maxLimit = PAGINATION_DEFAULTS.MAX_LIMIT;
  
  const validLimit = Math.min(limitNum, maxLimit);
  const skip = (pageNum - 1) * validLimit;

  return {
    page: pageNum,
    limit: validLimit,
    skip
  };
};

export const formatPaginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

export const formatResponse = (success, data, message, error = null) => {
  if (success) {
    return {
      success: true,
      data,
      message: message || 'Operation successful'
    };
  } else {
    return {
      success: false,
      error: {
        code: error?.code || 'ERROR',
        message: error?.message || message || 'An error occurred',
        details: error?.details || null
      }
    };
  }
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

export const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        const nested = sanitizeObject(value);
        if (Object.keys(nested).length > 0) {
          sanitized[key] = nested;
        }
      } else {
        sanitized[key] = value;
      }
    }
  }
  return sanitized;
};

export const calculateMatchScore = (studentSkills, requiredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) return 0;
  
  const matchedCount = studentSkills.filter(skill => 
    requiredSkills.includes(skill.toString())
  ).length;
  
  return (matchedCount / requiredSkills.length) * 100;
};

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
