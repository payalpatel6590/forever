import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const formatAddress = (address) => {
    if (!address) return "Add address";

    if (typeof address === "string") {
      return address.trim() ? address : "Add address";
    }

    if (typeof address === "object") {
      const fullAddress = [
        address.street,
        address.area,
        address.city,
        address.state,
        address.country,
        address.pincode,
        address.zipcode,
      ]
        .filter(Boolean)
        .join(", ");

      return fullAddress || "Add address";
    }

    return "Add address";
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success && response.data.user) {
        const userData = {
          name: response.data.user.name || "",
          email: response.data.user.email || "",
          phone: response.data.user.phone || "",
          address: response.data.user.address || "",
        };

        setUser(userData);
      } else {
        toast.error(response.data.message || "Profile not found");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      navigate("/login");
      return;
    }

    fetchProfile();
  }, [token, navigate]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateProfile = async () => {
    try {
      setUpdating(true);

      const response = await axios.put(
        `${backendUrl}/api/profile/update`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const updatedUser = {
          name: response.data.user.name || "",
          email: response.data.user.email || "",
          phone: response.data.user.phone || "",
          address: response.data.user.address || "",
        };

        setUser(updatedUser);

        // clear form after update
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
        });

        toast.success("Profile updated successfully");
      } else {
        toast.error(response.data.message || "Profile update failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Profile update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading profile...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold text-center mb-8">My Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side - Saved Details */}
        <div className="bg-white shadow-md rounded-lg p-6 border">
          <h3 className="text-xl font-semibold mb-6 border-b pb-3">
            Saved Details
          </h3>

          <div className="space-y-5">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-medium text-gray-800">
                {user.name || "Add name"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium text-gray-800">
                {user.email || "Add email"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-lg font-medium text-gray-800">
                {user.phone || "Add phone"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-lg font-medium text-gray-800 whitespace-pre-line">
                {formatAddress(user.address)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Update Form */}
        <div className="bg-white shadow-md rounded-lg p-6 border">
          <h3 className="text-xl font-semibold mb-6 border-b pb-3">
            Update Profile
          </h3>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChangeHandler}
              placeholder="Enter name"
              className="border p-3 rounded outline-none focus:border-black"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChangeHandler}
              placeholder="Enter email"
              className="border p-3 rounded outline-none focus:border-black"
            />

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={onChangeHandler}
              placeholder="Enter phone"
              className="border p-3 rounded outline-none focus:border-black"
            />

            <textarea
              name="address"
              value={formData.address}
              onChange={onChangeHandler}
              placeholder="Add address"
              rows="5"
              className="border p-3 rounded outline-none focus:border-black"
            />

            <button
              onClick={updateProfile}
              disabled={updating}
              className="bg-black text-white py-3 rounded hover:bg-gray-800 transition-all duration-300 disabled:opacity-60"
            >
              {updating ? "UPDATING..." : "UPDATE PROFILE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;