import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [loading, setLoading] = useState(true); 

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/vehicles");
      setVehicles(response.data);
      setLoading(false); 
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${vehicleId}`);
      setDeleteSuccess("Vehicle deleted successfully!");
      setTimeout(() => {
        setDeleteSuccess("");
      }, 3000);

      // Fetch updated vehicle data after deletion
      fetchVehicles();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  return (
    <div className="mt-3">
      {deleteSuccess && (
        <div className="bg-green-500 w-[600px] text-white text-center p-2 rounded-md mb-4 mx-auto">
          {deleteSuccess}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col justify-center items-center mt-5">
          <FontAwesomeIcon
            icon={faCar}
            size="3x"
            className="animate-zoomInOut" // Apply zoom-in/zoom-out animation
          />
          <div className="font-bold ml-2 mt-2">Loading...</div>
        </div>
      ) : (
        <div>
          <table className="w-[600px] -ml-[10px] lg:w-[700px] border-collapse lg:mx-auto">
            <thead>
              <tr>
                <th className="border py-1 px-2 text-center">S/N</th>
                <th className="border py-1 px-2 text-center w-[50px]">Type</th>
                <th className="border py-1 px-2 text-center">Model</th>
                <th className="border py-1 px-2 text-center w-[50px]">Stock</th>
                <th className="border py-1 px-2 text-center w-[50px]">Price</th>
                <th className="border py-1 px-2 text-center w-[]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle, index) => (
                <tr key={vehicle._id}>
                  <td className="border py-1 px-2 text-center w-[50px]">
                    {index + 1}
                  </td>
                  <td className="border py-1 px-2 w-[50px] text-center">
                    {vehicle.type}
                  </td>
                  <td className="border py-1 px-2 w-[50px] mx-auto">
                    {vehicle.model}
                  </td>
                  <td className="border py-1 px-2 text-center">
                    {vehicle.stock}
                  </td>
                  <td className="border py-1 px-2 w-[50px]">
                    ${vehicle.price}
                  </td>
                  <td className="border py-1 px-2 w-[100px]">
                    <Link
                      to={`/EditVehicle/${vehicle._id}`}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-md mr-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteVehicle(vehicle._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VehicleList;
