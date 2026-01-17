import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { projectsApi } from "../../services/api/projects";
import { achievementsApi } from "../../services/api/achievements";
import { studentsApi } from "../../services/api/students";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

// Components
import Spinner from "../../components/common/Spinner/Spinner";
import Modal from "../../components/common/Modal/Modal";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";

// Icons
import {
  HiPencil,
  HiLocationMarker,
  HiAcademicCap,
  HiCode,
  HiLink,
  HiPlus,
  HiExternalLink,
  HiBriefcase,
  HiBadgeCheck,
  HiUser,
} from "react-icons/hi";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function StudentProfile() {
  const { user, checkAuth } = useAuth();
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
      resumeUrl: "",
      githubUrl: "",
      linkedinUrl: "",
      portfolioUrl: "",
    },
  });

  // Load Data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.profile?._id) return;

      try {
        const [projectsRes, achievementsRes] = await Promise.allSettled([
          projectsApi.getByStudent(user.profile._id),
          achievementsApi.getByStudent(user.profile._id),
        ]);

        if (projectsRes.status === "fulfilled" && projectsRes.value.success) {
          setProjects(projectsRes.value.data?.data || []);
        }
        if (
          achievementsRes.status === "fulfilled" &&
          achievementsRes.value.success
        ) {
          setAchievements(achievementsRes.value.data?.data || []);
        }
      } catch (error) {
        console.error("Failed to load profile data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  // Open Modal & Pre-fill data
  const handleEditClick = () => {
    reset({
      firstName: user.profile.firstName || "",
      lastName: user.profile.lastName || "",
      bio: user.profile.bio || "",
      resumeUrl: user.profile.resumeUrl || "",
      githubUrl: user.profile.socialLinks?.github || "",
      linkedinUrl: user.profile.socialLinks?.linkedin || "",
      portfolioUrl: user.profile.socialLinks?.portfolio || "",
    });
    setIsEditing(true);
  };

  // Submit Update
  const onSubmit = async (data) => {
    try {
      setUpdating(true);

      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        resumeUrl: data.resumeUrl,
        socialLinks: {
          github: data.githubUrl,
          linkedin: data.linkedinUrl,
          portfolio: data.portfolioUrl,
        },
      };

      const response = await studentsApi.updateProfile(payload);

      if (response.success) {
        toast.success("Profile updated successfully!");
        await checkAuth(); // Refresh global user state
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (!user?.profile)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* 1. Header Section */}
      <div className="relative mb-20">
        <div className="h-48 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

        <div className="absolute -bottom-16 left-0 right-0 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur-sm ring-1 ring-gray-900/5 sm:flex sm:items-end sm:justify-between sm:space-x-5">
            <div className="flex items-center space-x-5">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md ring-1 ring-gray-200 sm:h-32 sm:w-32">
                  {user.profile.profilePicture ? (
                    <img
                      className="h-full w-full rounded-full object-cover"
                      src={user.profile.profilePicture}
                      alt="Profile"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-600">
                      {user.profile.firstName?.[0]}
                      {user.profile.lastName?.[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-16 sm:mt-0 sm:pb-1">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {user.profile.firstName} {user.profile.lastName}
                </h1>
                <p className="flex items-center text-sm font-medium text-gray-500">
                  <HiAcademicCap className="mr-1.5 h-5 w-5 text-gray-400" />
                  {user.profile.branch} • {user.profile.yearOfStudy || "N/A"}{" "}
                  Year
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:mt-0 sm:flex-row">
              {user.profile.resumeUrl && (
                <a
                  href={user.profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <HiLink className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                  Resume
                </a>
              )}
              <button
                onClick={handleEditClick}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                <HiPencil className="-ml-1 mr-2 h-5 w-5" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Grid Layout */}
      <div className="mx-auto mt-8 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Bio & Info */}
          <div className="space-y-8 lg:col-span-1">
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
              <h2 className="text-base font-semibold leading-6 text-gray-900">
                About
              </h2>
              <p className="mt-4 text-sm text-gray-500">
                {user.profile.bio ||
                  "No bio added yet. Tell recruiters about yourself!"}
              </p>
              <div className="mt-6 border-t border-gray-100 pt-6">
                <h3 className="text-sm font-medium text-gray-900">Skills</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {user.profile.skills?.length > 0 ? (
                    user.profile.skills.map((skill) => (
                      <span
                        key={skill._id || skill}
                        className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                      >
                        {skill.name || skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">
                      No skills added
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
              <h3 className="text-sm font-medium text-gray-900">Information</h3>
              <ul className="mt-4 space-y-4">
                <li className="flex items-center text-sm text-gray-500">
                  <HiLocationMarker className="mr-2 h-5 w-5 text-gray-400" />
                  India
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <HiCode className="mr-2 h-5 w-5 text-gray-400" />
                  {user.email}
                </li>
                {user.profile.socialLinks?.github && (
                  <li className="flex items-center text-sm text-gray-500">
                    <FaGithub className="mr-2 h-5 w-5 text-gray-400" />
                    <a
                      href={user.profile.socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-indigo-600 truncate"
                    >
                      GitHub
                    </a>
                  </li>
                )}
                {user.profile.socialLinks?.linkedin && (
                  <li className="flex items-center text-sm text-gray-500">
                    <FaLinkedin className="mr-2 h-5 w-5 text-gray-400" />
                    <a
                      href={user.profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-indigo-600 truncate"
                    >
                      LinkedIn
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Right Column: Projects & Achievements */}
          <div className="space-y-8 lg:col-span-2">
            {/* Projects */}
            <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <HiBriefcase className="text-indigo-500" /> Projects
                </h2>
                <Link
                  to={ROUTES.STUDENT_PROJECTS}
                  className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <HiPlus className="h-4 w-4" /> Add New
                </Link>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="h-20 bg-gray-100 animate-pulse rounded"></div>
                ) : projects.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {projects.map((project) => (
                      <div
                        key={project._id}
                        className="group relative flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-md"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
                              {project.title}
                            </h3>
                            {project.projectUrl && (
                              <a
                                href={project.projectUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-400 hover:text-indigo-600"
                              >
                                <HiExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                          <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">
                      Showcase your work here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <HiBadgeCheck className="text-yellow-500" /> Achievements
                </h2>
                <Link
                  to={ROUTES.STUDENT_ACHIEVEMENTS}
                  className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <HiPlus className="h-4 w-4" /> Add New
                </Link>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="h-20 bg-gray-100 animate-pulse rounded"></div>
                ) : achievements.length > 0 ? (
                  <ul className="-my-5 divide-y divide-gray-100">
                    {achievements.map((achievement) => (
                      <li key={achievement._id} className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-none rounded-full bg-yellow-50 p-2">
                            <HiBadgeCheck className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {achievement.title}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {achievement.issuer}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500">
                      No achievements added yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 IMPACTFUL EDIT CARD MODAL */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title=""
        size="lg"
      >
        <div className="text-center mb-6 ">
          <div className="mx-auto h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center mb-3 ring-4 ring-white shadow-lg">
            <HiUser className="h-10 w-10 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Edit Your Profile</h3>
          <p className="text-sm text-gray-500">
            Update your personal details and links
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-2 ">
          {/* Personal Info Group */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <HiUser className="text-indigo-500" /> Personal Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                error={errors.firstName?.message}
                className="bg-white"
              />
              <Input
                label="Last Name"
                {...register("lastName", { required: "Last name is required" })}
                error={errors.lastName?.message}
                className="bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                {...register("bio")}
                rows={3}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-3 resize-none bg-white"
                placeholder="I am a passionate developer..."
              />
            </div>
          </div>

          {/* Links Group */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <HiLink className="text-indigo-500" /> Social & Resume
            </div>

            <Input
              label="Resume URL"
              {...register("resumeUrl")}
              placeholder="https://drive.google.com/..."
              className="bg-white"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="GitHub"
                {...register("githubUrl")}
                placeholder="URL"
                className="bg-white"
              />
              <Input
                label="LinkedIn"
                {...register("linkedinUrl")}
                placeholder="URL"
                className="bg-white"
              />
              <Input
                label="Portfolio"
                {...register("portfolioUrl")}
                placeholder="URL"
                className="bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsEditing(false)}
              type="button"
            >
              Cancel
            </Button>
            {/* 🔥 FIXED: Use 'loading' prop here, NOT 'isLoading' */}
            <Button
              type="submit"
              loading={updating}
              className="px-8 shadow-lg shadow-indigo-200"
            >
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
