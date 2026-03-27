import React, { useState } from "react";
import axios from "axios";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!email) return;

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:4000/api/newsletter/subscribe",
        { email }
      );

      if (response.data.success) {
        setMessage("🎉 Coupon sent to your email!");
        setEmail("");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Something went wrong. Try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center px-4 sm:px-6 md:px-8 py-8">
      <p className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-800">
        Subscribe Now and get 20% off
      </p>

      <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
        Subscribe to receive your exclusive discount coupon.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-2xl mx-auto mt-6 flex flex-col sm:flex-row items-stretch sm:items-center border rounded-lg overflow-hidden"
      >
        <input
          type="email"
          className="w-full flex-1 outline-none px-4 py-3 text-sm sm:text-base"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black cursor-pointer text-white text-xs sm:text-sm px-6 sm:px-8 md:px-10 py-3 sm:py-4 disabled:bg-gray-400 w-full sm:w-auto"
        >
          {loading ? "Sending..." : "SUBSCRIBE"}
        </button>
      </form>

      {message && (
        <p className="mt-3 text-sm sm:text-base text-green-600 break-words">
          {message}
        </p>
      )}
    </div>
  );
};

export default NewsletterBox;