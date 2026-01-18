import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "reviewing",
        "shortlisted",
        "rejected",
        "accepted",
        "withdrawn",
      ],
      default: "pending",
      index: true,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    coverLetter: {
      type: String,
      maxlength: 2000,
    },
    resumeUrl: {
      type: String,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index to prevent duplicate applications
applicationSchema.index({ opportunityId: 1, studentId: 1 }, { unique: true });

// Check if model exists before compiling to avoid OverwriteModelError (common in dev hot-reload)
const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);

export default Application;
