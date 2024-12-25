import React from "react";
import LandCruiser from "../assets/LandCruiser.png";

const Banner = () => {
  return (
    <div>
      {/* Banner Title */}
      <h1 className="text-5xl font-extrabold pt-[20px] sm:ml-[10px] text-center sm:text-left md:ml-[140px] lg:ml-[50px]">
        CAR PALACE
      </h1>
      {/* Banner Content */}
      <div className="flex flex-col  justify-between items-center lg:w-[1200px] px-4 sm:px-6 lg:px-8 py-4 h-[380px] lg:py-10 mx-auto bg-yellow-500 rounded-md
        // for small mobile
         xs:w-[280px] xs:h-[320px] xs:mt-[10px]
        // for mobile
         sm:w-[335px] sm:h-[340px] sm:flex-row sm:mt-[20px]
          // for tablet
        md:mt-[25px] md:w-[650px]">
         {/* Text Section */}
       <div className="lg:w-[600px]">
         <h1 className="text-3xl sm:text-4xl font-semibold  text-center sm:text-left p-3 rounded-md sm:mb-0
        // for tablet
        md:w-[550px] md:-ml-[20px]
        // for mobile

       ">
          Welcome to the
          <br />
          <span className="font-bold font-serif text-4xl sm:text-5xl">
            Car Palace
          </span>
          <br />
          Here you will find your dream and quality Car, Bike, and Cycle at
          affordable prices!
        </h1>
       </div>
        {/* Image Section */}
        <div className="xl:w-[600px] flex justify-center sm:justify-end md:w-[0px] sm:w-[0px] xs:w-[0px]">
          <img
            src={LandCruiser}
            alt="Car"
            className="lg:w-[2200px] relative left-[100px] "
          />
        </div>
      </div>

      {/* Animated Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-yellow-500 to-green-500 animate-gradient-border rounded-md  mx-auto mt-[180px]  sm:mt-[145px]
        //  for small mobile
        xs:h-[350px] xs:mt-[140px] xs:w-[310px]
        // for mobile
        sm:w-[360px]  sm:h-[370px] 
        //  for tablet
        md:w-[720px] md:h-[380px] md:mt-[150px]
         //  for laptop
        lg:h-[380px]  lg:mt-[150px] lg:w-[1240px]"></div>
    </div>
  );
};

export default Banner;