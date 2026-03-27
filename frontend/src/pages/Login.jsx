import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { updateToken } = useContext(ShopContext);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${backendUrl}/api/user/login`, formData);

      if (res.data.success) {
        updateToken(res.data.token, "buyer"); // ✅ FIX
        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Login failed");
    }
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <input name="email" onChange={(e)=>setFormData({...formData,email:e.target.value})}/>
      <input name="password" type="password" onChange={(e)=>setFormData({...formData,password:e.target.value})}/>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;