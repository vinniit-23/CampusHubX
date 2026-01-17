import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { recruiterRegisterSchema } from "../../../utils/validators";
import { authApi } from "../../../services/api/auth";
import Button from "../../common/Button/Button";
import Input from "../../common/Input/Input";
import toast from "react-hot-toast";
import { ROUTES } from "../../../utils/constants";

const RecruiterRegisterForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recruiterRegisterSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);

    // --- FIX START: Sanitize Data ---
    // Create a clean copy of the data
    const cleanData = { ...data };

    // 1. Handle Website: If empty string, remove it or set to undefined
    if (!cleanData.website) delete cleanData.website;

    // 2. Handle Phone: If empty string, remove it
    if (!cleanData.phone) delete cleanData.phone;

    // 3. Handle Address: Remove empty fields from address object
    if (cleanData.address) {
      const cleanAddress = {};
      Object.keys(cleanData.address).forEach((key) => {
        if (cleanData.address[key]?.trim()) {
          cleanAddress[key] = cleanData.address[key];
        }
      });

      // If address object ends up empty, remove it entirely
      if (Object.keys(cleanAddress).length > 0) {
        cleanData.address = cleanAddress;
      } else {
        delete cleanData.address;
      }
    }
    // --- FIX END ---

    try {
      // Send 'cleanData' instead of 'data'
      const response = await authApi.register(cleanData, "recruiter");

      if (response.success) {
        toast.success(
          "Registration successful! Please check your email to verify your account."
        );
        navigate(ROUTES.LOGIN);
      } else {
        toast.error(response.error?.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(
        error.response?.data?.error?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Company Name"
        name="companyName"
        register={register}
        error={errors.companyName?.message}
        placeholder="Enter company name"
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        register={register}
        error={errors.email?.message}
        placeholder="Enter company email"
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

      <Input
        label="Website"
        type="url"
        name="website"
        register={register}
        error={errors.website?.message}
        placeholder="https://example.com"
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
        Already have an account?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RecruiterRegisterForm;
