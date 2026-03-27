import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext.jsx";

const TrackOrder = () => {
  const { orderId } = useParams();
  const { backendUrl, token } = useContext(ShopContext);

  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/order/user-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.success) {
        const foundOrder = res.data.orders?.find(o => o._id === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrder();

    const interval = setInterval(() => {
      fetchOrder();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!order) return <p className="p-6">Loading...</p>;

  const steps = [
    { label: "Order Placed", icon: "📦" },
    { label: "Packing", icon: "⚙️" },
    { label: "Shipped", icon: "🚚" },
    { label: "Out for Delivery", icon: "📍" },
    { label: "Delivered", icon: "✅" },
  ];

  const currentStepIndex = steps.findIndex(
    (step) => step.label.toLowerCase() === (order.status || "").toLowerCase(),
  );

  return (
    <div className="p-2 min-h-[60vh] max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Track Your Order</h2>

      {order.items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row gap-8 border p-6 rounded-lg shadow mb-6"
        >
          {/* PRODUCT */}
          <div className="flex items-center gap-2 w-full sm:w-1/2">
            <img
              src={item.image}
              alt={item.name}
              className="w-28 h-28 object-cover rounded-lg"
            />

            <div>
              <p className="text-xl font-semibold">{item.name}</p>
              <p className="text-gray-600">Price: ${item.price}</p>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
            </div>
          </div>

          {/* DETAILS */}
          <div className="w-full sm:w-1/2">
            <p className="mb-2">
              <b>Order ID:</b> {order._id}
            </p>

            <p className="mb-6">
              <b>Status:</b>
              <span className="text-green-600 font-semibold ml-2">
                {order.status || "Pending"}
              </span>
            </p>

            {/* TRACKER */}

            <div className="flex items-center mt-6">
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={idx} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl
                        ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isCurrent
                              ? "bg-yellow-400 text-white"
                              : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {step.icon}
                      </div>

                      <span
                        className={`text-xs mt-2 text-center
                        ${
                          isCompleted
                            ? "font-semibold text-black"
                            : isCurrent
                              ? "font-semibold text-yellow-600"
                              : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {idx !== steps.length - 1 && (
                      <div
                        className={`w-16 h-1 mx-1 rounded-full
                        ${
                          idx < currentStepIndex
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackOrder;
