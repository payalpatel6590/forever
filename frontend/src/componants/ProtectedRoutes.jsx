import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.jsx";

const ProtectedRoutes = ({ children }) => {
  const { token } = useContext(ShopContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoutes;