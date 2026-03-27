import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const policies = [
  {
    id: "exchange",
    title: "Easy Exchange Policy",
    shortDesc: "Simple and hassle-free exchange process for eligible products.",
    icon: assets.exchange_icon,
    badge: "Fast Process",
  },
  {
    id: "return",
    title: "7 Days Return Policy",
    shortDesc: "Return your order within 7 days under our return guidelines.",
    icon: assets.quality_icon,
    badge: "Customer Friendly",
  },
  {
    id: "support",
    title: "Best Customer Support",
    shortDesc: "Our support team is available 24/7 for all your queries.",
    icon: assets.support_img,
    badge: "24/7 Active",
  },
];

const OurPolicy = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#f8f8f8] py-16 sm:py-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-black via-[#1a1a1a] to-[#2b2b2b] px-6 sm:px-12 py-14 sm:py-20 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-400/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-3xl">
            <button
              onClick={() => navigate("/trusted-shopping")}
              className="inline-block bg-orange-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full mb-5 cursor-pointer hover:bg-orange-600 transition"
            >
              Trusted Shopping Experience
            </button>                 

            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
              Our Policies Are Made
              <span className="text-orange-400"> For Your Confidence</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-gray-300 leading-7 max-w-2xl">
              We believe online shopping should be transparent, secure, and
              customer-friendly. Explore our policies to know how we handle
              exchanges, returns, and support with complete care.
            </p>
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center mt-16 mb-10">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
            Explore Our Policy Details
          </h2>
          <p className="text-gray-500 mt-3 text-sm sm:text-base">
            Click on any policy card to read full details
          </p>
        </div>

        {/* Policy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {policies.map((policy) => (
            <div
              key={policy.id}
              onClick={() => navigate(`/policy/${policy.id}`)}
              className="group relative cursor-pointer overflow-hidden rounded-[28px] bg-white border border-gray-200 p-7 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center group-hover:scale-110 transition duration-300">
                    <img
                      src={policy.icon}
                      alt={policy.title}
                      className="w-8 h-8 object-contain"
                    />
                  </div>

                  <span className="text-xs font-semibold bg-black text-white px-3 py-1.5 rounded-full">
                    {policy.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {policy.title}
                </h3>

                <p className="text-gray-500 text-sm leading-6">
                  {policy.shortDesc}
                </p>

                <div className="mt-7 flex items-center justify-between">
                  <span className="text-orange-500 font-semibold text-sm">
                    Read More
                  </span>
                  <span className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-orange-500 transition">
                    →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center">
            <h4 className="text-lg font-bold text-gray-900">Secure Policies</h4>
            <p className="text-sm text-gray-500 mt-2">
              Clear and transparent policy terms for every customer.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center">
            <h4 className="text-lg font-bold text-gray-900">Fast Resolution</h4>
            <p className="text-sm text-gray-500 mt-2">
              We work quickly to resolve returns, exchanges, and support issues.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center">
            <h4 className="text-lg font-bold text-gray-900">Customer First</h4>
            <p className="text-sm text-gray-500 mt-2">
              Every policy is designed to improve your shopping experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;
