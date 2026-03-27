// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   PlusSquare,
//   Package,
//   ClipboardList,
//   TicketPercent,
// } from "lucide-react";

// const Sidebar = ({ role }) => {
//   const baseClass =
//     "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all";
//   const activeClass = "bg-black text-white shadow";
//   const inactiveClass = "text-gray-700 hover:bg-gray-100";

//   return (
//     <aside className="w-[250px] hidden md:block bg-white border-r border-gray-200 min-h-[calc(100vh-72px)] p-4">
//       <div className="mb-6">
//         <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
//         <p className="text-xs text-gray-500 capitalize">{role} access</p>
//       </div>

//       <nav className="flex flex-col gap-2">
//         <NavLink
//           to="/"
//           className={({ isActive }) =>
//             `${baseClass} ${isActive ? activeClass : inactiveClass}`
//           }
//         >
//           <LayoutDashboard size={18} />
//           Dashboard
//         </NavLink>

//         <NavLink
//           to="/add"
//           className={({ isActive }) =>
//             `${baseClass} ${isActive ? activeClass : inactiveClass}`
//           }
//         >
//           <PlusSquare size={18} />
//           Add Product
//         </NavLink>

//         <NavLink
//           to="/list"
//           className={({ isActive }) =>
//             `${baseClass} ${isActive ? activeClass : inactiveClass}`
//           }
//         >
//           <Package size={18} />
//           Products
//         </NavLink>

//         <NavLink
//           to="/order"
//           className={({ isActive }) =>
//             `${baseClass} ${isActive ? activeClass : inactiveClass}`
//           }
//         >
//           <ClipboardList size={18} />
//           Orders
//         </NavLink>

//         {role === "admin" && (
//           <NavLink
//             to="/promo"
//             className={({ isActive }) =>
//               `${baseClass} ${isActive ? activeClass : inactiveClass}`
//             }
//           >
//             <TicketPercent size={18} />
//             Promo Codes
//           </NavLink>
//         )}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;




import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusSquare,
  Package,
  ClipboardList,
  TicketPercent,
} from "lucide-react";

const Sidebar = ({ role }) => {
  const baseClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all";
  const activeClass = "bg-black text-white shadow";
  const inactiveClass = "text-gray-700 hover:bg-gray-100";

  const dashboardPath =
    role === "admin" ? "/admin-dashboard" : "/seller-dashboard";

  return (
    <aside className="w-[250px] hidden md:block bg-white border-r border-gray-200 min-h-[calc(100vh-72px)] p-4">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
        <p className="text-xs text-gray-500 capitalize">{role} access</p>
      </div>

      <nav className="flex flex-col gap-2">
        <NavLink
          to={dashboardPath}
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/add"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <PlusSquare size={18} />
          Add Product
        </NavLink>

        <NavLink
          to="/list"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <Package size={18} />
          Products
        </NavLink>

        <NavLink
          to="/order"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <ClipboardList size={18} />
          Orders
        </NavLink>

        {role === "admin" && (
          <>
            <NavLink
              to="/promo"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              <TicketPercent size={18} />
              Promo Codes
            </NavLink>
            <NavLink
              to="/hero-banner"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              <ClipboardList size={18} />
              HeroBanner
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;