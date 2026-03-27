import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("Session expired. Please try again.");
      navigate("/login");
    }
  }, [email, navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      return toast.error("OTP must be 6 digits");
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/verify-otp`,
        { email, otp }
      );

      if (response.data.success) {
        toast.success("OTP Verified Successfully");
        navigate("/reset-password", { state: { email } });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleVerifyOtp} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Enter OTP</h2>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter 6 digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="w-full p-2 border rounded mb-4"
        />

        <button type="submit" className="w-full bg-black text-white py-2 rounded">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default Otp;
