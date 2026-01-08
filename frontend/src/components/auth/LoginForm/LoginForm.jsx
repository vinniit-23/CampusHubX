import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { loginSchema } from '../../../utils/validators';
import { authApi } from '../../../services/api/auth';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import toast from 'react-hot-toast';
import { ROUTES } from '../../../utils/constants';

const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authApi.login(data.email, data.password);
      if (response.success) {
        const { token, refreshToken, user } = response.data;
        localStorage.setItem('token', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Login successful!');
        
        // Redirect based on role
        if (user.role === 'student') {
          navigate(ROUTES.STUDENT_DASHBOARD);
        } else if (user.role === 'college') {
          navigate(ROUTES.COLLEGE_DASHBOARD);
        } else if (user.role === 'recruiter') {
          navigate(ROUTES.RECRUITER_DASHBOARD);
        } else {
          navigate(ROUTES.HOME);
        }
        window.location.reload(); // Reload to update auth context
      } else {
        toast.error(response.error?.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Sign In
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-primary-600 hover:text-primary-700 font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
