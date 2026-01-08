import jwt from 'jsonwebtoken';
import config from './environment.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

export const generateEmailVerificationToken = (payload) => {
  return jwt.sign(payload, config.EMAIL_VERIFICATION_SECRET, {
    expiresIn: '24h'
  });
};

export const verifyEmailVerificationToken = (token) => {
  try {
    return jwt.verify(token, config.EMAIL_VERIFICATION_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired verification token');
  }
};

export const generatePasswordResetToken = (payload) => {
  return jwt.sign(payload, config.PASSWORD_RESET_SECRET, {
    expiresIn: '1h'
  });
};

export const verifyPasswordResetToken = (token) => {
  try {
    return jwt.verify(token, config.PASSWORD_RESET_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired reset token');
  }
};
