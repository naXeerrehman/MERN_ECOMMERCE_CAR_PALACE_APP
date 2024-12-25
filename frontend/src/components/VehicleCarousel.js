import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import "../App.css";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });
  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/vehicles");
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Custom arrows
  const CustomPrevArrow = ({ onClick }) => (
    <div
      className="absolute border p-2 rounded-full bg-white cursor-pointer z-50
      // for small mobile
      xs:mt-[75px] xs:-left-[12px]
      // for mobile
      sm:bottom-[100px] sm:-left-[5px]
      // for tablet
      md:-ml-[30px]
      lg:top-[10px] lg:left-[20px] lg:text-2xl
      "
      onClick={onClick}
    >
      <FaChevronLeft />
    </div>
  );

  const CustomNextArrow = ({ onClick }) => (
    <div
      className="absolute border rounded-full shadow bg-white cursor-pointer z-10
      xs:bottom-[105px] xs:left-[280px]
      sm:left-[330px] sm:bottom-[100px] sm:w-[25px] sm:h-[25px] sm:px-1 sm:py-1 
      md:ml-[375px] md:bottom-[105px] md:w-[40px]
     lg:text-2xl lg:bottom-[110px] lg:left-[780px]"
      onClick={onClick}
    >
      <FaChevronRight />
    </div>
  );

  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Default to 3 slides
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 768, // For small screens
        settings: {
          slidesToShow: 2, // Show 2 slides on small screens
        },
      },
      {
        breakpoint: 480, // For extra-small screens
        settings: {
          slidesToShow: 1, // Show 1 slide on extra-small screens
        },
      },
    ],
  };

  const handleAddToCart = (vehicle) => {
    const existingItem = cartItems.find((item) => item._id === vehicle._id);

    // Check if the total quantity matches the stock
    if (existingItem && existingItem.quantity >= vehicle.stock) {
      return; // Prevent adding more items
    }

    let updatedCartItems;

    if (existingItem) {
      updatedCartItems = cartItems.map((item) =>
        item._id === vehicle._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCartItems = [...cartItems, { ...vehicle, quantity: 1 }];
    }

    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  return (
    <div className="mt-3 relative">
      {isLoading ? (
        <div className="flex flex-col justify-center items-center mt-[50px]">
          <FontAwesomeIcon
            icon={faCar}
            size="3x"
            className="animate-zoomInOut" // Apply the animation class
          />
          <div className="font-bold ml-2 mt-2">Loading...</div>
        </div>
      ) : (
        <>
          <div
            className="flex justify-between items-center relative top-5 w-[580px] 
          // for small mobile
          xs:w-[290px] xs:ml-[10px]
          // for mobile
          sm:w-[355px] sm:ml-[0px] sm:relative sm:top-[40px]
          // for tablet
         md:w-[700px] md:ml-[30px]
           // for laptop
          lg:w-[1110px] lg:ml-[80px] lg:text-2xl
           "
          >
            <h1 className="font-semibold ml-[10px] mb-0">
              Browse Our Collection
            </h1>
            <Link to="/Shop" className="font-semibold">
              View All
            </Link>
          </div>

          <Slider
            {...settings}
            className="mt-[20px] border border-yellow-500
            xs:w-[290px] xs:h-[210px] xs:ml-[20px] x
            sm:w-[350px] sm:mt-[40px] sm:m-[10px]
            md:w-[700px] md:ml-[35px]
            lg:w-[1200px] lg:h-[225px] lg:ml-[40px]
            "
          >
            {vehicles.map((vehicle) => (
              // Carousel Card
              <div>
                <Link to={`/vehicleDetail/${vehicle._id}`}>
                  <img
                    src={vehicle.imageUrls && vehicle.imageUrls[0]} // Access the first image URL
                    alt={`${vehicle.model} - ${vehicle.brand}`}
                    className="
                        xs:w-[250px]
                        md:w-[220px]
                        lg:w-[290px] lg:h-[150px] object-cover rounded-md p-1 mx-auto                    "
                  />
                  <div className="flex justify-between
                    mr-[10px]">
                    <h3 className="text-lg mt-2 ml-[15px] w-[200px]
                    lg:ml-[10px]">{vehicle.model}</h3>
                    <p className="text-lg mt-2 ml-[40px]">
                      Price: ${vehicle.price}
                    </p>
                  </div>
                </Link>

                <div className="ml-[20px] xs:relative xs:bottom-[20px] right-[10px]
                lg:bottom-[0px]">
                  {cartItems.find((item) => item._id === vehicle._id)
                    ?.quantity >= vehicle.stock ? (
                    <button
                      disabled
                      className="bg-gray-400 text-white px-4 py-1 rounded-md cursor-not-allowed "
                    >
                      Out of Stock
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(vehicle)}
                      className="bg-black text-white px-4 py-1 mr-2 rounded-md"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </Slider>
        </>
      )}
    </div>
  );
};

export default VehicleList;
