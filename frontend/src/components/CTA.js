import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faMotorcycle,
  faBicycle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <div className="bg-yellow-500 text-white py-10 px-6 mt-[80px]">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-3">Discover. Manage. Drive.</h2>
          <p className="text-lg">
            Explore and manage vehicles effortlessly with our advanced
            solutions.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
          {/* Feature 1 */}
          <div className="p-6 bg-yellow-600 rounded-lg shadow-lg hover:shadow-xl transition">
            <FontAwesomeIcon
              icon={faCar}
              size="3x"
              className="text-white mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Car Management</h3>
            <p>
              Easily add, search, and sort cars with comprehensive management
              tools.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-yellow-600 rounded-lg shadow-lg hover:shadow-xl transition">
            <FontAwesomeIcon
              icon={faMotorcycle}
              size="3x"
              className="text-white mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Motorcycle Listings</h3>
            <p>
              Keep track of your motorcycles with efficient and user-friendly
              tools.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="p-6 bg-yellow-600 rounded-lg shadow-lg hover:shadow-xl transition">
            <FontAwesomeIcon
              icon={faBicycle} // Assuming you want a bicycle icon for "Cycle Listings"
              size="3x"
              className="text-white mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Cycle Listings</h3>
            <p>
              Keep track of your cycles with efficient and user-friendly tools.
            </p>
          </div>
        </div>
        {/* Call-to-Action Button */}
        <div className="text-center mt-8">
          <Link
            to="/Shop"
            className="bg-white text-black font-semibold py-3 px-8 rounded-lg hover:bg-gray-300 transition"
          >
            Explore Vehicles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CTA;
