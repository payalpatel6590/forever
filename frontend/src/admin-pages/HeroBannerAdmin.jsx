import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../constants";
import { toast } from "react-toastify";

const HeroBannerAdmin = () => {
  const token = localStorage.getItem("adminToken");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);

  const [formData, setFormData] = useState({
    tag: "",
    title: "",
    subtitle: "",
    buttonText: "",
    category: "women",
  });

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/hero/admin-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setBanners(res.data.banners || []);
      }
    } catch (error) {
      console.log("fetchBanners error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBanners();
    }
  }, [token]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select hero image");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("tag", formData.tag);
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("buttonText", formData.buttonText);
      data.append("category", formData.category);
      data.append("image", image);

      const res = await axios.post(`${backendUrl}/api/hero/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("UPLOAD RESPONSE:", res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        setFormData({
          tag: "",
          title: "",
          subtitle: "",
          buttonText: "",
          category: "women",
        });
        setImage(null);
        setPreview("");
        fetchBanners();
      } else {
        toast.error(res.data.message || "Upload failed");
      }
    } catch (error) {
      console.log("upload hero error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id) => {
    try {
      const res = await axios.delete(`${backendUrl}/api/hero/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        fetchBanners();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("delete banner error:", error.response?.data || error.message);
      toast.error("Delete failed");
    }
  };

  const toggleBanner = async (id) => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/hero/toggle/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        fetchBanners();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("toggle banner error:", error.response?.data || error.message);
      toast.error("Status update failed");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Hero Banner Management</h1>

      <form
        onSubmit={onSubmitHandler}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Tag</p>
            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={onChangeHandler}
              placeholder="WOMEN COLLECTION"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Button Text</p>
            <input
              type="text"
              name="buttonText"
              value={formData.buttonText}
              onChange={onChangeHandler}
              placeholder="SHOP NOW"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Title</p>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChangeHandler}
              placeholder="Elegant Styles For Women"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Category</p>
            <select
              name="category"
              value={formData.category}
              onChange={onChangeHandler}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
            >
              <option value="women">Women</option>
              <option value="men">Men</option>
              <option value="kids">Kids</option>
            </select>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Subtitle</p>
          <textarea
            name="subtitle"
            value={formData.subtitle}
            onChange={onChangeHandler}
            placeholder="Discover graceful fashion for every occasion."
            rows={4}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Hero Image</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setImage(file);
              if (file) {
                setPreview(URL.createObjectURL(file));
              }
            }}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>

        {preview && (
          <div className="rounded-2xl overflow-hidden border border-gray-200">
            <img
              src={preview}
              alt="preview"
              className="w-full max-h-[300px] object-cover"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition"
        >
          {loading ? "Uploading..." : "Upload Hero Banner"}
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Uploaded Banners</h2>

        {banners.length === 0 ? (
          <p className="text-gray-500">No banners found.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="border border-gray-200 rounded-2xl overflow-hidden"
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    {banner.tag}
                  </p>
                  <h3 className="text-lg font-bold text-gray-800">{banner.title}</h3>
                  <p className="text-sm text-gray-600">{banner.subtitle}</p>
                  <p className="text-sm text-gray-500">
                    Category: <span className="font-medium">{banner.category}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        banner.isActive ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => toggleBanner(banner._id)}
                      className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                    >
                      {banner.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => deleteBanner(banner._id)}
                      className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroBannerAdmin;