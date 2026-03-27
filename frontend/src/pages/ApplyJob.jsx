import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Title from "../componants/Title";

const ApplyJob = () => {
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get("role") || "";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: roleFromUrl,
    experience: "",
    message: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "resume") {
      setFormData((prev) => ({
        ...prev,
        resume: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const submitData = new FormData();
    submitData.append("fullName", formData.fullName);
    submitData.append("email", formData.email);
    submitData.append("phone", formData.phone);
    submitData.append("role", formData.role);
    submitData.append("experience", formData.experience);
    submitData.append("message", formData.message);

    if (formData.resume) {
      submitData.append("resume", formData.resume);
    }

    const response = await fetch("http://localhost:4000/api/job/apply", {
      method: "POST",
      body: submitData,
    });

    const data = await response.json();

    if (data.success) {
      alert("Application submitted successfully. Please check your email.");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        role: roleFromUrl || "",
        experience: "",
        message: "",
        resume: null,
      });
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
};

  return (
    <div className="border-t pt-10">
      <div className="text-center text-2xl">
        <Title text1={"APPLY"} text2={"NOW"} />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white shadow-md rounded-xl p-6 md:p-8 border">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Job Application Form
          </h2>
          <p className="text-gray-500 mb-8">
            Fill in your details and apply for your desired position.
          </p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="border p-3 rounded-md outline-none"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="border p-3 rounded-md outline-none"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="border p-3 rounded-md outline-none"
              required
            />

            <input
              type="text"
              name="role"
              placeholder="Applying For"
              value={formData.role}
              onChange={handleChange}
              className="border p-3 rounded-md outline-none"
              required
            />

            <input
              type="text"
              name="experience"
              placeholder="Experience"
              value={formData.experience}
              onChange={handleChange}
              className="border p-3 rounded-md outline-none md:col-span-2"
            />

            <textarea
              name="message"
              placeholder="Tell us about yourself"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="border p-3 rounded-md outline-none md:col-span-2"
            />

            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              className="border p-3 rounded-md outline-none md:col-span-2"
            />

            <button
              type="submit"
              className="bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition md:col-span-2"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;