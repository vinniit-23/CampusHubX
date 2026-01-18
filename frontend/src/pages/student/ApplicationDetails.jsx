import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaArrowLeft,
  FaPaperclip,
  FaExternalLinkAlt,
  FaBuilding,
  FaBan,
} from "react-icons/fa";
import { applicationsApi } from "../../services/api/applications";
import Spinner from "../../components/common/Spinner/Spinner";
import Card from "../../components/common/Card/Card";
import Badge from "../../components/common/Badge/Badge";
import Button from "../../components/common/Button/Button";
import {
  formatDate,
  getStatusColor,
  formatSalaryRange,
} from "../../utils/helpers";
import { ROUTES } from "../../utils/constants";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      const response = await applicationsApi.getById(id);
      if (response.success) {
        setApplication(response.data);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      toast.error("Failed to load application details");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    // Confirmation prevents accidental clicks
    if (
      !window.confirm(
        "Are you sure you want to withdraw this application? This action cannot be undone.",
      )
    ) {
      return;
    }

    setProcessing(true);
    try {
      const response = await applicationsApi.withdraw(id);
      if (response.success) {
        toast.success("Application withdrawn successfully");
        setApplication((prev) => ({ ...prev, status: "withdrawn" }));
      }
    } catch (error) {
      console.error("Withdraw error:", error);
      toast.error(
        error.response?.data?.message || "Failed to withdraw application",
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  if (!application)
    return <div className="text-center py-20">Application not found</div>;

  const {
    opportunityId: job,
    status,
    matchScore,
    coverLetter,
    resumeUrl,
    createdAt,
  } = application;
  const isWithdrawable = ["pending", "reviewing", "shortlisted"].includes(
    status,
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
      >
        <FaArrowLeft className="mr-2" /> Back to Applications
      </button>

      <Card>
        <Card.Body className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <Badge
                  className={`${getStatusColor(status)} text-sm px-3 py-1`}
                >
                  {status.toUpperCase()}
                </Badge>
                <span className="text-gray-500 text-sm">
                  Applied on {formatDate(createdAt)}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {job?.title || "Job Title Unavailable"}
              </h1>
              <div className="flex items-center text-gray-600 mt-2 font-medium">
                <FaBuilding className="mr-2 text-gray-400" />
                {job?.recruiterId?.companyName || "Company Name Unavailable"}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              {matchScore && (
                <div className="bg-blue-50 px-4 py-3 rounded-xl text-center min-w-[120px]">
                  <span className="block text-2xl font-bold text-blue-700">
                    {matchScore}%
                  </span>
                  <span className="text-xs text-blue-600 font-medium">
                    Match Score
                  </span>
                </div>
              )}

              {/* ✅ UPDATE: Smaller, Safer Withdraw Button */}
              {isWithdrawable && (
                <button
                  onClick={handleWithdraw}
                  disabled={processing}
                  className="mt-2 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-2 rounded-lg transition-all flex items-center"
                >
                  {processing ? (
                    <Spinner size="sm" />
                  ) : (
                    <>
                      <FaBan className="mr-2" /> Withdraw Application
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Rest of the page (Cover Letter, Attachments, Job Snapshot) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <Card.Header>
              <h3 className="font-semibold text-gray-900">Cover Letter</h3>
            </Card.Header>
            <Card.Body>
              {coverLetter ? (
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {coverLetter}
                </p>
              ) : (
                <p className="text-gray-400 italic">
                  No cover letter submitted.
                </p>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="font-semibold text-gray-900">Attachments</h3>
            </Card.Header>
            <Card.Body>
              {resumeUrl ? (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg mr-3 group-hover:bg-red-200">
                    <FaPaperclip />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Resume / CV</p>
                    <p className="text-xs text-gray-500">Click to view file</p>
                  </div>
                </a>
              ) : (
                <p className="text-gray-400 italic">No resume attached.</p>
              )}
            </Card.Body>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <Card.Header>
              <h3 className="font-semibold text-gray-900">Job Snapshot</h3>
            </Card.Header>
            <Card.Body className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">
                  {job?.location?.type === "remote"
                    ? "Remote"
                    : job?.location?.city || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Salary</p>
                <p className="font-medium">
                  {job?.salaryRange
                    ? formatSalaryRange(
                        job.salaryRange.min,
                        job.salaryRange.max,
                        job.salaryRange.currency,
                      )
                    : "Not disclosed"}
                </p>
              </div>
              <div className="pt-4 mt-2 border-t">
                <Link to={`${ROUTES.STUDENT_OPPORTUNITIES}/${job?._id}`}>
                  <Button variant="outline" className="w-full">
                    View Full Job <FaExternalLinkAlt className="ml-2 text-xs" />
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
