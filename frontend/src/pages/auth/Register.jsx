import { useState } from 'react';
import { Link } from 'react-router-dom';
import StudentRegisterForm from '../../components/auth/RegisterForm/StudentRegisterForm';
import CollegeRegisterForm from '../../components/auth/RegisterForm/CollegeRegisterForm';
import RecruiterRegisterForm from '../../components/auth/RegisterForm/RecruiterRegisterForm';
import { ROUTES } from '../../utils/constants';
import Card from '../../components/common/Card/Card';
import { ROLES } from '../../utils/constants';

const Register = () => {
  const [selectedRole, setSelectedRole] = useState(ROLES.STUDENT);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setSelectedRole(ROLES.STUDENT)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedRole === ROLES.STUDENT
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setSelectedRole(ROLES.COLLEGE)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedRole === ROLES.COLLEGE
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            College
          </button>
          <button
            onClick={() => setSelectedRole(ROLES.RECRUITER)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedRole === ROLES.RECRUITER
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Recruiter
          </button>
        </div>

        <Card>
          <Card.Body>
            {selectedRole === ROLES.STUDENT && <StudentRegisterForm />}
            {selectedRole === ROLES.COLLEGE && <CollegeRegisterForm />}
            {selectedRole === ROLES.RECRUITER && <RecruiterRegisterForm />}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Register;
