import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AdminDashboard = () => {
  const { backendUrl, token, role } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && role === "admin") {
      fetchAdminData();
    }
  }, [token, role]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const productsRes = await axios.post(`${backendUrl}/api/product/admin-list`, {}, { headers: { Authorization: `Bearer ${token}` } });
      const ordersRes = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { Authorization: `Bearer ${token}` } });
      const usersRes = await axios.post(`${backendUrl}/api/user/list`, {}, { headers: { Authorization: `Bearer ${token}` } });

      if (productsRes.data.success) setProducts(productsRes.data.products || []);

      if (ordersRes.data.success) {
        const allOrders = ordersRes.data.orders || [];
        setOrders(allOrders);
        
        const totalRevenue = allOrders.reduce((sum, order) => {
          if (order.status !== 'cancelled') return sum + (order.amount || 0);
          return sum;
        }, 0);

        const pendingOrders = allOrders.filter(order => 
          order.status === 'placed' || order.status === 'confirmed'
        ).length;

        setStats(prev => ({
          ...prev,
          totalProducts: productsRes.data?.products?.length || 0,
          totalOrders: allOrders.length,
          totalRevenue,
          pendingOrders
        }));

        const last30Days = [];
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          const dayOrders = allOrders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === dateStr;
          });
          
          const dayRevenue = dayOrders.reduce((sum, order) => {
            if (order.status !== 'cancelled') return sum + (order.amount || 0);
            return sum;
          }, 0);
          
          last30Days.push({ date: dateStr, revenue: dayRevenue, orders: dayOrders.length });
        }
        setSalesData(last30Days);
      }

      if (usersRes.data.success) {
        setUsers(usersRes.data.users || []);
        setStats(prev => ({ ...prev, totalUsers: usersRes.data.users?.length || 0 }));
      }
    } catch (error) {
      console.error("Admin dashboard error:", error);
    } finally {
      setLoading(false);
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
        fetchAdminData();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Update status error:", error);
      alert("Failed to update status");
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
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-indigo-500/10 blur-[120px] rounded-full point-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[120%] bg-fuchsia-500/10 blur-[100px] rounded-full point-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Platform Overview</h1>
            <p className="text-indigo-200">System-wide order volume, users, and overall growth metrics.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.href = '/add-product'}
              className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white transition-all duration-300 bg-indigo-600 rounded-2xl hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
              <span className="relative flex items-center gap-2">🛒 Add Product</span>
            </button>
            <button
              onClick={() => window.location.href = '/list-users'}
              className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white transition-all duration-300 bg-fuchsia-600 rounded-2xl hover:bg-fuchsia-500 hover:shadow-[0_0_20px_rgba(192,38,211,0.4)] overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-fuchsia-400 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
              <span className="relative flex items-center gap-2">👥 Manage Users</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-10 -mt-10 relative z-20">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Total Products" value={stats.totalProducts} icon="📦" gradient="from-blue-500 to-cyan-400" />
          <StatCard title="Total Orders" value={stats.totalOrders} icon="🛍️" gradient="from-emerald-500 to-teal-400" />
          <StatCard title="Total Users" value={stats.totalUsers} icon="👥" gradient="from-rose-500 to-orange-400" />
          <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon="💵" gradient="from-purple-500 to-indigo-400" />
          <StatCard title="Pending" value={stats.pendingOrders} icon="⏱️" gradient="from-slate-600 to-slate-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sales Chart */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Global Revenue Analytics</h3>
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

          {/* Recent Users */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Recent Users</h3>
              <a href="/list-users" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">View All</a>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 max-h-[320px]">
              {users.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-2xl">👥</div>
                  <p className="text-slate-500 text-sm">No users registered.</p>
                </div>
              ) : (
                users.slice(0, 5).map(user => (
                  <div key={user._id} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div>
                      <h4 className="text-slate-800 font-semibold text-sm truncate">{user.name || 'Unknown'}</h4>
                      <p className="text-slate-500 text-xs">{user.email}</p>
                    </div>
                    <div>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-red-100 text-red-600' :
                        user.role === 'seller' ? 'bg-indigo-100 text-indigo-600' :
                        'bg-emerald-100 text-emerald-600'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="lg:col-span-12 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">System Transactions & Fulfillment</h3>
              <a href="/order" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">Manage All</a>
            </div>
            
            {orders.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                <p className="text-slate-500 font-medium">No system orders received yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto pb-4">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="pb-4 font-semibold pl-2">Order ID</th>
                      <th className="pb-4 font-semibold">Date</th>
                      <th className="pb-4 font-semibold text-right pr-4">Amount</th>
                      <th className="pb-4 font-semibold text-center">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map(order => (
                      <tr key={order._id} className="border-b last:border-0 border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 text-sm font-medium text-slate-700 pl-2">
                          #{order._id.slice(-8)}
                          <div className="text-xs text-slate-400 font-normal mt-0.5">{order.items?.length || 0} items</div>
                        </td>
                        <td className="py-4 text-sm text-slate-500 whitespace-nowrap">
                          {formatDate(order.date)}
                        </td>
                        <td className="py-4 text-sm font-bold text-slate-700 text-right pr-4">
                          ${order.amount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="py-4 text-center">
                          <select
                            value={order.status || ''}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold outline-none border cursor-pointer appearance-none text-center ${getStatusColor(order.status)}`}
                          >
                            <option value="placed">Placed</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparation">Preparation</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
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

const StatCard = ({ title, value, icon, gradient }) => (
  <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500`}></div>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1.5">{title}</p>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{value}</h3>
      </div>
      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-lg shadow-lg relative z-10 flex-shrink-0`}>
        {icon}
      </div>
    </div>
  </div>
);

export default AdminDashboard;
