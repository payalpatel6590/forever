// import axios from "axios";
// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// const SellerSignup = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const onChangeHandler = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       return toast.error("Passwords do not match");
//     }

//     try {
//       setLoading(true);

//       const response = await axios.post(`${backendUrl}/api/user/seller-signup`, {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//       });

//       if (response.data.success) {
//         toast.success(response.data.message || "Seller account created successfully");
//         navigate("/login");
//       } else {
//         toast.error(response.data.message || "Signup failed");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <form
//         onSubmit={onSubmitHandler}
//         className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold mb-2 text-gray-800">Seller Sign Up</h2>
//         <p className="text-gray-500 mb-6">Create your seller account</p>

//         <input
//           type="text"
//           name="name"
//           placeholder="Full name"
//           value={formData.name}
//           onChange={onChangeHandler}
//           className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-black"
//           required
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={onChangeHandler}
//           className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-black"
//           required
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={onChangeHandler}
//           className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-black"
//           required
//         />

//         <input
//           type="password"
//           name="confirmPassword"
//           placeholder="Confirm password"
//           value={formData.confirmPassword}
//           onChange={onChangeHandler}
//           className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 outline-none focus:ring-2 focus:ring-black"
//           required
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-70"
//         >
//           {loading ? "Creating..." : "Create Seller Account"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SellerSignup;





import axios from "axios";
import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const SellerSignup = () => {
  const { updateToken } = useContext(ShopContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const response = await axios.post(`${backendUrl}/api/user/seller-signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        const token = response.data.token;
        const role = response.data.role;

        if (!token || role !== "seller") {
          return toast.error("Invalid signup response from server");
        }

        updateToken(token, role);

        toast.success(
          response.data.message || "Seller account created successfully"
        );

        navigate("/seller-dashboard", { replace: true });
      } else {
        toast.error(response.data.message || "Signup failed");
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
        onSubmit={onSubmitHandler}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Seller Sign Up</h2>
        <p className="text-gray-500 mb-6">Create your seller account</p>

        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={formData.name}
          onChange={onChangeHandler}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-black"
          required
        />

        <input
          type="number"
          name="number"
          placeholder="Phone number"
          value={formData.number}
          onChange={onChangeHandler}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-black"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={onChangeHandler}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-black"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChangeHandler}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-black"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
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
          {loading ? "Creating..." : "Create Seller Account"}
        </button>
      </form>
    </div>
  );
};

export default SellerSignup;