import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext.jsx";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const savedToken = token || localStorage.getItem("token");

      if (!savedToken) {
        setOrders([]);
        setErrorMsg("Please login first");
        return;
      }

      const response = await axios.get(
        `${backendUrl}/api/order/user-orders`,
        {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        setOrders([]);
        setErrorMsg(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.log("Fetch orders error:", error.response?.data || error.message);

      if (error.response?.status === 404) {
        setErrorMsg("Orders API route not found on backend");
      } else if (error.response?.status === 401) {
        setErrorMsg("Unauthorized. Please login again.");
      } else {
        setErrorMsg("Something went wrong while fetching orders");
      }

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token || localStorage.getItem("token")) {
      fetchOrders();
    } else {
      setLoading(false);
      setOrders([]);
    }
  }, [token]);

  return (
    <div className="p-6 min-h-[60vh] max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">My Orders</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : errorMsg ? (
        <p className="text-center text-red-500">{errorMsg}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders yet</p>
      ) : (
        orders.map((order) =>
          (order.items || []).map((item, index) => (
            <div
              key={`${order._id}-${index}`}
              className="flex flex-col md:flex-row items-center gap-6 border rounded-xl p-5 mb-6 shadow-sm hover:shadow-md transition"
            >
              <div className="w-28 h-28 shrink-0">
                <img
                  src={
                    Array.isArray(item.image)
                      ? item.image[0]
                      : item.image || "/no-image.png"
                  }
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

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

                  {item.size && (
                    <p>
                      <span className="font-medium">Size:</span> {item.size}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm">
                    Status:{" "}
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium text-xs">
                      {order.status || "Pending"}
                    </span>
                  </p>

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
        )
      )}
    </div>
  );
};

export default MyOrders;