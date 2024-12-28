import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import TextEditor from "./TextEditor";
const EditVehicle = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate(); // Navigate function for redirection
  const [vehicle, setVehicle] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    brand: "",
    model: "",
    price: "",
    stock: "",
    description: "",
    images: [],
  });
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch vehicle details on mount
  useEffect(() => {
    if (!vehicleId) {
      setError("Vehicle ID is missing");
      setLoading(false);
      return;
    }

    const fetchVehicle = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/vehicles/${vehicleId}`
        );
        setVehicle(response.data);
        setFormData({
          type: response.data.type,
          brand: response.data.brand,
          model: response.data.model,
          price: response.data.price,
          stock: response.data.stock,
          description: response.data.description,
          images: [], // Reset file uploads
        });
        setExistingImages(response.data.imageUrls || []); // Save existing image URLs
        setLoading(false);
      } catch (err) {
        setError("Error fetching vehicle details");
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: [...e.target.files] });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleRemoveExistingImage = (index) => {
    const updatedExistingImages = [...existingImages];
    updatedExistingImages.splice(index, 1);
    setExistingImages(updatedExistingImages);
  };

  const handleRemoveNewImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!vehicleId) {
      setError("Vehicle ID is missing");
      return;
    }

    try {
      const form = new FormData();

      // Add form data fields
      for (const key in formData) {
        if (key === "images") {
          // If new images are selected, add them
          formData.images.forEach((file) => form.append("images", file));
        } else {
          form.append(key, formData[key]);
        }
      }

      // If no new images are selected, send the existing images
      if (formData.images.length === 0) {
        existingImages.forEach((image) => form.append("images", image));
      }

      // Include existing images to avoid losing them
      form.append("existingImages", JSON.stringify(existingImages));

      // Send the form data to the backend
      const response = await axios.put(
        `http://localhost:5000/api/vehicles/${vehicleId}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccess(response.data.message);
      setVehicle(response.data.vehicle);

      // Redirect to /Shop after 3 seconds
      setTimeout(() => {
        navigate("/Shop");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating vehicle");
    }
  };

  if (loading)
    return (
      <>
        <div className="p-4 lg:mt-[20px] lg:ml-[580px]">
          <FontAwesomeIcon
            icon={faCar}
            size="3x"
            className="animate-zoomInOut" // Apply the zoom-in/zoom-out animation
          />
          <div className="font-bold mr-5 mt-2">Loading...</div>
        </div>
      </>
    );
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <form
        className="flex flex-col items-center w-full max-w-md mx-auto"
        onSubmit={handleSubmit}
      >
        <h1 className="bg-black text-white w-full text-2xl rounded-sm p-2 font-semibold text-center">
          Edit Vehicle
        </h1>
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex flex-col gap-y-4 w-full">
          <div>
            <label>Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="border border-gray-700 px-2 rounded-sm w-full py-1"
              required
            />
          </div>

          <div>
            <label>Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="border border-gray-700 px-2 rounded-sm w-full py-1"
              required
            />
          </div>

          <div>
            <label>Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="border border-gray-700 px-2 rounded-sm w-full py-1"
              required
            />
          </div>

          <div>
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border border-gray-700 px-2 rounded-sm w-full py-1"
              required
            />
          </div>

          <div>
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="border border-gray-700 px-2 rounded-sm w-full py-1"
              required
            />
          </div>

          <div>
            <label>Description</label>
            <TextEditor
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Enter a detailed description for the vehicle"
            />
          </div>

          <div className="flex flex-col">
            <label>Upload New Images</label>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleImageChange}
            />
          </div>

          {existingImages.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl">Existing Images:</h2>
              <div className="flex flex-wrap gap-4 mt-2">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`existing-image-${index}`}
                      className="w-[170px] h-20 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.images.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl">New Images:</h2>
              <div className="flex flex-wrap gap-4 mt-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`new-image-${index}`}
                      className="w-[170px] h-20 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-[18px] flex items-center justify-center"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {success && (
            <p className="text-green-500 text-center font-semibold border border-black mt-2 w-[300px] rounded-md ">
              {success}
            </p>
          )}
           <p className="relative bottom-[10px] font-bold">
            Image of h-260px and w-510px makes better UI
          </p>
          <button
            type="submit"
            disabled={loading}
            className={`bg-black text-white w-full rounded-sm text-lg p-2 font-semibold relative bottom-[20px]${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Edit Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditVehicle;
