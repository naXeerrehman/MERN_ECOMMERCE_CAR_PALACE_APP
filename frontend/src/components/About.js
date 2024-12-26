import React, { useState } from "react";
import axios from "axios";
import TextEditor from "./TextEditor";

const UploadVehicle = () => {
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("type", type);
    formData.append("model", model);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description);
    if (images) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/vehicles/create-vehicle",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Vehicle created:", response.data);
      setMessage("Vehicle created successfully!");
      setLoading(false);
    } catch (error) {
      console.error(
        "Error creating vehicle:",
        error.response?.data || error.message
      );
      setMessage("Error creating vehicle. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form
        className="flex flex-col items-center w-full max-w-md mx-auto"
        onSubmit={handleSubmit}
      >
        <h1 className="bg-black text-white w-full text-2xl rounded-sm p-2 font-semibold text-center">
          Upload Vehicle
        </h1>
        <div className="flex flex-col gap-y-4 w-full">
          <div>
            <label>Type</label>
            <input
              type="text"
              placeholder="Enter Vehicle Type (Car, Motorcycle, Cycle)"
              value={type}
              className="border border-gray-700 px-2 rounded-sm w-full py-1"
              required
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div>
            <label>Model</label>
            <input
              type="text"
              placeholder="Enter Vehicle Model"
              value={model}
              className="border border-gray-700 px-2 rounded-sm w-full py-1"
              required
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
          <div>
            <label>Brand</label>
            <input
              type="text"
              placeholder="Enter Vehicle Brand"
              value={brand}
              className="border border-gray-700 px-2 rounded-sm w-full py-1"
              required
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
          <div>
            <label>Price</label>
            <input
              type="number"
              placeholder="Enter Vehicle Price"
              value={price}
              className="border border-gray-700 px-2 rounded-sm w-full py-1"
              required
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label>Stock</label>
            <input
              type="number"
              placeholder="Enter Stock Quantity"
              value={stock}
              className="border border-gray-700 px-2 rounded-sm w-full py-1"
              required
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div>
            <label>Description</label>
            <TextEditor
              value={description}
              onChange={setDescription}
              placeholder="Enter a detailed description for the vehicle"
            />
          </div>

          <div>
            <label>Images</label>
            <input
              type="file"
              multiple
              required
              className="border border-gray-700 px-2 rounded-sm w-full py-1"
              onChange={handleFileChange}
            />
          </div>

          {images.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl">Selected Images:</h2>
              <div className="flex flex-wrap gap-4 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`image-${index}`}
                      className="w-[160px] h-20 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {message && (
            <div
              className={`mb-2 mt-2 border border-black px-2 rounded-md text-lg ${
                message.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`bg-black text-white w-full rounded-sm text-lg p-2 font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Uploading..." : "Upload Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadVehicle;
