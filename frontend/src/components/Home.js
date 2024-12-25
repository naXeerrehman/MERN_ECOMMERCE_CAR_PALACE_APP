import React from "react";
import "../App.css";
import VehicleCarousel from "./VehicleCarousel";
import Features from "./Features";
import Banner from "./Banner";
// css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CallToAction from "./CTA";
import Footer from "./Footer";

const Home = () => {
  return (
    <div>
      <Banner />
      <Features />
      <VehicleCarousel />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
