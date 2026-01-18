import {
  asyncHandler,
  formatResponse,
  paginate,
  formatPaginationResponse,
} from "../utils/helpers.js";
import mongoose from "mongoose";
import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";
import Student from "../models/Student.js";
import Recruiter from "../models/Recruiter.js";
import { APPLICATION_STATUS } from "../utils/constants.js";

/**
 * List applications (role-based)
 */
export const getAllApplications = asyncHandler(async (req, res) => {
  const { page, limit } = paginate(req.query.page, req.query.limit);
  let query = {};

  if (req.user.role === "student") {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student)
      return res.status(404).json(
        formatResponse(false, null, "Student not found", {
          code: "NOT_FOUND",
        }),
      );
    query.studentId = student._id;
  } else if (req.user.role === "recruiter") {
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter)
      return res.status(404).json(
        formatResponse(false, null, "Recruiter not found", {
          code: "NOT_FOUND",
        }),
      );
    const opportunities = await Opportunity.find({
      recruiterId: recruiter._id,
    }).select("_id");
    query.opportunityId = { $in: opportunities.map((o) => o._id) };
  }

  if (req.query.status) query.status = req.query.status;
  if (req.query.opportunityId) query.opportunityId = req.query.opportunityId;

  const total = await Application.countDocuments(query);
  const applications = await Application.find(query)
    .populate("studentId", "firstName lastName profilePicture collegeId")
    .populate({
      path: "studentId",
      populate: { path: "collegeId", select: "name" },
    })
    .populate("opportunityId", "title type location recruiterId")
    .populate({
      path: "opportunityId",
      populate: { path: "recruiterId", select: "companyName logo" },
    })
    .populate("reviewedBy", "companyName")
    .sort({ appliedAt: -1 })
    .skip(page.skip)
    .limit(page.limit);

  res
    .status(200)
    .json(
      formatResponse(
        true,
        formatPaginationResponse(applications, total, page.page, page.limit),
        "Success",
      ),
    );
});

/**
 * Get application by ID
 */
export const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate(
      "studentId",
      "firstName lastName profilePicture skills achievements projects",
    )
    .populate({
      path: "studentId",
      populate: [{ path: "skills" }, { path: "collegeId", select: "name" }],
    })
    .populate("opportunityId")
    .populate({
      path: "opportunityId",
      populate: { path: "recruiterId", select: "companyName logo" },
    })
    .populate("reviewedBy", "companyName");

  if (!application)
    return res
      .status(404)
      .json(formatResponse(false, null, "Not found", { code: "NOT_FOUND" }));

  if (req.user.role === "student") {
    const student = await Student.findOne({ userId: req.user._id });
    if (application.studentId._id.toString() !== student._id.toString()) {
      return res
        .status(403)
        .json(formatResponse(false, null, "Forbidden", { code: "FORBIDDEN" }));
    }
  } else if (req.user.role === "recruiter") {
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    const jobRecruiterId =
      application.opportunityId.recruiterId._id ||
      application.opportunityId.recruiterId;
    if (jobRecruiterId.toString() !== recruiter._id.toString()) {
      return res
        .status(403)
        .json(formatResponse(false, null, "Forbidden", { code: "FORBIDDEN" }));
    }
  }

  res.status(200).json(formatResponse(true, application, "Success"));
});

/**
 * Apply to opportunity (Fixes Matching Error)
 */
export const createApplication = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  if (!student)
    return res
      .status(404)
      .json(formatResponse(false, null, "Student not found"));

  const opportunity = await Opportunity.findById(req.body.opportunityId);
  if (!opportunity || !opportunity.isActive)
    return res
      .status(404)
      .json(formatResponse(false, null, "Opportunity unavailable"));

  const existingApplication = await Application.findOne({
    studentId: student._id,
    opportunityId: opportunity._id,
  });

  if (existingApplication) {
    if (existingApplication.status === "withdrawn") {
      const matchingService = (await import("../services/matchingService.js"))
        .default;
      // ✅ FIX: Pass full objects (student, opportunity) not IDs
      const matchScore = await matchingService.calculateMatchScore(
        student,
        opportunity,
      );

      existingApplication.status = "pending";
      existingApplication.matchScore = matchScore;
      existingApplication.coverLetter = req.body.coverLetter;
      existingApplication.resumeUrl = req.body.resumeUrl;
      existingApplication.appliedAt = new Date();
      existingApplication.reviewedBy = undefined;
      existingApplication.reviewedAt = undefined;
      existingApplication.notes = undefined;

      await existingApplication.save();

      const populated = await Application.findById(existingApplication._id)
        .populate("opportunityId", "title type")
        .populate("studentId", "firstName lastName");

      return res
        .status(201)
        .json(
          formatResponse(true, populated, "Application submitted successfully"),
        );
    }

    return res
      .status(409)
      .json(
        formatResponse(false, null, "Already applied", { code: "DUPLICATE" }),
      );
  }

  const matchingService = (await import("../services/matchingService.js"))
    .default;
  // ✅ FIX: Pass full objects (student, opportunity) not IDs
  const matchScore = await matchingService.calculateMatchScore(
    student,
    opportunity,
  );

  const application = await Application.create({
    opportunityId: opportunity._id,
    studentId: student._id,
    coverLetter: req.body.coverLetter,
    resumeUrl: req.body.resumeUrl,
    matchScore,
    status: APPLICATION_STATUS.PENDING,
  });

  student.applications.push(application._id);
  await student.save();
  opportunity.applications.push(application._id);
  await opportunity.save();

  res
    .status(201)
    .json(formatResponse(true, application, "Application submitted"));
});

/**
 * Update Status (Recruiter)
 */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const recruiter = await Recruiter.findOne({ userId: req.user._id });
  if (!recruiter)
    return res.status(404).json(
      formatResponse(false, null, "Recruiter not found", {
        code: "NOT_FOUND",
      }),
    );

  const application = await Application.findById(req.params.id).populate(
    "opportunityId",
  );
  if (!application)
    return res.status(404).json(
      formatResponse(false, null, "Application not found", {
        code: "NOT_FOUND",
      }),
    );

  if (
    application.opportunityId.recruiterId.toString() !==
    recruiter._id.toString()
  ) {
    return res
      .status(403)
      .json(formatResponse(false, null, "Forbidden", { code: "FORBIDDEN" }));
  }

  application.status = req.body.status;
  application.reviewedBy = recruiter._id;
  application.reviewedAt = new Date();
  if (req.body.notes) application.notes = req.body.notes;
  await application.save();

  res.status(200).json(formatResponse(true, application, "Status updated"));
});

/**
 * Get Opportunity Applications
 */
export const getOpportunityApplications = asyncHandler(async (req, res) => {
  const recruiter = await Recruiter.findOne({ userId: req.user._id });
  if (!recruiter)
    return res
      .status(404)
      .json(formatResponse(false, null, "Recruiter not found"));

  const opportunity = await Opportunity.findById(req.params.opportunityId);
  if (!opportunity)
    return res
      .status(404)
      .json(formatResponse(false, null, "Opportunity not found"));

  if (opportunity.recruiterId.toString() !== recruiter._id.toString())
    return res.status(403).json(formatResponse(false, null, "Forbidden"));

  const { page, limit } = paginate(req.query.page, req.query.limit);
  const query = { opportunityId: opportunity._id };
  if (req.query.status) query.status = req.query.status;

  const total = await Application.countDocuments(query);
  const applications = await Application.find(query)
    .populate("studentId", "firstName lastName profilePicture skills")
    .populate({
      path: "studentId",
      populate: { path: "collegeId", select: "name" },
    })
    .sort({ matchScore: -1, appliedAt: -1 })
    .skip(page.skip)
    .limit(page.limit);

  res
    .status(200)
    .json(
      formatResponse(
        true,
        formatPaginationResponse(applications, total, page.page, page.limit),
        "Success",
      ),
    );
});

/**
 * Get Student Applications
 */
export const getStudentApplications = asyncHandler(async (req, res) => {
  const { page, limit } = paginate(req.query.page, req.query.limit);
  const query = { studentId: req.params.studentId };
  if (req.query.status) query.status = req.query.status;

  const total = await Application.countDocuments(query);
  const applications = await Application.find(query)
    .populate("opportunityId", "title type location recruiterId")
    .populate({
      path: "opportunityId",
      populate: { path: "recruiterId", select: "companyName logo" },
    })
    .sort({ appliedAt: -1 })
    .skip(page.skip)
    .limit(page.limit);

  res
    .status(200)
    .json(
      formatResponse(
        true,
        formatPaginationResponse(applications, total, page.page, page.limit),
        "Success",
      ),
    );
});

/**
 * Withdraw Application
 */
export const withdrawApplication = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  if (!student)
    return res
      .status(404)
      .json(formatResponse(false, null, "Student not found"));

  const application = await Application.findById(req.params.id);
  if (!application)
    return res.status(404).json(formatResponse(false, null, "Not found"));

  if (application.studentId.toString() !== student._id.toString()) {
    return res.status(403).json(formatResponse(false, null, "Forbidden"));
  }

  if (["rejected", "accepted", "withdrawn"].includes(application.status)) {
    return res
      .status(400)
      .json(
        formatResponse(false, null, `Cannot withdraw: ${application.status}`),
      );
  }

  application.status = "withdrawn";
  await application.save();

  res
    .status(200)
    .json(formatResponse(true, application, "Withdrawn successfully"));
});
