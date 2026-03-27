import React from "react";
import { Link } from "react-router-dom";
import Title from "../componants/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../componants/NewsletterBox";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-20">
        <img className="w-full md:w-2/4 rounded-lg" src={assets.contact_img} alt="Contact" />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>

          <p className="text-gray-500">
            54709 WILLMS Station <br />
            Suit 350, Washington, USA
          </p>

          <p className="text-gray-500">
            Tel: +(91) - 91825-64133 <br />
            E-mail: admin@google.com
          </p>

          <p className="font-semibold text-gray-600 text-xl">
            Career at Forever
          </p>

          <p className="text-gray-500">
            Learn more about our teams, culture, and job opportunities.
          </p>

          <Link to="/careers" onClick={() => window.scrollTo(0, 0)}>
            <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
              Explore Jobs
            </button>
          </Link>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;