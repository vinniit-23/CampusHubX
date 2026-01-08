import nodemailer from 'nodemailer';
import config from '../config/environment.js';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: config.EMAIL_SERVICE,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS
    }
  });
};

export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email, token, firstName = 'User') => {
  const verificationUrl = `${config.FRONTEND_URL}/verify-email/${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to CampusHubX!</h2>
      <p>Hi ${firstName},</p>
      <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>Or copy and paste this link in your browser:</p>
      <p>${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    </div>
  `;

  return sendEmail({
    email,
    subject: 'Verify your CampusHubX account',
    text: `Please verify your email by visiting: ${verificationUrl}`,
    html
  });
};

export const sendPasswordResetEmail = async (email, token, firstName = 'User') => {
  const resetUrl = `${config.FRONTEND_URL}/reset-password/${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>Hi ${firstName},</p>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>Or copy and paste this link in your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    </div>
  `;

  return sendEmail({
    email,
    subject: 'Reset your CampusHubX password',
    text: `Reset your password by visiting: ${resetUrl}`,
    html
  });
};

export const sendApplicationNotification = async (email, opportunityTitle, recruiterName) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Application Received</h2>
      <p>Hi ${recruiterName},</p>
      <p>You have received a new application for: <strong>${opportunityTitle}</strong></p>
      <p>Please log in to your dashboard to review the application.</p>
    </div>
  `;

  return sendEmail({
    email,
    subject: `New application for ${opportunityTitle}`,
    text: `You have received a new application for ${opportunityTitle}`,
    html
  });
};
