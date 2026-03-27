import React, { useContext, useState } from "react";
import Title from "../componants/Title";
import CartTotal from "../componants/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const initialFormState = {
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  };

  const [method, setMethod] = useState("cod");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const {
    backendUrl,
    token,
    cartItems,
    setCartItems,
    products,
    getCartAmount,
    delivery_fee,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const normalizePromoCode = (code = "") => {
    return String(code).replace(/\s+/g, "").trim().toUpperCase();
  };

  const applyPromo = async () => {
    const cleanPromoCode = normalizePromoCode(promoCode);
    if (!cleanPromoCode) {
      toast.error("Please enter promo code");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/promo/validate`,
        {
          code: cleanPromoCode,
          amount: Number(getCartAmount()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("PROMO API RESPONSE:", response.data);

      if (response.data.success) {
        setDiscount(response.data.discount);
        setPromoCode(cleanPromoCode);
        toast.success(response.data.message || "Promo code applied");
      } else {
        setDiscount(0);
        toast.error(response.data.message || "Invalid coupon");
      }
    } catch (error) {
      console.error("PROMO API ERROR:", error);
      console.error("PROMO API ERROR RESPONSE:", error.response?.data);
      setDiscount(0);
      toast.error(error.response?.data?.message || "Promo validation failed");
    }
  };

const onSubmitHandler = async (e) => {
  e.preventDefault();

  if (!token) {
    toast.error("Please login to place an order");
    return;
  }

  try {
    let orderItems = [];

    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        const quantity = cartItems[productId][size];

        if (quantity > 0) {
          const product = products.find((p) => p._id === productId);
          if (!product) continue;

          orderItems.push({
            ...structuredClone(product),
            size,
            quantity,
            image: Array.isArray(product.image)
              ? product.image[0]
              : product.image,
          });
        }
      }
    }

    if (orderItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const orderPayload = {
      items: orderItems,
      amount: Math.max(0, getCartAmount() + delivery_fee - discount),
      address: {
        ...formData,
        phone: String(formData.phone),
        zipCode: String(formData.zipCode),
      },
      paymentMethod: method,
      promoCode,
      discount,
    };

    // ✅ COD FLOW
    if (method === "cod") {
      const response = await axios.post(
        `${backendUrl}/api/order/place`,
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Order placed successfully 🎉");

        setCartItems({});
        setFormData(initialFormState);
        setPromoCode("");
        setDiscount(0);

        navigate("/current-order");
      } else {
        toast.error(response.data.message || "Order failed");
      }
    }

    // ✅ STRIPE (CUSTOM UI FLOW)
    if (method === "stripe") {
      localStorage.setItem("pendingOrder", JSON.stringify(orderPayload));
      navigate("/payment");
      return; // 🚨 STOP HERE
    }

  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Server error occurred");
  }
};

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      <div className="flex flex-col gap-4 sm:max-w[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1="DELIVERY" text2="INFORMATION" />
        </div>

        <div className="flex gap-3">
          <input
            required
            name="firstName"
            value={formData.firstName}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="First name" />
          <input
            required
            name="lastName"
            value={formData.lastName}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="Last name" />
        </div>

        <input
          required
          name="email"
          type="email"
          value={formData.email}
          onChange={onChangeHandler}
          className="border rounded py-1.5 px-3.5 w-full"
          placeholder="Email" />

        <input
          required
          name="street"
          value={formData.street}
          onChange={onChangeHandler}
          className="border rounded py-1.5 px-3.5 w-full"
          placeholder="Street" />

        <div className="flex gap-3">
          <input
            required
            name="city"
            value={formData.city}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="City" />
          <input
            required
            name="state"
            value={formData.state}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="State" />
        </div>

        <div className="flex gap-3">
          <input
            required
            name="zipCode"
            value={formData.zipCode}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="Pincode" />
          <input
            required
            name="country"
            value={formData.country}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="Country" />
        </div>

        <input
          required
          name="phone"
          value={formData.phone}
          onChange={onChangeHandler}
          className="border rounded py-1.5 px-3.5 w-full"
          placeholder="Phone Number"/>
      </div>

      <div className="mt-8 min-w-80">
        <CartTotal discount={discount} />

        <div className="mt-4">
          <input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Promo Code"
            className="border px-3 py-2 w-full"/>

          <button
            type="button"
            onClick={applyPromo}
            disabled={discount !== 0}
            className={`mt-2 px-4 py-2 w-full text-white ${discount > 0 ? "bg-gray-400" : "bg-gray-800"
              }`}>
            {discount > 0 ? "PROMO APPLIED" : "APPLY PROMO"}
          </button>

          {discount > 0 && (
            <p className="text-green-600 mt-2">
              Discount Applied: -${discount}
            </p>
          )}
        </div>

        <div className="mt-12">
          <Title text1="PAYMENT" text2="METHOD" />

          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <span
                className={`h-3.5 w-3.5 rounded-full border ${method === "stripe" && "bg-green-400"
                  }`}
              />
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="Stripe" />
            </div>

            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <span
                className={`h-3.5 w-3.5 rounded-full border ${method === "cod" && "bg-green-400"
                  }`}
              />
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="text-end mt-8">
            <button
              type="submit"
              className="bg-black cursor-pointer text-white px-16 py-3 text-sm"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;