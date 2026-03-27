import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        
        {/* Logo Section */}
        <div>
          <img src={assets.logo} className="w-32 mb-5" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis
            iure officia reiciendis at sequi placeat vel architecto dolores
            numquam iusto.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>
              <Link to="/" onClick={scrollToTop} className="hover:text-black">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={scrollToTop} className="hover:text-black">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" onClick={scrollToTop} className="hover:text-black">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+91-91251-98256</li>
            <li>contact@foreveryou.com</li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          copyright 2024@forever.com - All rights are reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;