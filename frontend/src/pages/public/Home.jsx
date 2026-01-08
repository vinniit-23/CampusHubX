import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import Button from '../../components/common/Button/Button';
import { HiAcademicCap, HiBriefcase, HiUserGroup } from 'react-icons/hi';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-primary-600">CampusHubX</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect students, colleges, and recruiters in one platform
          </p>
          <div className="flex justify-center space-x-4">
            <Link to={ROUTES.LOGIN}>
              <Button size="lg">Sign In</Button>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <Button variant="outline" size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <HiAcademicCap className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">For Students</h3>
            <p className="text-gray-600">
              Track your skills, showcase projects, and discover opportunities matched to your profile.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <HiUserGroup className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">For Colleges</h3>
            <p className="text-gray-600">
              Verify student achievements, track student progress, and connect with recruiters.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <HiBriefcase className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">For Recruiters</h3>
            <p className="text-gray-600">
              Find the best talent with AI-powered matching and verified student profiles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
