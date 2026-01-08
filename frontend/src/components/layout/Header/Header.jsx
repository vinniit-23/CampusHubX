import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useRole } from '../../../hooks/useRole';
import { ROUTES } from '../../../utils/constants';
import Avatar from "../../common/Avatar/Avatar";
import { HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';

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

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? getDashboardRoute() : ROUTES.HOME} className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">CampusHubX</span>
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
                    to={ROUTES.COLLEGE_STUDENTS}
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
              {isRecruiter && (
                <>
                  <Link
                    to={ROUTES.RECRUITER_OPPORTUNITIES}
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Opportunities
                  </Link>
                  <Link
                    to={ROUTES.RECRUITER_APPLICATIONS}
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Applications
                  </Link>
                </>
              )}
              <div className="flex items-center space-x-4">
                <Avatar
                  name={`${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`}
                  src={user?.profile?.profilePicture}
                  size="sm"
                />
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 transition-colors"
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

          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="flex flex-col space-y-4">
                <Link to={getDashboardRoute()} className="text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
                {isStudent && (
                  <>
                    <Link to={ROUTES.STUDENT_OPPORTUNITIES} className="text-gray-700 hover:text-primary-600">
                      Opportunities
                    </Link>
                    <Link to={ROUTES.STUDENT_APPLICATIONS} className="text-gray-700 hover:text-primary-600">
                      Applications
                    </Link>
                  </>
                )}
                <button onClick={handleLogout} className="text-left text-gray-700 hover:text-red-600">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <Link to={ROUTES.LOGIN} className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to={ROUTES.REGISTER} className="text-gray-700 hover:text-primary-600">
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
