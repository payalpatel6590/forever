// import React, { useContext } from "react";
// import { ShopContext } from "../context/context";
// import { assets } from "../assets/assets";

// const SearchBar = () => {

//   const { search, setSearch, showSearch, setShowSearch } =
//     useContext(ShopContext);

//   if (!showSearch) return null;

//   return (
//     <div className="border-t border-b bg-gray-50 text-center">

//       <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">

//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           type="text"
//           placeholder="Search products..."
//           className="flex-1 outline-none bg-inherit text-sm"
//         />

//         <img src={assets.search_icon} className="w-4" />

//       </div>

//       <img
//         onClick={() => setShowSearch(false)}
//         className="inline w-3 cursor-pointer"
//         src={assets.cross_icon}
//       />

//     </div>
//   );
// };

// export default SearchBar;


import React, { useContext, useEffect, useRef } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);

  // Focus input when search bar opens
  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  const handleChange = (e) => {
    setSearch(e.target.value);

    // Navigate to /collection when typing
    if (location.pathname !== "/collection") {
      navigate("/collection");
    }
  };

  if (!showSearch) return null;

  return (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-1/2 relative">
        <input
          ref={inputRef}
          className="flex-1 outline-none bg-inherit text-sm"
          type="text"
          placeholder="Search Products"
          value={search}
          onChange={handleChange}
        />
        {/* Close button */}
        <button
          className="absolute right-2 text-gray-500"
          onClick={() => setShowSearch(false)}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default SearchBar;