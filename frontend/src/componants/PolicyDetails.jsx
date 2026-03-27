import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";

const policyData = {
  exchange: {
    title: "Easy Exchange Policy",
    icon: assets.exchange_icon,
    heroText:
      "Easy exchanges for eligible items with a smooth and customer-friendly process.",
    description:
      "We want you to shop with confidence. If your item has a size issue, fit concern, or another eligible problem, you can request an exchange easily within the policy time.",
    details: [
      "Exchange requests must be raised within 7 days of delivery.",
      "Items must be unused, unwashed, and in original condition.",
      "Original packaging, invoice, and tags must be available.",
      "Exchange is subject to product stock availability.",
      "Certain sale or clearance products may not qualify for exchange.",
      "Wrong or damaged products delivered by us will be exchanged without extra charge.",
    ],
    faqs: [
      {
        q: "How do I request an exchange?",
        a: "You can request an exchange through our support team within 7 days of delivery.",
      },
      {
        q: "Can I exchange a used product?",
        a: "No, the product must be unused and in its original condition.",
      },
      {
        q: "Is exchange free for damaged items?",
        a: "Yes, if the wrong or damaged item was delivered by us, exchange is provided without extra cost.",
      },
    ],
  },
  return: {
    title: "7 Days Return Policy",
    icon: assets.quality_icon,
    heroText:
      "Simple returns process designed to keep your shopping experience worry-free.",
    description:
      "If you are not fully satisfied with your purchase, you can request a return within 7 days of delivery, provided the item meets our return requirements.",
    details: [
      "Return requests must be made within 7 days after product delivery.",
      "The product should be unused and in original packaging.",
      "Returns are not accepted for items damaged due to customer misuse.",
      "Returned products go through an inspection before approval.",
      "Shipping charges may be non-refundable depending on the return reason.",
      "Approved refunds are processed to the original payment method.",
    ],
    faqs: [
      {
        q: "When will my refund be processed?",
        a: "Refund is processed after the returned product passes inspection successfully.",
      },
      {
        q: "Can discounted items be returned?",
        a: "Some discounted or final sale items may not be eligible for return.",
      },
      {
        q: "Will shipping charges be refunded?",
        a: "That depends on the reason for the return and the return approval case.",
      },
    ],
  },
  support: {
    title: "Best Customer Support",
    icon: assets.support_img,
    heroText:
      "Reliable and friendly customer support whenever you need help.",
    description:
      "Our support team is always available to assist you with orders, returns, exchanges, payments, delivery concerns, and other general queries.",
    details: [
      "Customer support is available 24/7.",
      "We assist with orders, delivery, payment, and product-related concerns.",
      "Dedicated support is available for return and exchange issues.",
      "You can contact us through email, phone, or live chat.",
      "We maintain clear and transparent communication.",
      "Most customer issues are resolved as quickly as possible.",
    ],
    faqs: [
      {
        q: "Is support available all day?",
        a: "Yes, our support team is available 24/7.",
      },
      {
        q: "How can I contact support?",
        a: "You can contact us using phone, email, or live chat support.",
      },
      {
        q: "Can support help with exchange and returns?",
        a: "Yes, our support team helps with all return and exchange-related questions.",
      },
    ],
  },
};

const FaqItem = ({ faq, open, onClick }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">
          {faq.q}
        </span>
        <span
          className={`text-xl font-bold transition-transform duration-300 ${
            open ? "rotate-45 text-orange-500" : "rotate-0 text-black"
          }`}
        >
          +
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm text-gray-600 leading-7">{faq.a}</p>
        </div>
      </div>
    </div>
  );
};

const PolicyDetails = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const policy = policyData[policyId];
  const [openIndex, setOpenIndex] = useState(0);
  

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  if (!policy) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#f8f8f8]">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-10 text-center max-w-lg w-full">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Policy Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The policy page you are trying to open does not exist.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-full bg-black text-white hover:bg-orange-500 transition"
          >
            Back to Policies
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#f8f8f8] min-h-screen py-10 sm:py-14 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        

        {/* Hero */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-black via-[#181818] to-[#2b2b2b] p-8 sm:p-14 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-44 h-44 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-44 h-44 bg-orange-400/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-3xl">
            <div className="w-20 h-20 rounded-2xl bg-white backdrop-blur-sm flex items-center justify-center mb-6">
              <img
                src={policy.icon}
                alt={policy.title}
                className="w-10 h-10 object-contain"
              />
            </div>

            <p className="text-orange-400 font-semibold mb-3">Policy Details</p>

            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
              {policy.title}
            </h1>

            <p className="mt-5 text-gray-300 text-sm sm:text-base leading-7 max-w-2xl">
              {policy.heroText}
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[28px] border border-gray-200 shadow-md p-7 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Overview
              </h2>
              <p className="text-gray-600 leading-8 text-sm sm:text-base">
                {policy.description}
              </p>
            </div>

            <div className="bg-white rounded-[28px] border border-gray-200 shadow-md p-7 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Complete Policy Information
              </h2>

              <div className="space-y-4">
                {policy.details.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100"
                  >
                    <div className="mt-2 w-3 h-3 rounded-full bg-orange-500 shrink-0"></div>
                    <p className="text-gray-700 leading-7 text-sm sm:text-base">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-8">
            <div className="bg-white rounded-[28px] border border-gray-200 shadow-md p-7">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQs</h2>

              <div className="space-y-4">
                {policy.faqs.map((faq, index) => (
                  <FaqItem
                    key={index}
                    faq={faq}
                    open={openIndex === index}
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[28px] bg-black text-white p-7 shadow-xl">
              <p className="text-orange-400 font-semibold text-sm mb-3">
                Need Assistance?
              </p>
              <h3 className="text-2xl font-bold mb-3">
                We’re here to help you
              </h3>
              <p className="text-gray-300 text-sm leading-7">
                For more questions related to orders, delivery, returns, or
                exchanges, reach out to our support team anytime.
              </p>

              <button className="mt-6 w-full rounded-full bg-orange-500 py-3 text-white font-semibold hover:bg-orange-600 transition">
                Contact Support
              </button>
              
            </div>
          </div>
        </div>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 mt-5 px-5 py-2.5 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
        >
          ← Back
        </button>
      </div>
      
    </section>
  );
};

export default PolicyDetails;