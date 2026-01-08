export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this resource'
        }
      });
    }

    next();
  };
};

// Check resource ownership middleware
export const checkOwnership = (model, userIdField = 'userId') => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Resource not found'
          }
        });
      }

      // Check if the resource belongs to the user
      const resourceUserId = resource[userIdField];
      if (resourceUserId && resourceUserId.toString() !== req.user._id.toString()) {
        // For student resources, check studentId matches student profile
        if (userIdField === 'studentId') {
          const Student = (await import('../models/Student.js')).default;
          const student = await Student.findOne({ userId: req.user._id });
          if (!student || resource[userIdField].toString() !== student._id.toString()) {
            return res.status(403).json({
              success: false,
              error: {
                code: 'FORBIDDEN',
                message: 'You do not have permission to access this resource'
              }
            });
          }
        } else {
          return res.status(403).json({
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'You do not have permission to access this resource'
            }
          });
        }
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error.message
        }
      });
    }
  };
};
