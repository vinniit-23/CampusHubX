import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  entityType: {
    type: String,
    required: true,
    enum: ['student', 'college', 'recruiter', 'opportunity'],
    index: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  metricType: {
    type: String,
    required: true,
    enum: ['views', 'applications', 'matches', 'conversions'],
    index: true
  },
  value: {
    type: Number,
    default: 1
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
analyticsSchema.index({ entityType: 1, entityId: 1, metricType: 1, date: -1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
