import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { toast } from 'react-toastify';

const SellerDashboard = () => {
  const { backendUrl, token, role } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && role === "seller") {
      fetchSellerData();
    }
  }, [token, role]);

  const fetchSellerData = async () => {
    setLoading(true);
    try {
      console.log("Fetching seller data...");
      
      // Fetch seller products
      const productsRes = await axios.get(
        `${backendUrl}/api/product/seller-list`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Products response:", productsRes.data);

      // Fetch seller orders
      const ordersRes = await axios.get(
        `${backendUrl}/api/order/seller-list`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Orders response:", ordersRes.data);

      if (productsRes.data.success) {
        setProducts(productsRes.data.products || []);
        console.log("Products set:", productsRes.data.products || []);
      } else {
        console.error("Products fetch failed:", productsRes.data.message);
      }

      if (ordersRes.data.success) {
        const sellerOrders = ordersRes.data.orders || [];
        setOrders(sellerOrders);
        console.log("Orders set:", sellerOrders);
        
        const totalRevenue = sellerOrders.reduce((sum, order) => {
          if (order.status === 'delivered') return sum + (order.amount || 0);
          return sum;
        }, 0);

        const pendingOrders = sellerOrders.filter(order => 
          order.status === 'placed' || order.status === 'confirmed'
        ).length;

        setStats({
          totalProducts: productsRes.data.products?.length || 0,
          totalOrders: sellerOrders.length,
          totalRevenue,
          pendingOrders
        });

        const last30Days = [];
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          const dayOrders = sellerOrders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === dateStr;
          });
          
          const dayRevenue = dayOrders.reduce((sum, order) => {
            if (order.status === 'delivered') return sum + (order.amount || 0);
            return sum;
          }, 0);
          
          last30Days.push({
            date: dateStr,
            revenue: dayRevenue,
            orders: dayOrders.length
          });
        }
        setSalesData(last30Days);
      }
    } catch (error) {
      console.error("Error fetching seller data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to create test product
  const createTestProduct = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/create-test`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success("Test product created successfully! 🎉");
        // Refresh the data
        fetchSellerData();
      } else {
        toast.error(response.data.message || "Failed to create test product");
      }
    } catch (error) {
      console.error("Error creating test product:", error);
      toast.error("Failed to create test product");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'placed': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'confirmed': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'preparation': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
      case 'shipped': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
      case 'delivered': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
      case 'cancelled': return 'text-red-400 border-red-400/30 bg-red-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen pb-12">
      <div className="bg-slate-900 text-white pt-10 pb-20 px-6 sm:px-10 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-indigo-500/10 blur-[120px] rounded-full point-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[120%] bg-fuchsia-500/10 blur-[100px] rounded-full point-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Seller Overview</h1>
            <p className="text-indigo-200">Manage products, track performance, and grow your sales.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={createTestProduct}
              className="group relative inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 bg-green-600 rounded-2xl hover:bg-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
              <span className="relative flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                Create Test Product
              </span>
            </button>
            <button
              onClick={() => window.location.href = '/add-product'}
              className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 bg-indigo-600 rounded-2xl hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
              <span className="relative flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Add New Product
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-10 -mt-10 relative z-20">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Products" value={stats.totalProducts} icon="📦" gradient="from-blue-500 to-cyan-400" />
          <StatCard title="Total Orders" value={stats.totalOrders} icon="🛍️" gradient="from-emerald-500 to-teal-400" />
          <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon="💵" gradient="from-purple-500 to-indigo-400" />
          <StatCard title="Pending Orders" value={stats.pendingOrders} icon="⏳" gradient="from-orange-500 to-amber-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sales Chart */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Revenue Analytics</h3>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">Last 30 Days</span>
            </div>
            {salesData.length > 0 ? (
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      formatter={(value) => [`$${value?.toFixed(2) || '0.00'}`, `Revenue`]}
                      labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[320px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl">
                <p className="text-slate-500 font-medium">No sales data available yet</p>
              </div>
            )}
          </div>

          {/* Recent Products */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Your Products</h3>
              <a href="/collection" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">View All</a>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 max-h-[320px]">
              {products.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-2xl">👕</div>
                  <p className="text-slate-500 text-sm">Your catalog is empty.</p>
                </div>
              ) : (
                products.slice(0, 6).map(product => (
                  <div key={product._id} className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      {product.image && product.image[0] ? (
                        <img src={product.image[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">✨</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-slate-800 font-semibold text-sm truncate">{product.name}</h4>
                      <p className="text-slate-500 text-xs capitalize">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-indigo-600 font-bold text-sm">${product.price?.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Orders - Full Width */}
          <div className="lg:col-span-12 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Recent Transactions</h3>
            </div>
            
            {orders.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                <p className="text-slate-500 font-medium">No orders received yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="pb-4 font-semibold">Order ID</th>
                      <th className="pb-4 font-semibold">Date</th>
                      <th className="pb-4 font-semibold">Items</th>
                      <th className="pb-4 font-semibold text-right">Amount</th>
                      <th className="pb-4 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 6).map(order => (
                      <tr key={order._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 text-sm font-medium text-slate-700">
                          #{order._id.slice(-8)}
                        </td>
                        <td className="py-4 text-sm text-slate-500">
                          {formatDate(order.date)}
                        </td>
                        <td className="py-4 text-sm text-slate-500">
                          {order.items?.length || 0} items
                        </td>
                        <td className="py-4 text-sm font-bold text-slate-700 text-right">
                          ${order.amount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="py-4 text-right">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                            {order.status || 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

// Extracted Subcomponent for cleaner code
const StatCard = ({ title, value, icon, gradient }) => (
  <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500`}></div>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-semibold mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl shadow-lg relative z-10`}>
        {icon}
      </div>
    </div>
  </div>
);

export default SellerDashboard;
