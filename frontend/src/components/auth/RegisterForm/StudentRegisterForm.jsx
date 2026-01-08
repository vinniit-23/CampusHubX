import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { studentRegisterSchema } from '../../../utils/validators';
import { authApi } from '../../../services/api/auth';
import { collegesApi } from '../../../services/api/colleges';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import Select from '../../common/Select/Select';
import toast from 'react-hot-toast';
import { ROUTES } from '../../../utils/constants';

const StudentRegisterForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(studentRegisterSchema),
  });

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await collegesApi.getAll();
        if (response.success) {
          setColleges(
            response.data.map((college) => ({
              value: college._id,
              label: college.collegeName,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching colleges:', error);
      } finally {
        setLoadingColleges(false);
      }
    };
    fetchColleges();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authApi.register(data, 'student');
      if (response.success) {
        toast.success('Registration successful! Please check your email to verify your account.');
        navigate(ROUTES.LOGIN);
      } else {
        toast.error(response.error?.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          name="firstName"
          register={register}
          error={errors.firstName?.message}
          placeholder="Enter your first name"
          required
        />

        <Input
          label="Last Name"
          name="lastName"
          register={register}
          error={errors.lastName?.message}
          placeholder="Enter your last name"
          required
        />
      </div>

      <Input
        label="Email"
        type="email"
        name="email"
        register={register}
        error={errors.email?.message}
        placeholder="Enter your email"
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        register={register}
        error={errors.password?.message}
        placeholder="Enter your password"
        required
      />

      <Select
        label="College"
        name="collegeId"
        value={watch('collegeId')}
        onChange={(e) => setValue('collegeId', e.target.value)}
        options={colleges}
        error={errors.collegeId?.message}
        placeholder={loadingColleges ? 'Loading colleges...' : 'Select your college'}
        required
        disabled={loadingColleges}
      />

      <Input
        label="Enrollment Number"
        name="enrollmentNumber"
        register={register}
        error={errors.enrollmentNumber?.message}
        placeholder="Enter your enrollment number"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Year of Study"
          type="number"
          name="yearOfStudy"
          register={register}
          error={errors.yearOfStudy?.message}
          placeholder="1-5"
          min="1"
          max="5"
        />

        <Input
          label="Branch"
          name="branch"
          register={register}
          error={errors.branch?.message}
          placeholder="e.g., Computer Science"
        />
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary-600 hover:text-primary-700 font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default StudentRegisterForm;
