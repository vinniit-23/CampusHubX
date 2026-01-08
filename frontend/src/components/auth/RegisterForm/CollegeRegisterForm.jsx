import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { collegeRegisterSchema } from '../../../utils/validators';
import { authApi } from '../../../services/api/auth';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import toast from 'react-hot-toast';
import { ROUTES } from '../../../utils/constants';

const CollegeRegisterForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(collegeRegisterSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authApi.register(data, 'college');
      if (response.success) {
        toast.success('Registration successful! Your account will be verified by admin.');
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
      <Input
        label="College Name"
        name="name"
        register={register}
        error={errors.name?.message}
        placeholder="Enter college name"
        required
      />

      <Input
        label="College Code"
        name="code"
        register={register}
        error={errors.code?.message}
        placeholder="Enter college code"
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        register={register}
        error={errors.email?.message}
        placeholder="Enter college email"
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

      <Input
        label="Phone"
        type="tel"
        name="phone"
        register={register}
        error={errors.phone?.message}
        placeholder="Enter phone number"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="City"
          name="address.city"
          register={register}
          error={errors.address?.city?.message}
          placeholder="Enter city"
        />

        <Input
          label="State"
          name="address.state"
          register={register}
          error={errors.address?.state?.message}
          placeholder="Enter state"
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

export default CollegeRegisterForm;
