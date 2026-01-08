import mongoose from 'mongoose';

const recruiterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String
  },
  logo: {
    type: String
  },
  description: {
    type: String,
    maxlength: 1000
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  opportunities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity'
  }],
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }]
}, {
  timestamps: true
});

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

export default Recruiter;
