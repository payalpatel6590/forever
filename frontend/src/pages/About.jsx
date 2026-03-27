import React from "react";
import Title from "../componants/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../componants/NewsletterBox";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img className="w-full md:max-w-[50%]" src={assets.about_img} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae
            neque asperiores unde, dolore commodi repudiandae quis ea mollitia
            facilis inventore. Blanditiis praesentium optio dolorem ipsa sit
            voluptatibus excepturi aut ab.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
            eius earum eveniet inventore blanditiis, quisquam ducimus fugit
            tempore praesentium iste sint dicta numquam! Neque dolor iusto
            corporis voluptatem optio laboriosam!
          </p>
          <b className="text-gray-600">Our Mission</b>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima
            facilis at aperiam aut in doloribus deleniti aspernatur reiciendis
            ratione magni sunt consequuntur ullam, deserunt amet quidem tempora
            qui nihil! Aperiam.
          </p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            we meticulously select and vet each product to ensure it meets our
            strengent quality standard.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            With our user-friendly interface and hussle-free ordering process,
            shopping has never been easier.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Our team is dedicated professionals is here to assist you the way,
            ensuring your satisfaction is our top priority.
          </p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default About;
