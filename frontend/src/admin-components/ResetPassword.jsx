import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const otp = location.state?.otp;

  if (!email || !otp) {
    return <Navigate to="/forgot-password" replace />;
  }

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const response = await axios.post(`${backendUrl}/api/user/reset-password`, {
        email,
        otp,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Password reset successful");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleResetPassword}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Reset Password</h2>
        <p className="text-gray-500 mb-6">Enter your new password</p>

        <input
          type="password"
          name="newPassword"
          placeholder="New password"
          value={formData.newPassword}
          onChange={onChangeHandler}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-black"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          value={formData.confirmPassword}
          onChange={onChangeHandler}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 outline-none focus:ring-2 focus:ring-black"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-70"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;