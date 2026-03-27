import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  ClipboardList,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";

import { backendUrl } from "../constants";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("sellerToken") || localStorage.getItem("adminToken");

  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState("12m"); // "1m" | "12m"

  const [rawData, setRawData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    todayOrders: 0,
    topProducts: [],
    lowStock: [],
    chart: [],
    orders: [],
  });

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${backendUrl}/api/seller/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setRawData({
          totalProducts: res.data.totalProducts || 0,
          totalOrders: res.data.totalOrders || 0,
          revenue: res.data.revenue || 0,
          todayOrders: res.data.todayOrders || 0,
          topProducts: res.data.topProducts || [],
          lowStock: res.data.lowStock || [],
          chart: res.data.chart || [],
          orders: res.data.orders || [],
        });
      }
    } catch (error) {
      console.log("Seller dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboard();
    }
  }, [token]);

  const dashboardData = useMemo(() => {
    const now = new Date();
    const today = new Date();

    const hasOrdersArray =
      Array.isArray(rawData.orders) && rawData.orders.length > 0;

    if (!hasOrdersArray) {
      return {
        totalProducts: rawData.totalProducts,
        totalOrders: rawData.totalOrders,
        revenue: rawData.revenue,
        todayOrders: rawData.todayOrders,
        topProducts: rawData.topProducts,
        lowStock: rawData.lowStock,
        chart: rawData.chart,
      };
    }

    const filteredOrders = rawData.orders.filter((order) => {
      if (!order.date) return false;

      const orderDate = new Date(order.date);

      if (selectedRange === "1m") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(now.getDate() - 30);
        return orderDate >= oneMonthAgo && orderDate <= now;
      }

      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(now.getMonth() - 11);
      twelveMonthsAgo.setDate(1);
      return orderDate >= twelveMonthsAgo && orderDate <= now;
    });

    const totalOrders = filteredOrders.length;

    const revenue = filteredOrders.reduce((sum, order) => {
      return sum + Number(order.amount || 0);
    }, 0);

    const todayOrders = filteredOrders.filter((order) => {
      const orderDate = new Date(order.date);
      return (
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    }).length;

    const productSalesMap = {};

    filteredOrders.forEach((order) => {
      order.items?.forEach((item) => {
        const productName = item.name || "Unknown Product";

        if (!productSalesMap[productName]) {
          productSalesMap[productName] = {
            _id: item.productId || productName,
            name: productName,
            sales: 0,
            revenue: 0,
            image: Array.isArray(item.image) ? item.image[0] : item.image,
          };
        }

        productSalesMap[productName].sales += Number(item.quantity || 0);
        productSalesMap[productName].revenue +=
          Number(item.price || 0) * Number(item.quantity || 0);
      });
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    let chart = [];

    if (selectedRange === "1m") {
      const dailyMap = {};

      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);

        const key = d.toISOString().split("T")[0];
        const label = d.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
        });

        dailyMap[key] = {
          key,
          month: label,
          sales: 0,
        };
      }

      filteredOrders.forEach((order) => {
        const orderDate = new Date(order.date);
        const key = orderDate.toISOString().split("T")[0];

        if (dailyMap[key]) {
          dailyMap[key].sales += Number(order.amount || 0);
        }
      });

      chart = Object.values(dailyMap);
    } else {
      const monthlyMap = {};

      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const label = d.toLocaleDateString("en-US", { month: "short" });

        monthlyMap[key] = {
          key,
          month: label,
          sales: 0,
        };
      }

      filteredOrders.forEach((order) => {
        const d = new Date(order.date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;

        if (monthlyMap[key]) {
          monthlyMap[key].sales += Number(order.amount || 0);
        }
      });

      chart = Object.values(monthlyMap);
    }

    return {
      totalProducts: rawData.totalProducts,
      totalOrders,
      revenue,
      todayOrders,
      topProducts,
      lowStock: rawData.lowStock,
      chart,
    };
  }, [rawData, selectedRange]);

  const stats = [
    {
      title: "Revenue",
      value: `$${dashboardData.revenue}`,
      icon: <DollarSign size={20} />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Orders",
      value: dashboardData.totalOrders,
      icon: <ShoppingCart size={20} />,
      color: "bg-orange-100 text-orange-700",
    },
    {
      title: "Products",
      value: dashboardData.totalProducts,
      icon: <Package size={20} />,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Today Orders",
      value: dashboardData.todayOrders,
      icon: <TrendingUp size={20} />,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  if (loading) {
    return (
      <div className="grid place-items-center min-h-[60vh]">
        <div className="text-lg font-semibold text-gray-600">
          Loading seller dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back. Here is your sales overview.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <h2 className="text-2xl font-bold text-gray-800 mt-2">
                  {item.value}
                </h2>
              </div>
              <div className={`p-3 rounded-xl ${item.color}`}>{item.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Sales Analytics
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedRange === "1m"
                  ? "Last 30 days sales performance"
                  : "Last 12 months sales performance"}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setSelectedRange("1m")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedRange === "1m"
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-600 hover:bg-white"
                  }`}
                >
                  1 Month
                </button>

                <button
                  onClick={() => setSelectedRange("12m")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedRange === "12m"
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-600 hover:bg-white"
                  }`}
                >
                  12 Months
                </button>
              </div>

              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                {selectedRange === "1m" ? "1 Month View" : "12 Months View"}
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={dashboardData.chart}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "#10b981" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            Quick Actions
          </h2>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/add")}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-left"
            >
              <Package className="text-blue-600" size={18} />
              <span className="font-medium text-gray-700">Add New Product</span>
            </button>

            <button
              onClick={() => navigate("/order")}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-left"
            >
              <ClipboardList className="text-orange-600" size={18} />
              <span className="font-medium text-gray-700">Manage Orders</span>
            </button>

            <button
              onClick={() => navigate("/list")}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-left"
            >
              <Users className="text-purple-600" size={18} />
              <span className="font-medium text-gray-700">View Products</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Top Selling Products
            </h2>
            <span className="text-sm text-gray-500">
              {selectedRange === "1m" ? "Last 30 Days" : "Last 12 Months"}
            </span>
          </div>

          {dashboardData.topProducts?.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.topProducts.map((p, index) => (
                <div
                  key={p._id || index}
                  className="flex items-center justify-between gap-4 border-b pb-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={Array.isArray(p.image) ? p.image[0] : p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-lg object-cover border"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{p.name}</p>
                      <p className="text-sm text-gray-500">
                        {p.sales || 0} units sold
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold text-gray-700">
                    ${p.revenue ?? p.price ?? 0}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No top products found</p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-500" size={18} />
            <h2 className="text-lg font-semibold text-gray-800">
              Low Stock Alert
            </h2>
          </div>

          {dashboardData.lowStock?.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.lowStock.map((p, index) => (
                <div
                  key={p._id || index}
                  className="flex items-center gap-4 rounded-xl border border-red-100 bg-red-50 p-3"
                >
                  <img
                    src={Array.isArray(p.image) ? p.image[0] : p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded-lg object-cover border"
                  />

                  <div>
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-sm text-red-500">Stock: {p.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No low stock products</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;