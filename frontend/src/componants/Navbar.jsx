import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext.jsx";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const { getCartCount, showSearch, setShowSearch, updateToken, role } =
    useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    updateToken(null);
    navigate("/login");
    setProfileOpen(false);
  };

  return (
    <div className="flex items-center justify-between py-5 px-4 sm:px-6 lg:px-8 font-medium bg-white border-b">
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          className="w-12 sm:w-14 lg:w-16"
          alt="Logo"
        />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-full border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-full border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-full border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-full border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      {/* Right Side Icons */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Search Icon */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="hover:opacity-80 transition-opacity"
        >
          <img
            src={assets.search_icon}
            className="w-5 h-5 sm:w-6 sm:h-6"
            alt="Search"
          />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src={assets.profile_icon}
              className="w-5 h-5 sm:w-6 sm:h-6"
              alt="Profile"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[150px] z-50">
              {role ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600 border-b">
                    {role === "buyer" ? "Buyer Account" : role === "seller" ? "Seller Account" : "Admin Account"}
                  </div>
                  {role === "buyer" && (
                    <>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => setProfileOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/my-orders"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => setProfileOpen(false)}
                      >
                        My Orders
                      </Link>
                    </>
                  )}
                  {(role === "seller" || role === "admin") && (
                    <Link
                      to={`/${role}-dashboard`}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <Link to="/cart" className="relative hover:opacity-80 transition-opacity">
          <img
            src={assets.cart_icon}
            className="w-5 h-5 sm:w-6 sm:h-6"
            alt="Cart"
          />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-black text-white text-xs rounded-full flex items-center justify-center">
            {getCartCount()}
          </div>
        </Link>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setVisible(true)}
          className="sm:hidden hover:opacity-80 transition-opacity"
        >
          <img
            src={assets.menu_icon}
            className="w-5 h-5"
            alt="Menu"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
          <div className="bg-white w-3/4 h-full p-6 flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <img
                src={assets.logo}
                className="w-12"
                alt="Logo"
              />
              <button
                onClick={() => setVisible(false)}
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src={assets.cross_icon}
                  className="w-6 h-6"
                  alt="Close"
                />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-gray-700">
              <Link
                to="/"
                onClick={() => setVisible(false)}
                className="py-2"
              >
                HOME
              </Link>
              <Link
                to="/collection"
                onClick={() => setVisible(false)}
                className="py-2"
              >
                COLLECTION
              </Link>
              <Link
                to="/about"
                onClick={() => setVisible(false)}
                className="py-2"
              >
                ABOUT
              </Link>
              <Link
                to="/contact"
                onClick={() => setVisible(false)}
                className="py-2"
              >
                CONTACT
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
