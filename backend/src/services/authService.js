import User from '../models/User.js';
import Student from '../models/Student.js';
import College from '../models/College.js';
import Recruiter from '../models/Recruiter.js';
import { 
  generateToken, 
  generateEmailVerificationToken,
  generatePasswordResetToken,
  verifyEmailVerificationToken,
  verifyPasswordResetToken
} from '../config/jwt.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './emailService.js';

/**
 * Register a new student
 */
export const registerStudent = async (userData, studentData) => {
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user
    const user = await User.create({
      email: userData.email,
      password: userData.password,
      role: 'student',
      isEmailVerified: false
    });

    // Create student profile
    const student = await Student.create({
      userId: user._id,
      ...studentData
    });

    // Generate verification token
    const verificationToken = generateEmailVerificationToken({
      userId: user._id,
      email: user.email
    });

    // Update user with verification token
    user.emailVerificationToken = verificationToken;
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(
        user.email,
        verificationToken,
        studentData.firstName
      );
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue even if email fails
    }

    return {
      userId: user._id,
      studentId: student._id,
      email: user.email
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Register a new college
 */
export const registerCollege = async (userData, collegeData) => {
  try {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await User.create({
      email: userData.email,
      password: userData.password,
      role: 'college',
      isEmailVerified: false
    });

    const college = await College.create({
      userId: user._id,
      ...collegeData,
      verified: false
    });

    // Colleges need admin verification, but still send email verification
    const verificationToken = generateEmailVerificationToken({
      userId: user._id,
      email: user.email
    });

    user.emailVerificationToken = verificationToken;
    await user.save();

    return {
      userId: user._id,
      collegeId: college._id,
      email: user.email
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Register a new recruiter
 */
export const registerRecruiter = async (userData, recruiterData) => {
  try {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await User.create({
      email: userData.email,
      password: userData.password,
      role: 'recruiter',
      isEmailVerified: false
    });

    const recruiter = await Recruiter.create({
      userId: user._id,
      ...recruiterData,
      verified: false
    });

    const verificationToken = generateEmailVerificationToken({
      userId: user._id,
      email: user.email
    });

    user.emailVerificationToken = verificationToken;
    await user.save();

    try {
      await sendVerificationEmail(
        user.email,
        verificationToken,
        recruiterData.companyName
      );
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    return {
      userId: user._id,
      recruiterId: recruiter._id,
      email: user.email
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Login user
 */
export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Get user profile based on role
    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id });
    } else if (user.role === 'college') {
      profile = await College.findOne({ userId: user._id });
    } else if (user.role === 'recruiter') {
      profile = await Recruiter.findOne({ userId: user._id });
    }

    // Generate tokens
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    const refreshToken = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    return {
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profile
      }
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Verify email
 */
export const verifyEmail = async (token) => {
  try {
    const decoded = verifyEmailVerificationToken(token);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.emailVerificationToken !== token) {
      throw new Error('Invalid verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email) => {
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if user exists for security
      return true;
    }

    const resetToken = generatePasswordResetToken({
      userId: user._id,
      email: user.email
    });

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });

    // Get user name for email
    let firstName = 'User';
    if (user.role === 'student') {
      const student = await Student.findOne({ userId: user._id });
      if (student) firstName = student.firstName;
    }

    try {
      await sendPasswordResetEmail(email, resetToken, firstName);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
    }

    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const decoded = verifyPasswordResetToken(token);
    
    const user = await User.findById(decoded.userId).select('+passwordResetToken +passwordResetExpires');
    
    if (!user) {
      throw new Error('User not found');
    }

    if (user.passwordResetToken !== token) {
      throw new Error('Invalid reset token');
    }

    if (user.passwordResetExpires < new Date()) {
      throw new Error('Reset token expired');
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user profile
 */
export const getCurrentUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id })
        .populate('skills')
        .populate('collegeId');
    } else if (user.role === 'college') {
      profile = await College.findOne({ userId: user._id });
    } else if (user.role === 'recruiter') {
      profile = await Recruiter.findOne({ userId: user._id });
    }

    return {
      user,
      profile
    };
  } catch (error) {
    throw error;
  }
};
