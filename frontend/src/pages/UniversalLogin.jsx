import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const UniversalLogin = () => {
  const navigate = useNavigate();
  const { token, updateToken } = useContext(ShopContext);
  
  const [currentState, setCurrentState] = useState("Login");
  const [userType, setUserType] = useState("buyer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (token) {
      const role = localStorage.getItem("role");
      if (role === "buyer") {
        navigate("/");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "seller") {
        navigate("/seller-dashboard");
      }
    }
  }, [token, navigate]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }

    if (!formData.password.trim()) {
      toast.error("Please enter your password");
      return false;
    }

    if (currentState === "Sign Up" && userType === "buyer") {
      if (!formData.name.trim()) {
        toast.error("Please enter your name");
        return false;
      }

      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Password and confirm password do not match");
        return false;
      }
    }

    return true;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      console.log("Attempting login:", { userType, email: formData.email });

      let response;

      if (userType === "buyer") {
        if (currentState === "Sign Up") {
          console.log("Registering buyer...");
          response = await axios.post(`${backendUrl}/api/user/register`, {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          });
        } else {
          console.log("Logging in buyer...");
          response = await axios.post(`${backendUrl}/api/user/login`, {
            email: formData.email,
            password: formData.password,
          });
        }

        console.log("Buyer response:", response.data);

        if (response.data.success) {
          if (response.data.user?._id) {
            localStorage.setItem("id", response.data.user._id);
          }

          if (response.data.token) {
            updateToken(response.data.token, "buyer");
          }

          toast.success(
            currentState === "Login"
              ? "Login successful"
              : "Account created successfully"
          );

          navigate("/");
        } else {
          toast.error(response.data.message || "Request failed");
        }
      } else {
        // Use Panel Login for Seller/Admin
        console.log("Attempting panel login for:", userType);
        response = await axios.post(`${backendUrl}/api/user/panel-login`, {
          email: formData.email.trim(),
          password: formData.password,
        });

        console.log("Panel login response:", response.data);

        if (response.data.success) {
          const token = response.data.token;
          const role = response.data.role;

          if (!token || !role) {
            toast.error("Invalid login response from server");
            return;
          }

          updateToken(token, role);

          toast.success(response.data.message || "Login Successful");

          if (role === "admin") {
            navigate("/admin-dashboard", { replace: true });
          } else if (role === "seller") {
            navigate("/seller-dashboard", { replace: true });
          }
        } else {
          toast.error(response.data.message || "Action failed");
        }
      }
    } catch (error) {
      console.error("Login error details:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        toast.error("Cannot connect to server. Please check if backend is running.");
      } else {
        toast.error(`Login failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const switchUserType = (type) => {
    setUserType(type);
    resetForm();
    if (type === "buyer") {
      setCurrentState("Login");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 bg-slate-50 overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{animationDelay: '4s'}}></div>
      
      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/40 overflow-hidden relative z-10">
        <div className="grid lg:grid-cols-2">
          {/* Left Panel */}
          <div className="hidden lg:flex flex-col justify-center relative overflow-hidden text-white p-14 bg-gray-900">
            {/* Dark glassmorphism background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-gray-900/90 z-0"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 z-0"></div>
            
            <div className="relative z-10 mb-8">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                {userType === "buyer" 
                  ? "Welcome to Our Store" 
                  : userType === "seller"
                  ? "Seller Dashboard"
                  : "Admin Panel"
                }
              </h1>
              <p className="text-lg text-blue-100 leading-8">
                {userType === "buyer" 
                  ? "Shop the latest products, track your orders, and enjoy a seamless shopping experience with our premium collection."
                  : userType === "seller"
                  ? "Manage your products, track sales, and grow your business with our powerful seller tools and analytics."
                  : "Manage the entire platform, monitor performance, and control all aspects of your ecommerce business with advanced tools."
                }
              </p>
            </div>
            
            {/* Backend Connection Info */}
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
              <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                Backend Connection
              </h3>
              <div className="space-y-2 text-sm text-blue-100">
                <p className="flex justify-between">
                  <span>Server:</span>
                  <span className="font-mono text-xs">{backendUrl}</span>
                </p>
                <p className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-green-300 font-medium">Connected to MongoDB</span>
                </p>
                <p className="text-center pt-2 text-xs text-blue-200">
                  {userType === "buyer" ? "Use your registered credentials" : "Using Panel Login"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="p-10 lg:p-14">
            {/* User Type Selector */}
            <div className="flex justify-center mb-10">
              <div className="bg-gray-100 rounded-2xl p-1.5 flex shadow-inner">
                <button
                  type="button"
                  onClick={() => switchUserType("buyer")}
                  className={`px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
                    userType === "buyer"
                      ? "bg-gray-900 text-white shadow-xl transform scale-105"
                      : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  👤 Buyer
                </button>
                <button
                  type="button"
                  onClick={() => switchUserType("seller")}
                  className={`px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
                    userType === "seller"
                      ? "bg-gray-900 text-white shadow-xl transform scale-105"
                      : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  🏪 Seller
                </button>
                <button
                  type="button"
                  onClick={() => switchUserType("admin")}
                  className={`px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
                    userType === "admin"
                      ? "bg-gray-900 text-white shadow-xl transform scale-105"
                      : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  ⚙️ Admin
                </button>
              </div>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                {currentState === "Login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-500 text-lg">
                {currentState === "Login" 
                  ? `Enter your credentials to access your ${userType} account`
                  : `Create a new ${userType} account to get started`
                }
              </p>
              {userType !== "buyer" && (
                <div className="inline-flex mt-4 items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <p className="text-sm text-blue-700 font-semibold">
                    Panel Login Enabled
                  </p>
                </div>
              )}
            </div>

            {/* Login/Signup Form */}
            <form onSubmit={onSubmitHandler} className="space-y-6">
              {currentState === "Sign Up" && userType === "buyer" && (
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onChangeHandler}
                    autoComplete="name"
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg placeholder-gray-400"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChangeHandler}
                  autoComplete="email"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg placeholder-gray-400"
                  placeholder="Enter your registered email"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={onChangeHandler}
                    autoComplete={userType === "buyer" && currentState === "Login" ? "current-password" : "new-password"}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg placeholder-gray-400 pr-14"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {currentState === "Sign Up" && userType === "buyer" && (
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={onChangeHandler}
                      autoComplete="new-password"
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg placeholder-gray-400 pr-14"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 mt-4"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </span>
                ) : currentState === "Login" ? "Sign In →" : "Create Account →"}
              </button>
            </form>

            {/* Toggle Login/Signup */}
            {userType === "buyer" && (
              <div className="mt-8 text-center">
                <p className="text-gray-500 font-medium text-lg">
                  {currentState === "Login" ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() => setCurrentState(currentState === "Login" ? "Sign Up" : "Login")}
                    className="ml-2 text-gray-900 font-bold hover:underline transition-all duration-300"
                  >
                    {currentState === "Login" ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>
            )}

            {userType === "seller" && currentState === "Login" && (
              <div className="mt-8 text-center">
                <p className="text-gray-500 font-medium text-lg">
                  Want to sell on our platform?
                  <button
                    type="button"
                    onClick={() => navigate("/seller-signup")}
                    className="ml-2 text-gray-900 font-bold hover:underline transition-all duration-300"
                  >
                    Apply Now
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalLogin;
