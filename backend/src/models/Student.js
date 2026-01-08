import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    index: true
  },
  enrollmentNumber: {
    type: String,
    index: true
  },
  yearOfStudy: {
    type: Number,
    min: 1,
    max: 5
  },
  branch: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  phone: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String
  },
  bio: {
    type: String,
    maxlength: 500
  },
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    index: true
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }],
  preferences: {
    jobTypes: [{
      type: String,
      enum: ['full-time', 'internship', 'contract']
    }],
    locations: [{
      type: String
    }],
    salaryRange: {
      min: Number,
      max: Number
    }
  }
}, {
  timestamps: true
});

// Index for search
studentSchema.index({ firstName: 'text', lastName: 'text', bio: 'text' });

const Student = mongoose.model('Student', studentSchema);

export default Student;
