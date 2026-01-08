import { asyncHandler, formatResponse } from '../utils/helpers.js';
import * as authService from '../services/authService.js';

/**
 * Register Student
 */
export const registerStudent = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, collegeId, enrollmentNumber, yearOfStudy, branch } = req.body;

  const result = await authService.registerStudent(
    { email, password },
    { firstName, lastName, collegeId, enrollmentNumber, yearOfStudy, branch }
  );

  res.status(201).json(
    formatResponse(true, { userId: result.userId, studentId: result.studentId }, 'Registration successful. Please verify your email.')
  );
});

/**
 * Register College
 */
export const registerCollege = asyncHandler(async (req, res) => {
  const { email, password, name, code, phone, address } = req.body;

  const result = await authService.registerCollege(
    { email, password },
    { name, code, email, phone, address }
  );

  res.status(201).json(
    formatResponse(true, { userId: result.userId, collegeId: result.collegeId }, 'Registration successful. Verification pending.')
  );
});

/**
 * Register Recruiter
 */
export const registerRecruiter = asyncHandler(async (req, res) => {
  const { email, password, companyName, phone, website, address } = req.body;

  const result = await authService.registerRecruiter(
    { email, password },
    { companyName, email, phone, website, address }
  );

  res.status(201).json(
    formatResponse(true, { userId: result.userId, recruiterId: result.recruiterId }, 'Registration successful. Please verify your email.')
  );
});

/**
 * Login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.loginUser(email, password);

  res.status(200).json(
    formatResponse(true, result, 'Login successful')
  );
});

/**
 * Logout
 */
export const logout = asyncHandler(async (req, res) => {
  // In a more advanced setup, you might want to blacklist the token
  res.status(200).json(
    formatResponse(true, null, 'Logout successful')
  );
});

/**
 * Verify Email
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  await authService.verifyEmail(token);

  res.status(200).json(
    formatResponse(true, null, 'Email verified successfully')
  );
});

/**
 * Forgot Password
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await authService.requestPasswordReset(email);

  res.status(200).json(
    formatResponse(true, null, 'Password reset email sent if account exists')
  );
});

/**
 * Reset Password
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  await authService.resetPassword(token, newPassword);

  res.status(200).json(
    formatResponse(true, null, 'Password reset successful')
  );
});

/**
 * Get Current User
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const result = await authService.getCurrentUserProfile(req.user._id);

  res.status(200).json(
    formatResponse(true, result, 'User profile retrieved successfully')
  );
});

/**
 * Refresh Token
 */
export const refreshToken = asyncHandler(async (req, res) => {
  // This would typically use a refresh token from cookies or body
  // For now, just re-authenticate with the current token
  const result = await authService.getCurrentUserProfile(req.user._id);
  
  res.status(200).json(
    formatResponse(true, { user: result }, 'Token refreshed')
  );
});
