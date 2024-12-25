import React from "react";
import Car from "../assets/Car.png";
import Yamaha_MC from "../assets/Yamaha_MC.png";
import Dollar from "../assets/Dollar.png";
import Support from "../assets/Support.png";
const Features = () => {
  return (
    <div>
      {/* Features section */}
      <div className=" mx-2 lg:mx-6  mt-[100px] flex flex-col gap-y-4 lg:w-[1200px]">

        <div className="flex flex-col justify-between items-center bg-yellow-500 rounded-tr-[80px] rounded-bl-[80px]
        // for small mobiles
        xs:w-[300px] xs:ml-[0px] xs:h-[225px]
        // for mobile
         sm:w-[330px] sm:ml-[0px] sm:h-[190px]
        //  for tablet
         md:w-[600px] md:ml-[0px] md:h-[160px]
        //  for laptop
        lg:rounded-tr-[80px] lg:w-[900px] lg:ml-[0px] lg:h-[215px]
        // for desktop
         "
        >
          <div className="w-[250px] lg:mr-0">
            <h1 className="text-2xl lg:mx-[30px] w-[300px] font-bold
            // for small mobile
            xs:-ml-[20px]
            // for mobile
             sm:-ml-[35px]
            // for tablet
            md:-ml-[160px] md:text-2xl
            // for laptop
            lg:-ml-[300px] lg:mt-[10px]
             "
            >
              Quality Vehicles
            </h1>
            <h1
              className="lg:text-2xl lg:mx-[30px] py-1 lg:w- [400px] 
             // for small mobile
             xs:-ml-[20px]
             // for mobile
            sm:-ml-[30px]
              // for tablet
           md:w-[400px] md:-ml-[160px]
           lg:-ml-[300px] lg:w-[450px] lg:mt-[10px]
            "
            >
              Explore our collection as we have the vehicles of the latest
              Models and Brands with latest Technology that is maintainable,
              affordable and long lasting!{" "}
            </h1>
          </div>
          <div className="md:ml-[300px] lg:ml-0 ">
            <img src={Car} alt="Car_image" className="
            // for small mobile
            xs:w-[140px] xs:ml-[170px] xs:bottom-[10px]
            // for mobile
            sm:h-[70px] sm:ml-[200px] relative sm:bottom-[35px]
            // for tablet
           md:relative md:bottom-[60px] md:ml-[170px] md:h-[100px]
          //for laptop
           lg:relative lg:bottom-[120px] lg:ml-[670px] lg:h-[140px] lg:w-[250px]
            " />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center bg-yellow-500 rounded-tr-[80px] rounded-bl-[80px] lg:rounded-bl-[50px] lg:rounded-tr-[80px]
          // for small mobiles
        xs:w-[280px] xs:ml-[25px] xs:h-[200px]
        // for mobile
         sm:w-[310px] sm:ml-[50px]
        //  for tablet
         md:w-[640px] md:ml-[100px] md:h-[170px]
        //  for laptop
         lg:w-[900px] lg:ml-[340px]
        "
        >
          <div className="lg:mr-0">
            <h1
              className="text-2xl font-bold
              xs:ml-[8px]
              sm:w-[300px] sm:ml-[20px]
            md:mr-[310px]
            lg:mx-[30px] ">
              Affordable Prices
            </h1>
            <h1
              className="lg:text-2xl lg:mx-[30px] py-1 
            // for small mobile
            xs:ml-[8px]
            // for mobile
            sm:w-[300px] sm:ml-[20px]
            // for tablet
            // md:mr-[100px]
            //  for laptop
           lg:w-[420px]
             ">
          Here you will avail you dream Car, Bike and Cycle which will durable, latest and worth to buy with very low and affordable price!
            </h1>
          </div>
          <div className="">
            <img
              src={Dollar}
              alt="Dollar_icon"
              className="
              // for small mobile
              xs:relative xs:bottom-[5px] xs:ml-[190px] xs:w-[100px]
              // for mobile
              sm:w-[100px] sm:ml-[220px] relative sm:bottom-[10px] sm:right-[3px]
              // for tablet
              md:ml-[450px] md:w-[150px] md:relative md:bottom-[70px] md:left-[30px]
              // for laptop
              lg:w-[220px] lg:ml-[200px] lg:mt-[175px]"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between items-center bg-yellow-500 rounded-tr-[80px] rounded-bl-[80px]
        // for small mobiles
        xs:w-[300px] xs:ml-[0px] xs:h-[225px]
        // for mobile
         sm:w-[330px] sm:ml-[0px] sm:h-[190px]
        //  for tablet
         md:w-[600px] md:ml-[0px] md:h-[160px]
        //  for laptop
        lg:rounded-tr-[80px] lg:w-[900px] lg:ml-[0px] lg:h-[215px]
        // for desktop
         "
        >
          <div className="w-[250px] lg:mr-0">
            <h1 className="text-2xl lg:mx-[30px] w-[300px] font-bold
            // for small mobile
            xs:-ml-[20px]
            // for mobile
             sm:-ml-[35px]
            // for tablet
            md:-ml-[160px] md:text-2xl
            // for laptop
            lg:-ml-[300px] lg:mt-[10px]
             "
            >
              Support
            </h1>
            <h1
              className="lg:text-2xl lg:mx-[30px] py-1 lg:w- [400px] 
             // for small mobile
             xs:-ml-[20px]
             // for mobile
            sm:-ml-[30px]
              // for tablet
           md:w-[400px] md:-ml-[160px]
           lg:-ml-[300px] lg:w-[450px] lg:mt-[10px]
            "
            >
             Our team is available for your support and quries regarding Prices, newest Models and Brands whether you are a new buyer or old client!
            </h1>
          </div>
          <div className="md:ml-[300px] lg:ml-0 ">
            <img src={Support} alt="Support_icon" className="
            // for small mobile
            xs:w-[110px] xs:ml-[200px] xs:bottom-[10px]
            // for mobile
            sm:h-[70px] sm:w-[90px] sm:ml-[250px] relative sm:bottom-[15px]
            // for tablet
           md:relative md:bottom-[80px] md:ml-[180px] md:h-[120px] md:w-[120px]
          //for laptop
           lg:relative lg:bottom-[120px] lg:ml-[670px] lg:h-[160px] lg:w-[250px]
            " />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center bg-yellow-500 rounded-tr-[80px] rounded-bl-[80px] lg:rounded-bl-[50px] lg:rounded-tr-[80px]
          // for small mobiles
        xs:w-[280px] xs:ml-[25px] xs:h-[200px]
        // for mobile
         sm:w-[310px] sm:ml-[50px]
        //  for tablet
         md:w-[640px] md:ml-[100px] md:h-[180px]
        //  for laptop
         lg:w-[900px] lg:ml-[340px]
        "
        >
          <div className="lg:mr-0">
            <h1
              className="text-2xl font-bold
              xs:ml-[8px]
              sm:w-[300px] sm:ml-[20px]
            md:mr-[310px]
            lg:mx-[30px] ">
              Versatility
            </h1>
            <h1
              className="lg:text-2xl lg:mx-[30px] py-1 
            // for small mobile
            xs:ml-[8px]
            // for mobile
            sm:w-[300px] sm:ml-[20px]
            // for tablet
            // md:mr-[100px]
            //  for laptop
           lg:w-[420px]
             ">
         Here is not only Cars but you can also avail Bikes and Cycles of every Model and Brand in suitable prices from lowest to highest with the discount and instalment!
            </h1>
          </div>
          <div className="">
            <img
              src={Yamaha_MC}
              alt="Bike_image"
              className="
              // for small mobile
              xs:relative xs:bottom-[35px] xs:ml-[180px] xs:w-[100px]
              // for mobile
              sm:w-[100px] sm:ml-[200px] relative sm:bottom-[10px] sm:right-[3px]
              // for tablet
              md:ml-[450px] md:w-[170px] md:relative md:bottom-[100px] md:left-[1px]
              // for laptop
              lg:w-[190px] lg:ml-[80px] lg:mt-[250px] lg:
              "
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Features;
