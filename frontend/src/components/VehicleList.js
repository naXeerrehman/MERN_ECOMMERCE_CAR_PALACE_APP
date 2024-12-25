import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import SortDropdown from "./SortDropdown";
import FilterDropdown from "./FilterDropdown";
import {
  faStar,
  faCar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../App.css";
const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ type: "" });
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState({});

  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem("categories");
    return savedCategories ? JSON.parse(savedCategories) : [];
  });

  const vehiclesPerPage = 6;

  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedwishlistItems = localStorage.getItem("wishlistItems");
    return savedwishlistItems ? JSON.parse(savedwishlistItems) : [];
  });

  // Fetch vehicles and brands from the API
  const fetchVehiclesAndBrands = async () => {
    setIsLoading(true); // Set loading to true before fetching
    try {
      const vehicleResponse = await axios.get(
        "http://localhost:5000/api/vehicles"
      );
      setVehicles(vehicleResponse.data);

      const brandResponse = await axios.get(
        "http://localhost:5000/api/vehicles/brands"
      );
      setBrands(brandResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Set loading to false once data is fetched
    }
  };

  useEffect(() => {
    fetchVehiclesAndBrands();
  }, []);

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

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${vehicleId}`);
      setDeleteSuccess("Vehicle deleted successfully!");
      setTimeout(() => {
        setDeleteSuccess("");
      }, 3000);

      // Fetch updated vehicle data after deletion
      fetchVehiclesAndBrands();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const vehicleTypes = [...new Set(vehicles.map((vehicle) => vehicle.type))];

  const filteredVehicles = vehicles.filter((vehicle) => {
    const vehicleModel = vehicle.model || ""; // Default to empty string if null/undefined
    const vehicleBrand = vehicle.brand || "";
    const vehicleType = vehicle.type || "";

    return (
      (vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicleType.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.type === "" ||
        vehicleType.toLowerCase() === filters.type.toLowerCase())
    );
  });

  const handleFilterChange = (selectedValue) => {
    setFilters({ type: selectedValue || "" }); // Default to an empty filter
    setFilterValue(selectedValue || "");
  };

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (sortType === "price") {
      return a.price - b.price;
    } else if (sortType === "model") {
      return a.model.localeCompare(b.model);
    } else if (sortType === "brand") {
      return a.brand.localeCompare(b.brand, undefined, { sensitivity: "base" });
    } else {
      return 0;
    }
  });

  const totalPages = Math.ceil(sortedVehicles.length / vehiclesPerPage);
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = sortedVehicles.slice(
    indexOfFirstVehicle,
    indexOfLastVehicle
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalWishlistItems = wishlistItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const fetchReviews = async (vehicleId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviews/${vehicleId}`
      );
      setReviews((prev) => ({ ...prev, [vehicleId]: response.data }));
    } catch (error) {
      console.error(`Error fetching reviews for vehicle ${vehicleId}:`, error);
    }
  };

  useEffect(() => {
    vehicles.forEach((vehicle) => fetchReviews(vehicle._id));
  }, [vehicles]);

  return (
    <div className="pt-3">
      {deleteSuccess && (
        <div className="bg-green-500 w-[600px] text-white text-center p-2 rounded-md mb-4 mx-auto">
          {deleteSuccess}
        </div>
      )}

      {/* Display loading state */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center mt-5">
          <FontAwesomeIcon
            icon={faCar}
            size="3x"
            className="animate-zoomInOut" // Apply the zoom-in/zoom-out animation
          />
          <div className="font-bold ml-2 mt-2">Loading...</div>
        </div>
      ) : (
        <>
          {/* Your normal component rendering (vehicles, filters, etc.) */}
          <div className="flex justify-between items-center mb-4 w-[600px] lg:w-[850px] mx-auto">
            <div className="flex space-x-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vehicles..."
                className="border px-4 py-2 rounded-md"
              />
              <SortDropdown
                value={sortType}
                onChange={setSortType}
                options={[
                  { value: "price", label: "Price" },
                  { value: "model", label: "Model" },
                  { value: "brand", label: "Brand" },
                ]}
              />
              <FilterDropdown
                categories={categories}
                placeholder="Filter"
                onFilterChange={handleFilterChange}
                className="bg-black"
              />
            </div>

            <div className="flex flex-col gap-y-1 lg:flex-row gap-x-3">
              <Link
                to="/Wishlist"
                className="text-white bg-black px-4 py-2 rounded-md flex items-center space-x-2 relative"
              >
                <span>Wish list</span>
                {totalWishlistItems > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
                    {totalWishlistItems}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="text-white bg-black px-4 py-2 rounded-md flex items-center space-x-2 relative"
              >
                <FaShoppingCart />
                <span>Cart</span>
                {totalCartItems > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
                    {totalCartItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
          {/* Your vehicle list grid and pagination */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-[580px] lg:w-[850px] mx-auto">
            {currentVehicles.map((vehicle) => {
              const vehicleReviews = reviews[vehicle._id] || [];
              const totalRatings = vehicleReviews.reduce(
                (total, review) => total + (review.rating || 0),
                0
              );
              const averageRating = vehicleReviews.length
                ? totalRatings / vehicleReviews.length
                : 0;

              return (
                <div
                  key={vehicle._id}
                  className="border p-1 rounded-md shadow-md mx-auto hover:shadow-2xl"
                >
                  <Link to={`/vehicleDetail/${vehicle._id}`}>
                    <img
                      src={vehicle.imageUrls && vehicle.imageUrls[0]}
                      alt={`${vehicle.model} - ${vehicle.brand}`}
                      className="w-[230px] h-[110px] object-cover mb-2 mx-auto"
                    />
                    {/* Reviews with stars */}
                    <div className="flex items-center mt-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={
                            i + 1 <= Math.floor(averageRating)
                              ? faStar
                              : i + 1 <= averageRating
                              ? faStarHalfAlt
                              : faRegStar
                          }
                          className="text-yellow-500"
                        />
                      ))}
                      <span className="ml-2 text-gray-700">
                        ({vehicleReviews.length})
                      </span>
                    </div>
                    <h3 className="text-xl">{vehicle.model}</h3>
                  </Link>
                  <p className="mb-1">Price: ${vehicle.price}</p>
                  <div>
                    {cartItems.find((item) => item._id === vehicle._id)
                      ?.quantity >= vehicle.stock ? (
                      <button
                        disabled
                        className="bg-gray-400 text-white px-4 py-1 mr-1 rounded-md cursor-not-allowed"
                      >
                        Out of Stock
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(vehicle)}
                        className="bg-black text-white hover:text-black border-black border-2 hover:bg-white px-3 mr-2 rounded-md"
                      >
                        Add to Cart
                      </button>
                    )}
                    <Link
                      to={`/EditVehicle/${vehicle._id}`}
                      className="bg-yellow-500 text-white px-4 py-1 rounded-md"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteVehicle(vehicle._id)}
                      className="bg-red-500 text-white px-4 py-1 rounded-md ml-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          ;{/* Pagination */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-black text-white rounded-md mx-2 disabled:opacity-50"
            >
              Previous
            </button>

            {[...Array(totalPages).keys()].map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber + 1)}
                className={`px-4 py-2 mx-1 rounded-md ${
                  currentPage === pageNumber + 1
                    ? "bg-black text-white"
                    : "bg-gray-300"
                }`}
              >
                {pageNumber + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-black text-white rounded-md mx-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VehicleList;
