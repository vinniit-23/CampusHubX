import rateLimit from "express-rate-limit";
import config from "../config/environment.js";

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 🔥 INCREASE THIS to 100 or 500 for development
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Login rate limiter - stricter
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_LOGIN_ATTEMPTS",
      message: "Too many login attempts, please try again after 15 minutes.",
    },
  },
  skipSuccessfulRequests: true,
});

// Registration rate limiter
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REGISTRATIONS",
      message: "Too many registration attempts, please try again later.",
    },
  },
});

// Password reset rate limiter
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_RESET_REQUESTS",
      message: "Too many password reset requests, please try again later.",
    },
  },
});
