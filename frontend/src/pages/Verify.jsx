import React, { useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { setCartItems } = useContext(ShopContext);

  useEffect(() => {
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    if (success === "true") {
      toast.success("Payment successful 🎉");
      setCartItems({});
      navigate("/current-order");
    } else {
      toast.error("Payment failed ❌");
      navigate("/cart");
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-[60vh] text-xl">
      Verifying Payment...
    </div>
  );
};

export default Verify;