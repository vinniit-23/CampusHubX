import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    trim: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['certification', 'award', 'competition', 'publication', 'other']
  },
  issuer: {
    type: String,
    required: [true, 'Issuer is required'],
    trim: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
    index: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College'
  },
  verifiedAt: {
    type: Date
  },
  certificateUrl: {
    type: String
  },
  evidenceUrl: {
    type: String
  },
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }]
}, {
  timestamps: true
});

// Index for search
achievementSchema.index({ title: 'text', description: 'text', issuer: 'text' });

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
