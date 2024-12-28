import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaMinus } from "react-icons/fa";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import "../App.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const VehicleDetail = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentLargeImageIndex, setCurrentLargeImageIndex] = useState(0);

  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  const [quantity, setQuantity] = useState(1);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [wishlistItems, setWishlistItems] = useState(
    JSON.parse(localStorage.getItem("wishlistItems")) || []
  );
  const navigate = useNavigate();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2);

  // Fetch vehicle details
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/vehicles/${id}`
        );
        setVehicle(response.data);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/Reviews/${id}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [id]);

  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  const averageRating = calculateAverageRating();

  // Rating distribution logic
  const ratingDistribution = [1, 2, 3, 4, 5].map(
    (star) => reviews.filter((review) => review.rating === star).length
  );

  // Image slideshow
  useEffect(() => {
    if (vehicle?.imageUrls?.length > 1) {
      const interval = setInterval(() => {
        setCurrentLargeImageIndex(
          (prevIndex) => (prevIndex + 1) % vehicle.imageUrls.length
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [vehicle]);

  const handleIncrease = () => {
    if (quantity < vehicle.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleAddToCart = () => {
    if (vehicle.stock === 0) return; // Don't add if stock is 0

    // Check if the cart already contains this vehicle and update the quantity if it does
    const updatedCartItems = [...cartItems];
    const existingItemIndex = updatedCartItems.findIndex(
      (item) => item._id === vehicle._id
    );

    if (existingItemIndex !== -1) {
      // If the vehicle is already in the cart, update its quantity
      const existingItem = updatedCartItems[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;

      // Check if the updated quantity exceeds the stock
      if (newQuantity <= vehicle.stock) {
        existingItem.quantity = newQuantity;
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      } else {
        alert("You cannot add more than the available stock.");
      }
    } else {
      // If the vehicle is not in the cart, add it
      if (quantity <= vehicle.stock) {
        updatedCartItems.push({ ...vehicle, quantity });
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      } else {
        alert("You cannot add more than the available stock.");
      }
    }
  };

  if (!vehicle) {
    return (
      <div className="flex flex-col justify-center items-center mt-5">
        <FontAwesomeIcon
          icon={faCar}
          size="3x"
          className="animate-zoomInOut" // Apply the animation class
        />
        <div className="font-bold ml-2 mt-2">Loading...</div>
      </div>
    );
  }

  const handleAddToWishlist = () => {
    const updatedWishlistItems = [...wishlistItems];
    const isItemInWishlist = updatedWishlistItems.some(
      (item) => item._id === vehicle._id
    );

    if (!isItemInWishlist) {
      updatedWishlistItems.push(vehicle);
      setWishlistItems(updatedWishlistItems);
      localStorage.setItem(
        "wishlistItems",
        JSON.stringify(updatedWishlistItems)
      );
    } else {
      alert("This vehicle is already in your wishlist.");
    }
  };

  return (
    <div className="container flex flex-col lg:mx-[50px] mt-2 p-4">
      {/* Vehicle detail */}
      <h1 className="text-3xl ml-[200px] lg:ml-[430px] font-bold mb-3 bg-black text-white text-center w-[250px] rounded-md py-2">
        Vehicle Details
      </h1>
      <div className="lg:flex gap-x-[50px]">
        {/* Vehicle images */}
        <div>
          <img
            src={vehicle.imageUrls[currentLargeImageIndex]}
            alt={`${vehicle.model} - ${vehicle.brand}`}
            className="p-1 w-[520px] lg:w-[700px] h-[260px] lg:h-[360px] object-cover mb-4 border border-black rounded-md"
          />
          <div className="flex space-x-4 mt-4">
            {vehicle.imageUrls.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`${vehicle.model} - ${vehicle.brand} ${index + 1}`}
                className={`w-[190px] h-[100px] ${
                  index === currentLargeImageIndex
                    ? "border border-black  rounded-md"
                    : ""
                }`}
                onClick={() => setCurrentLargeImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Vehicle detail */}
        <div className="w-[300px] mx-[120px] lg:mx-0 relative bottom-[40px]">
          <div className="flex items-center mt-5">
            {Array.from({ length: 5 }, (_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={i < Math.round(averageRating) ? faStar : faRegStar}
                className="text-yellow-500"
              />
            ))}
            <span className="ml-2 text-gray-700">({reviews.length})</span>
          </div>
          <table className="table-auto w-[400px] text-center border-collapse border border-gray-300">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="py-2 pr-4 text-lg font-bold text-gray-700 border-gray-300">
                  Model:
                </td>
                <td className="py-2 text-lg text-gray-700 border-r border-gray-300">
                  {vehicle.model}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 pr-4 text-lg font-bold text-gray-700 border-gray-300">
                  Type:
                </td>
                <td className="py-2 text-lg text-gray-700 border-r border-gray-300">
                  {vehicle.type}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 pr-4 text-lg font-bold text-gray-700 border-gray-300">
                  Brand:
                </td>
                <td className="py-2 text-lg text-gray-700 border-r border-gray-300">
                  {vehicle.brand}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 pr-4 text-lg font-bold text-gray-700 border-gray-300">
                  Price:
                </td>
                <td className="py-2 text-lg text-gray-700">{vehicle.price}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 pr-4 text-lg font-bold text-gray-700 border-gray-300">
                  Stock:
                </td>
                <td className="py-2 text-lg text-gray-700">{vehicle.stock}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex items-center mt-4">
            <button
              onClick={handleDecrease}
              className="bg-red-500 text-white px-2 py-1 rounded-md"
            >
              <FaMinus />
            </button>
            <span className="mx-4 text-lg">{quantity}</span>
            <button
              onClick={handleIncrease}
              disabled={quantity >= vehicle.stock}
              className={`px-2 py-1 rounded-md ${
                quantity >= vehicle.stock
                  ? "bg-gray-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              <FaPlus />
            </button>
          </div>

          <div className="mt-4 flex gap-x-2">
            <button
              onClick={handleAddToCart}
              disabled={vehicle.stock === 0 || quantity === vehicle.stock}
              className={`px-4  rounded-md ${
                vehicle.stock === 0 || quantity === vehicle.stock
                  ? "bg-gray-500 text-gray-300"
                  : "bg-black text-white"
              }`}
            >
              {vehicle.stock === 0 || quantity === vehicle.stock
                ? "Out of Stock"
                : "Add to Cart"}
            </button>

            <button
              onClick={handleAddToWishlist}
              className="px-4 py-2 bg-gray-700 text-white rounded-md"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-x-2">
        {/* Reviews section */}
        <div className="flex flex-col lg:flex-row lg:gap-x-[0px] items-center lg:-mt-[20px]">
          <div>
            <div className="-ml-[150px] lg:ml-0">
              {/* Reviews total count */}
              <div className="flex items-center mt-5">
                {Array.from({ length: 5 }, (_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={i < Math.round(averageRating) ? faStar : faRegStar}
                    className="text-yellow-500"
                  />
                ))}
                <span className="ml-2 text-gray-700">({reviews.length})</span>
              </div>
              {/* Review bar */}
              <div className="mt-4 w-[300px]">
                {ratingDistribution.map((count, index) => (
                  <div key={index} className="flex items-center">
                    {/* Display star icons based on the rating level */}
                    <div className="flex items-center mr-2">
                      {Array.from({ length: index + 1 }, (_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar} // Yellow star
                          className="text-yellow-500"
                        />
                      ))}
                    </div>
                    <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-yellow-500`}
                        style={{
                          width: `${
                            reviews.length > 0
                              ? (count / reviews.length) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="ml-2">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        {/* Reviews*/}
<div className="lg:w-[350px] mt-[40px] ml-[30px] w-[500px]">
  <h3 className="text-xl font-semibold">Reviews</h3>
  <div className="mt-2">
    {loadingReviews ? (
      <div className="flex flex-col justify-center items-center mt-[50px]">
        <FontAwesomeIcon
          icon={faCar}
          size="3x"
          className="animate-zoomInOut" // Apply the animation class
        />
        <div className="font-bold ml-2 mt-2">Loading Reviews...</div>
      </div>
    ) : reviews.length > 0 ? (
      displayedReviews.map((review, index) => (
        <div key={index} className="border p-2 my-2 w-full">
          <div className="flex mt-1">
            {Array.from({ length: 5 }, (_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={i < review.rating ? faStar : faRegStar}
                className="text-yellow-500"
              />
            ))}
          </div>
          <div className="flex flex-col items-center">
            <ReactQuill
              value={review.review || ""}
              readOnly={true}
              theme="snow"
              modules={{
                toolbar: false,
              }}
              className="w-full mx-auto react-quill mt-[5px] text-editor"
            />
            {/* Display Review Creation Time */}
            <div className="text-sm text-gray-500 -ml-[80px]">
              {/* Format and display the review creation date */}
              {review.createdAt && (
                <span>
                  Posted on:{" "}
                  {new Date(review.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      ))
    ) : (
      <p>No reviews available.</p>
    )}
  </div>
  {reviews.length > 2 && (
    <button
      onClick={() => setShowAllReviews((prev) => !prev)}
      className="px-4 py-2 rounded-md font-bold bg-black text-white"
    >
      {showAllReviews ? "See Less..." : "See More..."}
    </button>
  )}
</div>

        </div>

        {/* Description */}
        <div>
          <div className="text-xl bg-black text-white text-center w-[120px] rounded-md mb-2 mt-2 py-1.5 ml-[17px] lg:ml-[0px]">
            Description
          </div>

          <ReactQuill
            value={vehicle.description || ""}
            readOnly={true}
            theme="snow"
            modules={{
              toolbar: false,
            }}
            className="w-[550px] lg:w-[480px] mx-auto border-none text-editor "
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
