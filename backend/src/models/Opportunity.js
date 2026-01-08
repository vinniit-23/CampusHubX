import mongoose from 'mongoose';
import { DEFAULT_MATCH_SCORE_THRESHOLD } from '../utils/constants.js';

const opportunitySchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['full-time', 'internship', 'contract', 'freelance'],
    index: true
  },
  location: {
    type: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      required: true
    },
    city: String,
    state: String,
    country: String
  },
  salaryRange: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  requiredSkills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    index: true
  }],
  requiredExperience: {
    type: Number,
    min: 0
  },
  requirements: [{
    type: String
  }],
  responsibilities: [{
    type: String
  }],
  benefits: [{
    type: String
  }],
  applicationDeadline: {
    type: Date,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }],
  matchScoreThreshold: {
    type: Number,
    default: DEFAULT_MATCH_SCORE_THRESHOLD,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Index for search
opportunitySchema.index({ title: 'text', description: 'text', requirements: 'text' });

const Opportunity = mongoose.model('Opportunity', opportunitySchema);

export default Opportunity;
