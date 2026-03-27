import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext.jsx";
import { useNavigate } from "react-router-dom";

const CurrentOrder = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  const fetchLastOrder = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/order/last`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setOrder(res.data.order);
      } else {
        setOrder(null);
      }
    } catch (err) {
      console.error(
        "Fetch last order error:",
        err.response?.data || err.message,
      );
    }
  };

  useEffect(() => {
    if (token) {
      fetchLastOrder();
    }
  }, [token]);

  return (
    <div className="p-6 min-h-[60vh] max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">My Current Order</h2>

      {!order ? (
        <p className="text-center text-gray-500">No orders found</p>
      ) : (
        order.items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center gap-6 border rounded-xl p-5 mb-6 shadow-sm hover:shadow-md transition"
          >
            {/* Product Image */}

            <div className="w-28 h-28 flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Product Details */}

            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm text-gray-500">
                Order ID: <span className="font-medium">{order._id}</span>
              </p>

              <p className="text-xl font-semibold">{item.name}</p>

              <div className="flex flex-wrap gap-6 text-gray-600 text-sm">
                <p>
                  <span className="font-medium">Price:</span> ${item.price}
                </p>

                <p>
                  <span className="font-medium">Quantity:</span> {item.quantity}
                </p>
              </div>

              {/* Status */}

              <div className="flex items-center justify-between mt-2">
                <p className="text-sm">
                  Status:{" "}
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium text-xs">
                    {order.status || "Pending"}
                  </span>
                </p>

                {/* Track Button */}

                <button
                  onClick={() => navigate(`/track-order/${order._id}`)}
                  className="bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                >
                  Track Order
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CurrentOrder;
