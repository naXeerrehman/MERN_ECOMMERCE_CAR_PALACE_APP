import React from "react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const navigate = useNavigate();
  const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];

  const handleRemoveFromWishlist = (vehicleId) => {
    const updatedWishlistItems = wishlistItems.filter(
      (item) => item._id !== vehicleId
    );
    localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlistItems));
    window.location.reload(); // Reload the page to reflect changes
  };

  return (
    <div className="container flex flex-col lg:mx-[50px] mt-5 p-4">
      <h2 className="text-3xl text-center font-semibold mb-6">Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <p className="text-red-500 text-center">Your wishlist is empty.</p>
      ) : (
        <ul className="w-[600px] mx-auto">
          {wishlistItems.map((vehicle) => (
            <li
              key={vehicle._id}
              className="flex justify-between mb-3 border border-black pb-2 px-2"
            >
              <div className="flex items-center ">
                {/* Display vehicle image */}
                <img
                  src={vehicle.imageUrls[0]} // Assuming the vehicle object has imageUrls
                  alt={vehicle.model}
                  className="w-[100px] h-[70px] mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold">{vehicle.model}</h3>
                  <p>{vehicle.type}</p>
                  <p>{vehicle.brand}</p>
                  <p className="text-lg font-bold text-green-600">
                    Price:${vehicle.price} {/* Display vehicle price */}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => navigate(`/vehicleDetail/${vehicle._id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleRemoveFromWishlist(vehicle._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
