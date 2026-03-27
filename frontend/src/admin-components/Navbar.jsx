import React, { useContext } from "react";
import { assets } from "../admin-assets/assets";
import { Bell, Search, LogOut, UserCircle2 } from "lucide-react";
import { ShopContext } from "../context/ShopContext.jsx";

const Navbar = ({ role }) => {
  const { updateToken } = useContext(ShopContext);

  const logoutHandler = () => {
    updateToken(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 md:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            className="h-10 w-auto object-contain"
            src={assets.logo}
            alt="Logo"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl">
            <UserCircle2 size={20} className="text-gray-700" />
            <div className="leading-tight">
              <p className="text-sm font-semibold capitalize text-gray-800">
                {role}
              </p>
              <p className="text-xs text-gray-500">Panel Access</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logoutHandler}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
