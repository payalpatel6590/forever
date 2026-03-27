import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TrustedShopping = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const trustPoints = [
    {
      title: "Secure Payments",
      desc: "Your transactions are protected with safe and reliable payment methods for a worry-free checkout experience.",
    },
    {
      title: "Quality Assurance",
      desc: "Every product is selected and checked carefully so you receive value, quality, and satisfaction in every order.",
    },
    {
      title: "Easy Returns & Exchange",
      desc: "We make returns and exchanges simple so you can shop with full confidence and peace of mind.",
    },
    {
      title: "Fast Customer Support",
      desc: "Our support team is always ready to help you with your questions, orders, and shopping concerns.",
    },
  ];

  const handleStartShopping = () => {
    navigate("/collection", { state: { scrollToBottom: true } });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <section className="min-h-screen `bg-gradient-to-b` from-[#fff7f2] via-white to-[#f8f8f8] px-4 sm:px-8 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto">
        {/* Top Back Button */}
        <button
          onClick={handleBack}
          className="mb-8 px-5 py-2.5 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
        >
          ← Back
        </button>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-black via-[#1b1b1b] to-[#2a2a2a] text-white px-6 sm:px-12 py-14 sm:py-20 shadow-2xl">
          <div className="absolute top-0 right-0 w-52 h-52 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-52 h-52 bg-orange-400/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-3xl">
            

            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
              Shop With Confidence,
              <span className="text-orange-400"> Every Single Time</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-gray-300 leading-7 max-w-2xl">
              We are committed to giving every customer a smooth, secure, and
              satisfying shopping journey. From product quality to fast support,
              every step is designed to build trust and deliver confidence.
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          <div className="bg-white rounded-[28px] border border-gray-200 shadow-md p-7 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">
              Why Customers Trust Us
            </h2>
            <p className="text-gray-600 leading-8 text-sm sm:text-base">
              Our goal is not only to sell products but also to create a
              dependable shopping relationship with our customers. We focus on
              honesty, convenience, quality, and fast service so every buyer
              feels safe and valued while shopping with us.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex gap-3 items-start">
                <div className="mt-2 w-3 h-3 rounded-full bg-orange-500"></div>
                <p className="text-gray-700">
                  Transparent policies with customer-friendly support
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="mt-2 w-3 h-3 rounded-full bg-orange-500"></div>
                <p className="text-gray-700">
                  Safe shopping experience from browsing to delivery
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="mt-2 w-3 h-3 rounded-full bg-orange-500"></div>
                <p className="text-gray-700">
                  Fast response for returns, exchanges, and customer queries
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[28px] border border-gray-200 shadow-md p-7 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">
              Our Promise To You
            </h2>
            <p className="text-gray-600 leading-8 text-sm sm:text-base">
              We believe trust is earned through actions. That is why we work
              hard to provide excellent service, reliable product quality,
              secure payment methods, and responsive customer care for every
              order placed on our platform.
            </p>

            <div className="mt-6 rounded-2xl bg-orange-50 border border-orange-100 p-5">
              <p className="text-gray-800 font-semibold text-lg">
                “A trusted store is built on service, honesty, and customer
                satisfaction.”
              </p>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="mt-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
            What Makes Us Different
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trustPoints.map((item, index) => (
              <div
                key={index}
                className="bg-white `rounded-[24px]` border border-gray-200 shadow-sm hover:shadow-xl transition p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-lg mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-7 text-sm sm:text-base">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 `rounded-[32px]` bg-black text-white p-8 sm:p-10 text-center shadow-xl">
          <p className="text-orange-400 font-semibold text-sm mb-3">
            Trusted By Smart Shoppers
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Your Confidence Is Our Priority
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto leading-7 text-sm sm:text-base">
            We continue improving every part of the shopping journey so you can
            enjoy safe purchases, premium support, and a store experience built
            on trust.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartShopping}
              className="px-7 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
            >
              Start Shopping
            </button>

            <button
              onClick={handleBack}
              className="px-7 py-3 rounded-full border border-white/30 bg-white/10 text-white font-semibold hover:bg-white/20 transition"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedShopping;