import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../constants";

const AddPromo = () => {
  const adminToken = localStorage.getItem("adminToken");

  const [promoData, setPromoData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    expiryDate: "",
    maxUses: 1,
  });

  const normalizePromoCode = (code = "") => {
  return String(code).replace(/\s+/g, "").trim().toUpperCase();
};

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setPromoData((prev) => ({ ...prev, [name]: value }));
  };

 const submitHandler = async (e) => {
  e.preventDefault();

  try {
    const cleanPromoData = {
      ...promoData,
      code: normalizePromoCode(promoData.code),
      discountValue: Number(promoData.discountValue),
      maxUses: Number(promoData.maxUses),
    };

    const response = await axios.post(
      `${backendUrl}/api/promo/create`,
      cleanPromoData,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    if (response.data.success) {
      toast.success("Promo code created successfully");
      setPromoData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        expiryDate: "",
        maxUses: 1,
      });
    } else {
      toast.error(response.data.message || "Failed to create promo");
    }
  } catch (error) {
    console.error(error);
    toast.error("Server error while creating promo");
  }
};
  

  return (
    <div className="max-w-2xl">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800">Create Promo Code</h1>
        <p className="text-gray-500">Manage discount campaigns for customers</p>
      </div>

      <form
        onSubmit={submitHandler}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4"
      >
        <input
          name="code"
          value={promoData.code}
          onChange={(e) =>
            setPromoData((prev) => ({
              ...prev,
              code: normalizePromoCode(e.target.value),
            }))
          }
          placeholder="PROMO CODE (eg: SAVE10)"
          className="border rounded-xl p-3"
          required
        />

        <select
          name="discountType"
          value={promoData.discountType}
          onChange={onChangeHandler}
          className="border rounded-xl p-3"
        >
          <option value="percentage">Percentage</option>
          <option value="flat">Flat</option>
        </select>

        <input
          type="number"
          name="discountValue"
          value={promoData.discountValue}
          onChange={onChangeHandler}
          placeholder="Discount Value"
          className="border rounded-xl p-3"
          required
        />

        <input
          type="date"
          name="expiryDate"
          value={promoData.expiryDate}
          onChange={onChangeHandler}
          className="border rounded-xl p-3"
          required
        />

        <input
          type="number"
          name="maxUses"
          value={promoData.maxUses}
          onChange={onChangeHandler}
          className="border rounded-xl p-3"
        />

        <button className="bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition">
          Create Promo
        </button>
      </form>
    </div>
  );
};

export default AddPromo;