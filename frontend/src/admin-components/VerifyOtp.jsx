import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(`${backendUrl}/api/user/verify-otp`, {
        email,
        otp,
      });

      if (response.data.success) {
        toast.success(response.data.message || "OTP verified successfully");
        navigate("/reset-password", { state: { email, otp } });
      } else {
        toast.error(response.data.message || "Invalid OTP");
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
        onSubmit={handleVerifyOtp}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Verify OTP</h2>
        <p className="text-gray-500 mb-6">
          Enter the OTP sent to <span className="font-medium">{email}</span>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-black"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-70"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;