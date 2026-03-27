import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { products as fallbackProducts } from "../assets/assets.js";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currancy = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || localStorage.getItem("adminToken") || null;
  });
  const [role, setRole] = useState(() => localStorage.getItem("role") || null);
  const [size, setSize] = useState("");
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Token management
  const updateToken = useCallback((newToken, userRole = null) => {
    if (newToken) {
      setToken(newToken);
      if (userRole === "buyer") {
        localStorage.setItem("token", newToken);
        localStorage.removeItem("adminToken");
      } else {
        localStorage.setItem("adminToken", newToken);
        localStorage.removeItem("token");
      }
      if (userRole) {
        setRole(userRole);
        localStorage.setItem("role", userRole);
      }
    } else {
      setToken(null);
      setRole(null);
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("role");
      setCartItems({});
      setOrders([]);
      setCurrentOrder(null);
    }
  }, []);

  // Add to cart
  const addToCart = useCallback(async (itemId, size) => {
    if (!size) {
      return;
    }

    let cartData = structuredClone(cartItems);
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    setCartItems(cartData);

    if (token && role === "buyer") {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.log("Cart update error:", error);
      }
    }
  }, [cartItems, token, role, backendUrl]);

  // Get cart count
  const getCartCount = useCallback(() => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log("Cart count error:", error);
        }
      }
    }
    return totalCount;
  }, [cartItems]);

  // Update quantity
  const updateQuantity = useCallback(async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    if (quantity === 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);

    if (token && role === "buyer") {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.log("Cart update error:", error);
      }
    }
  }, [cartItems, token, role, backendUrl]);

  // Get cart amount
  const getCartAmount = useCallback(() => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (!itemInfo) continue;
      for (const sz in cartItems[items]) {
        try {
          if (cartItems[items][sz] > 0) {
            totalAmount += itemInfo.price * cartItems[items][sz];
          }
        } catch (error) {
          console.log("Cart amount error:", error);
        }
      }
    }
    return totalAmount;
  }, [cartItems, products]);

  // Get products
  const getProductData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      
      if (res.data.success && res.data.products) {
        setProducts(res.data.products);
      } else {
        setProducts(fallbackProducts);
      }
    } catch (err) {
      console.log("Using fallback products:", err.message);
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  // Get current order
  const fetchCurrentOrder = useCallback(async () => {
    const savedToken = token || localStorage.getItem("token") || localStorage.getItem("adminToken");
    if (!savedToken || role !== "buyer") return;

    try {
      const res = await axios.get(`${backendUrl}/api/order/last`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });

      if (res.data.success) {
        setCurrentOrder(res.data.order);
      } else {
        setCurrentOrder(null);
      }
    } catch (err) {
      console.log("Fetch last order error:", err.message);
      setCurrentOrder(null);
    }
  }, [token, role, backendUrl]);

  // Get user orders
  const fetchUserOrders = useCallback(async () => {
    const savedToken = token || localStorage.getItem("token") || localStorage.getItem("adminToken");
    if (!savedToken || role !== "buyer") return;

    try {
      const res = await axios.get(`${backendUrl}/api/order/user-orders`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });

      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.log("Fetch user orders error:", err.message);
      setOrders([]);
    }
  }, [token, role, backendUrl]);

  // Get user cart
  const getUserCart = useCallback(async (userId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/get`,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (res.data.success) {
        setCartItems(res.data.cartData || {});
      }
    } catch (error) {
      console.log("Get cart error:", error);
    }
  }, [token, backendUrl]);

  // Effects
  useEffect(() => {
    getProductData();
  }, [getProductData]);

  useEffect(() => {
    if (token && role === "buyer") {
      fetchCurrentOrder();
      fetchUserOrders();
    } else {
      setCurrentOrder(null);
      setOrders([]);
    }
  }, [token, role, fetchCurrentOrder, fetchUserOrders]);

  const value = {
    products,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    currancy,
    delivery_fee,
    getUserCart,
    backendUrl,
    token,
    updateToken,
    role,
    setRole,
    currentOrder,
    orders,
    fetchUserOrders,
    loading,
    setLoading,
    size,
    setSize,
    setCartItems,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
