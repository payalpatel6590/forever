import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../constants";
import { toast } from "react-toastify";

const Add = () => {
  const token = localStorage.getItem("adminToken");

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestSeller", bestSeller ? "true" : "false");

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Product added successfully");
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setCategory("Men");
        setSubCategory("Topwear");
        setSizes([]);
        setBestSeller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while adding the product.");
    }
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
    );
  };

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  return (
    <div className="max-w-5xl">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800">Add Product</h1>
        <p className="text-gray-500">Create a new product for your store</p>
      </div>

      <form
        onSubmit={onSubmitHandler}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6"
      >
        <div>
          <p className="text-lg font-semibold mb-4">Upload Images</p>

          <div className="flex flex-wrap gap-4">
            {[image1, image2, image3, image4].map((img, index) => {
              const setters = [setImage1, setImage2, setImage3, setImage4];
              return (
                <label
                  key={index}
                  htmlFor={`image${index + 1}`}
                  className="cursor-pointer"
                >
                  <img
                    className="w-24 h-24 rounded-xl border object-cover"
                    src={!img ? assets.upload_area : URL.createObjectURL(img)}
                    alt=""
                  />
                  <input
                    onChange={(e) => setters[index](e.target.files[0])}
                    type="file"
                    id={`image${index + 1}`}
                    className="hidden"
                  />
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-lg font-semibold mb-2">Product Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full border rounded-xl px-4 py-3"
            type="text"
            placeholder="Enter product name"
            required
          />
        </div>

        <div>
          <p className="text-lg font-semibold mb-2">Product Description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full border rounded-xl px-4 py-3 min-h-[120px]"
            placeholder="Enter product description"
            required
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-md font-semibold mb-2">Category</p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
              required
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <p className="text-md font-semibold mb-2">Sub Category</p>
            <select
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
              required
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div>
            <p className="text-md font-semibold mb-2">Price</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full border rounded-xl px-4 py-3"
              type="number"
              placeholder="25"
              required
            />
          </div>
        </div>

        <div>
          <p className="text-md font-semibold mb-3">Product Sizes</p>
          <div className="flex flex-wrap gap-3">
            {sizeOptions.map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 rounded-lg border transition ${
                  sizes.includes(size)
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="bestseller"
            checked={bestSeller}
            onChange={(e) => setBestSeller(e.target.checked)}
          />
          <label className="cursor-pointer text-gray-700" htmlFor="bestseller">
            Add to Best Seller
          </label>
        </div>

        <button
          className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
          type="submit"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Add;