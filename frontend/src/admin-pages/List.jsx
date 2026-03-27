import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../constants";
import { toast } from "react-toastify";
import { Trash2, PackageSearch } from "lucide-react";

const List = () => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");

  const fetchList = async () => {
    try {
      // 1. Get the correct token and role from storage
      const token = localStorage.getItem("sellerToken") || localStorage.getItem("adminToken");
      const role = localStorage.getItem("role");

      if (!token) {
        toast.error("Session expired. Please login again.");
        return;
      }

      // 2. Determine endpoint based on role
      const url =
        role === "admin"
          ? `${backendUrl}/api/product/admin-list`
          : `${backendUrl}/api/product/seller-list`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Crucial for authSeller middleware
        },
      });

      if (response.data.success) {
        setList(response.data.products || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Fetch Error:", error);
      toast.error("Failed to fetch products");
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const token = localStorage.getItem("sellerToken") || localStorage.getItem("adminToken");

      const response = await axios.delete(
        `${backendUrl}/api/product/remove/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Product removed");
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Delete Error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "";
    if (typeof image === "string") return image;
    if (Array.isArray(image)) {
      const firstImage = image[0];
      if (typeof firstImage === "string") return firstImage;
      return firstImage?.url || firstImage?.secure_url || "";
    }
    return image?.url || image?.secure_url || "";
  };

  const filteredList = list.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>

        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border bg-white px-4 py-2 rounded-xl outline-none w-full md:w-[300px]"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="hidden md:grid grid-cols-[100px_2fr_1fr_1fr_1fr_100px] gap-4 px-5 py-4 bg-gray-50 border-b text-sm font-semibold text-gray-700">
          <p>Image</p>
          <p>Name</p>
          <p>Category</p>
          <p>SubCategory</p>
          <p>Price</p>
          <p className="text-center">Action</p>
        </div>

        {filteredList.length === 0 ? (
          <div className="p-10 text-center text-gray-500 flex flex-col items-center gap-3">
            <PackageSearch size={34} />
            No products found.
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item._id}
              className="grid md:grid-cols-[100px_2fr_1fr_1fr_1fr_100px] gap-4 items-center px-5 py-4 border-b last:border-0"
            >
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg border"
              />

              <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {item.description}
                </p>
              </div>

              <p className="text-gray-600">{item.category}</p>
              <p className="text-gray-600">{item.subCategory}</p>
              <p className="font-semibold text-gray-800">
                {currency}
                {item.price}
              </p>

              <button
                onClick={() => removeProduct(item._id)}
                className="mx-auto text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default List;