import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useRole } from "../../../hooks/useRole";
import { ROUTES } from "../../../utils/constants";
import Avatar from "../../common/Avatar/Avatar";
import { HiMenu, HiX, HiUserCircle } from "react-icons/hi"; // Added HiUserCircle
import { useState } from "react";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isStudent, isCollege, isRecruiter } = useRole();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const getDashboardRoute = () => {
    if (isStudent) return ROUTES.STUDENT_DASHBOARD;
    if (isCollege) return ROUTES.COLLEGE_DASHBOARD;
    if (isRecruiter) return ROUTES.RECRUITER_DASHBOARD;
    return ROUTES.HOME;
  };

  // 🔥 NEW: Helper to get the correct profile link
  const getProfileRoute = () => {
    if (isStudent) return "/student/profile";
    if (isCollege) return "/college/profile";
    if (isRecruiter) return "/recruiter/profile";
    return "#";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              to={isAuthenticated ? getDashboardRoute() : ROUTES.HOME}
              className="flex items-center"
            >
              <span className="text-2xl font-bold text-primary-600">
                CampusHubX
              </span>
            </Link>
          </div>

          {isAuthenticated ? (
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to={getDashboardRoute()}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Dashboard
              </Link>

              {/* ... Existing Links for Student/College/Recruiter ... */}
              {isStudent && (
                <>
                  <Link
                    to={ROUTES.STUDENT_OPPORTUNITIES}
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Opportunities
                  </Link>
                  <Link
                    to={ROUTES.STUDENT_APPLICATIONS}
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Applications
                  </Link>
                </>
              )}
              {isCollege && (
                <>
                  <Link
                    to={ROUTES.COLLEGE_STUDENTS || "/college/students"}
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Students
                  </Link>
                  <Link
                    to={ROUTES.COLLEGE_VERIFICATIONS}
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Verifications
                  </Link>
                </>
              )}

              <div className="flex items-center space-x-4 border-l pl-4 border-gray-200">
                {/* 🔥 NEW: My Profile Link (Desktop) */}
                <Link
                  to={getProfileRoute()}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <Avatar
                    name={`${user?.profile?.firstName || ""} ${user?.profile?.lastName || ""}`}
                    src={user?.profile?.profilePicture}
                    size="sm"
                  />
                  <span className="text-sm font-medium">My Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center space-x-4">
              <Link
                to={ROUTES.LOGIN}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Sign Up
              </Link>
            </nav>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Content */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="flex flex-col space-y-4">
                <Link
                  to={getDashboardRoute()}
                  className="text-gray-700 hover:text-primary-600"
                >
                  Dashboard
                </Link>

                {/* 🔥 NEW: My Profile Link (Mobile) */}
                <Link
                  to={getProfileRoute()}
                  className="text-gray-700 hover:text-primary-600 flex items-center gap-2"
                >
                  <HiUserCircle className="w-5 h-5" /> My Profile
                </Link>

                {isStudent && (
                  <>
                    <Link
                      to={ROUTES.STUDENT_OPPORTUNITIES}
                      className="text-gray-700 hover:text-primary-600"
                    >
                      Opportunities
                    </Link>
                    <Link
                      to={ROUTES.STUDENT_APPLICATIONS}
                      className="text-gray-700 hover:text-primary-600"
                    >
                      Applications
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="text-left text-gray-700 hover:text-red-600 border-t pt-2 mt-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              // ... existing non-auth mobile menu ...
              <div className="flex flex-col space-y-4">
                <Link
                  to={ROUTES.LOGIN}
                  className="text-gray-700 hover:text-primary-600"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="text-gray-700 hover:text-primary-600"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
