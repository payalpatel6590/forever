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
      const res = await axios.get(`${backendUrl}/api/order/user-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const foundOrder = res.data.orders?.find(
          (o) => o._id === orderId
        );
        if (foundOrder) setOrder(foundOrder);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!order) return <p className="p-4 sm:p-6">Loading...</p>;

  const steps = [
    { label: "Order Placed", icon: "📦" },
    { label: "Packing", icon: "⚙️" },
    { label: "Shipped", icon: "🚚" },
    { label: "Out for Delivery", icon: "📍" },
    { label: "Delivered", icon: "✅" },
  ];

  const currentStepIndex = steps.findIndex(
    (step) =>
      step.label.toLowerCase() === (order.status || "").toLowerCase()
  );

  return (
    <div className="p-3 sm:p-6 min-h-[60vh] max-w-6xl mx-auto">
      <h2 className="text-xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
        Track Your Order
      </h2>

      {order.items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col gap-6 border p-4 sm:p-6 rounded-lg shadow mb-6"
        >
          {/* PRODUCT */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div className="flex items-center gap-3 w-full sm:w-1/2">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-lg"
              />

              <div>
                <p className="text-base sm:text-xl font-semibold">
                  {item.name}
                </p>
                <p className="text-sm text-gray-600">
                  Price: ${item.price}
                </p>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>

            {/* DETAILS */}
            <div className="w-full sm:w-1/2">
              <p className="text-sm sm:text-base mb-2">
                <b>Order ID:</b> {order._id}
              </p>

              <p className="text-sm sm:text-base mb-4">
                <b>Status:</b>
                <span className="text-green-600 font-semibold ml-2">
                  {order.status || "Pending"}
                </span>
              </p>
            </div>
          </div>

          {/* TRACKER */}
          <div className="overflow-x-auto">
            <div className="flex items-center min-w-[500px]">
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={idx} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-lg sm:text-2xl
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
                        className={`text-[10px] sm:text-xs mt-2 text-center
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
                        className={`w-10 sm:w-16 h-1 mx-1 rounded-full
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