import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import Title from "../componants/Title";
import { assets } from "../assets/assets";

const Orders = () => {
  const { token, orders, fetchUserOrders, loading } = useContext(ShopContext);

  useEffect(() => {
    if (token) {
      fetchUserOrders();
    }
  }, [token, fetchUserOrders]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'placed':
        return 'text-blue-600 bg-blue-100';
      case 'confirmed':
        return 'text-yellow-600 bg-yellow-100';
      case 'preparation':
        return 'text-orange-600 bg-orange-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-32 h-32 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <span className="text-4xl">📦</span>
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Orders Yet</h3>
          <p className="text-gray-500 text-center max-w-md">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <button
            onClick={() => window.location.href = "/collection"}
            className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={order._id || index} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4 pb-4 border-b">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order #{order._id ? order._id.slice(-8) : `ORD${index + 1}`}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(order.date)}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <p className="text-lg font-bold text-gray-800 mt-2">
                    ${order.amount?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items && order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image || assets.placeholder_image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        Size: {item.size || 'N/A'} | Quantity: {item.quantity || 1}
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        ${item.price?.toFixed(2) || '0.00'} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              {order.address && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Shipping Address</h4>
                  <p className="text-sm text-gray-600">
                    {order.address.firstName && order.address.lastName 
                      ? `${order.address.firstName} ${order.address.lastName}` 
                      : order.address.name || 'N/A'
                    }
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.address.street || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.address.city && order.address.state && order.address.zipCode
                      ? `${order.address.city}, ${order.address.state} ${order.address.zipCode}`
                      : 'N/A'
                    }
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.address.country || 'N/A'}
                  </p>
                  {order.address.phone && (
                    <p className="text-sm text-gray-600">
                      Phone: {order.address.phone}
                    </p>
                  )}
                </div>
              )}

              {/* Payment Method */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium text-gray-800 capitalize">
                    {order.paymentMethod || 'N/A'}
                  </p>
                </div>
                {order.payment && (
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600">
                      Paid
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
