import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../constants";

const Orders = ({ role }) => {
  const adminToken = localStorage.getItem("adminToken");
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const url =
        role === "admin"
          ? `${backendUrl}/api/order/list`
          : `${backendUrl}/api/order/seller-list`;

      const response =
        role === "admin"
          ? await axios.post(
              url,
              {},
              {
                headers: {
                  Authorization: `Bearer ${adminToken}`,
                },
              }
            )
          : await axios.get(url, {
              headers: {
                Authorization: `Bearer ${adminToken}`,
              },
            });

      if (response.data.success) {
        setOrders((response.data.orders || []).reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        toast.error("Cannot connect to server. Please check if backend is running.");
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const url =
        role === "admin"
          ? `${backendUrl}/api/order/status`
          : `${backendUrl}/api/order/seller-status`;

      const response = await axios.post(
        url,
        { orderId, status },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Order Updated");
        fetchOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-500">Track and manage customer orders</p>
      </div>

      <div className="flex flex-col gap-5">
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center shadow-sm border border-gray-100 text-gray-500">
            No orders found.
          </div>
        ) : (
          orders.map((order) => {
            const totalQuantity = order.items.reduce(
              (acc, item) => acc + item.quantity,
              0
            );

            return (
              <div
                key={order._id}
                className="grid xl:grid-cols-3 gap-6 border border-gray-100 p-6 rounded-2xl shadow-sm bg-white"
              >
                <div className="flex flex-col gap-4">
                  <h3 className="font-semibold text-lg text-gray-800">Products</h3>

                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-4 items-center border-b pb-3 last:border-0"
                    >
                      <img
                        src={Array.isArray(item.image) ? item.image[0] : item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />

                      <div className="text-sm">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-gray-500">Size: {item.size}</p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-gray-500">
                          Price: {currency}
                          {item.price}
                        </p>
                      </div>
                    </div>
                  ))}

                  <p className="font-medium text-gray-700">
                    Total Items: {totalQuantity}
                  </p>
                </div>

                <div className="flex flex-col gap-2 text-sm">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Customer Details
                  </h3>

                  <p className="font-medium text-gray-800">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="text-gray-600">{order.address.city}</p>
                  <p className="text-gray-600">{order.address.phone}</p>

                  <div className="mt-4 space-y-1">
                    <p>
                      <span className="font-medium">Payment Method:</span>{" "}
                      {order.paymentMethod}
                    </p>

                    <p>
                      <span className="font-medium">Payment Status:</span>{" "}
                      {order.payment ? "Paid" : "Pending"}
                    </p>

                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(order.date).toLocaleDateString()}
                    </p>

                    <p className="font-semibold mt-2 text-gray-800">
                      Total: {currency}
                      {order.amount}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Order Status
                  </h3>

                  <select
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    value={order.status}
                    className="border p-3 rounded-xl w-full bg-white"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;