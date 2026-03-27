import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShopContext } from './context/ShopContext.jsx';

// Frontend components
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import MyOrders from './pages/MyOrders';
import CurrentOrder from './pages/CurrentOrder';
import Otp from './pages/Otp';
import ResetPassword from './pages/ResetPassword';
import Verify from './pages/Verify';
import TrackOrder from './pages/TrackOrder';
import Profile from './pages/Profile';
import OurPolicy from './componants/OurPolicy';
import PolicyDetails from './componants/PolicyDetails';
import TrustedShopping from './pages/TrustedShopping';
import Careers from './pages/Careers';
import ApplyJob from './pages/ApplyJob';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Payment from './pages/Payment.jsx';


// Admin components
import UniversalLogin from './pages/UniversalLogin';
import Navbar from './componants/Navbar';
import Footer from './componants/Footer';
import SearchBar from './componants/SearchBar';
import ProtectedRoutes from './componants/ProtectedRoutes';

// Admin-specific components
import AdminNavbar from './admin-components/Navbar';
import AdminSidebar from './admin-components/Sidebar';
import ForgotPassword from './admin-components/ForgotPassword';
import SellerSignup from './admin-components/SellerSignup';
import VerifyOtp from './admin-components/VerifyOtp';
import ResetPasswordAdmin from './admin-components/ResetPassword';

// Admin pages
import Dashboard from './admin-pages/Dashboard';
import SellerDashboard from './admin-pages/SellerDashboard';
import Add from './admin-pages/Add';
import List from './admin-pages/List';
import Orders from './admin-pages/Orders';
import AddPromo from './admin-pages/AddPromo';
import HeroBannerAdmin from './admin-pages/HeroBannerAdmin';

const ProtectedRoute = ({
  children,
  token,
  role,
  allowedRoles = [],
}) => {
  const getDashboardPath = () => {
    if (role === "admin") return "/admin-dashboard";
    if (role === "seller") return "/seller-dashboard";
    if (role === "buyer") return "/";
    return "/login";
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={getDashboardPath()} replace />;
  }

  if (role === "admin" || role === "seller") {
    return (
      <div className="min-h-screen bg-[#f5f7fb]">
        <AdminNavbar role={role} />
        <div className="flex">
          <AdminSidebar role={role} />
          <main className="flex-1 min-w-0 p-4 md:p-6">{children}</main>
        </div>
      </div>
    );
  }

  return children;
};

const PublicRoute = ({ children, token, role }) => {
  const getDashboardPath = () => {
    if (role === "admin") return "/admin-dashboard";
    if (role === "seller") return "/seller-dashboard";
    if (role === "buyer") return "/";
    return "/login";
  };

  if (token) {
    return <Navigate to={getDashboardPath()} replace />;
  }

  return children;
};

const App = () => {
  const { token, role } = useContext(ShopContext);

  const getDashboardPath = () => {
    if (role === "admin") return "/admin-dashboard";
    if (role === "seller") return "/seller-dashboard";
    if (role === "buyer") return "/";
    return "/login";
  };

  const isAdminOrSeller = role === "admin" || role === "seller";

  return (
    <div className={isAdminOrSeller ? "" : 'px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      {/* Show regular navbar only for buyers */}
      {!isAdminOrSeller && (
        <>
          <Navbar className="fixed top-0 left-0 right-0 z-50"/>
          <SearchBar/>
        </>
      )}

      <Routes>
        {/* Universal Login Route */}
        <Route
          path="/login"
          element={
            <PublicRoute token={token} role={role}>
              <UniversalLogin />
            </PublicRoute>
          }
        />

        {/* Admin/Seller Routes */}
        <Route
          path="/seller-signup"
          element={
            <PublicRoute token={token} role={role}>
              <SellerSignup />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute token={token} role={role}>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/verify-otp"
          element={
            <PublicRoute token={token} role={role}>
              <VerifyOtp />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PublicRoute token={token} role={role}>
              <ResetPasswordAdmin />
            </PublicRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute
              token={token}
              role={role}
              allowedRoles={["admin"]}
            >
              <Dashboard role={role} />
            </ProtectedRoute>
          }
        />

        {/* Seller Dashboard */}
        <Route
          path="/seller-dashboard"
          element={
            <ProtectedRoute
              token={token}
              role={role}
              allowedRoles={["seller"]}
            >
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin/Seller Shared Routes */}
        <Route
          path="/add"
          element={
            <ProtectedRoute
              token={token}
              role={role}
              allowedRoles={["admin", "seller"]}
            >
              <Add />
            </ProtectedRoute>
          }
        />

        <Route
          path="/list"
          element={
            <ProtectedRoute
              token={token}
              role={role}
              allowedRoles={["admin", "seller"]}
            >
              <List />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order"
          element={
            <ProtectedRoute
              token={token}
              role={role}
              allowedRoles={["admin", "seller"]}
            >
              <Orders role={role} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/promo"
          element={
            <ProtectedRoute
              token={token}
              role={role}
              allowedRoles={["admin"]}
            >
              <AddPromo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hero-banner"
          element={
            <ProtectedRoute
              token={token}
              role={role}
              allowedRoles={["admin"]}
            >
              <HeroBannerAdmin />
            </ProtectedRoute>
          }
        />

        {/* Buyer Routes */}
        <Route path='/' element={isAdminOrSeller ? <Navigate to={getDashboardPath()} replace /> : <Home/>}/>
        <Route path='/about' element={<ProtectedRoutes><About/></ProtectedRoutes>}/>
        <Route path='/contact' element={<ProtectedRoutes><Contact/></ProtectedRoutes>}/>
        <Route path='/careers' element={<ProtectedRoutes><Careers/></ProtectedRoutes>}/>
        <Route path='/apply-job' element={<ProtectedRoutes><ApplyJob/></ProtectedRoutes>}/>
        <Route path='/product/:productId' element={<Product/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/otp' element={<Otp/>}/>
        <Route path='/reset-password-buyer' element={<ResetPassword/>}/>
        <Route path='/place-order' element={<ProtectedRoutes><PlaceOrder/></ProtectedRoutes>}/>
        <Route path='/my-orders' element={<ProtectedRoutes><MyOrders/></ProtectedRoutes>}/>
        <Route path='/current-order' element={<ProtectedRoutes><CurrentOrder/></ProtectedRoutes>}/>
        <Route path="/verify" element={<ProtectedRoutes><Verify/></ProtectedRoutes>} />
        <Route path="/track-order/:orderId" element={<ProtectedRoutes><TrackOrder/></ProtectedRoutes  >}/>
        <Route path="/profile" element={<ProtectedRoutes><Profile/></ProtectedRoutes>} />
        <Route path="/our-policy" element={<ProtectedRoutes><OurPolicy/></ProtectedRoutes>} />
        <Route path="/policy/:policyId" element={<ProtectedRoutes><PolicyDetails/></ProtectedRoutes>} />  
        <Route path="/trusted-shopping" element={<TrustedShopping />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path='/collection' element={<ProtectedRoutes><Collection/></ProtectedRoutes>}/>  
        <Route path='/payment' element={<ProtectedRoutes><Payment/></ProtectedRoutes>} />

        {/* Default Routes */}
        <Route
          path="/"
          element={<Navigate to={getDashboardPath()} replace />}    
        />
        <Route
          path="*"
          element={<Navigate to={getDashboardPath()} replace />}
        />
      </Routes>

      {/* Show footer only for buyers */}
      {!isAdminOrSeller && <Footer/>}
    </div>
  );
};

export default App;
