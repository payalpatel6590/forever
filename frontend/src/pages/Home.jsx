import React from "react";
import Hero from "../componants/Hero";
import LatestCollection from "../componants/LatestCollection";
import BestSeller from "../componants/BestSeller";
import OurPolicy from "../componants/OurPolicy";
import NewsletterBox from "../componants/NewsletterBox";

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsletterBox />
    </div>
  );
};

export default Home;
