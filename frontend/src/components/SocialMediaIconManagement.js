import React, { useState } from "react";

const SocialMediaIonManagement = () => {
  const [icons, setIcons] = useState([]);
  const [newIcon, setNewIcon] = useState({
    image: null, // For image file
    link: "", // For link
  });

  const handleAddIcon = async () => {
    try {
      const formData = new FormData();
      formData.append("link", newIcon.link); // Add link
      formData.append("image", newIcon.image); // Add image

      const response = await fetch("http://localhost:5000/api/icons", {
        method: "POST",
        body: formData,
      });
      const createdIcon = await response.json();
      setIcons([...icons, createdIcon]);
      setNewIcon({ image: null, link: "" }); // Clear form
    } catch (error) {
      console.error("Failed to add icon", error);
    }
  };

  return (
    <div className="p-4 w-[630px] lg:w-[650px] mx-auto border border-black mt-[20px]">
      <h2 className="text-xl font-semibold mb-4">Manage Icons</h2>

      <div className="mb-4">
        <div className="flex flex-col mb-2">
          <label htmlFor="icon-link" className="font-medium mb-1">
            Icon Link:
          </label>
          <input
            id="icon-link"
            type="text"
            placeholder="Enter icon link"
            value={newIcon.link}
            onChange={(e) =>
              setNewIcon({ ...newIcon, link: e.target.value })
            }
            className="border p-2"
          />
        </div>

        <div className="flex flex-col mb-2">
          <label htmlFor="icon-image" className="font-medium mb-1">
            Upload Image:
          </label>
          <input
            id="icon-image"
            type="file"
            accept="image/*"
            onChange={(e) => setNewIcon({ ...newIcon, image: e.target.files[0] })}
            className="border p-2"
          />
        </div>

        <button
          onClick={handleAddIcon}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          Add Icon
        </button>
        <p>
          <span className="font-bold">Pro tip:</span> To add a WhatsApp number,
          replace your number here: "https://wa.me/0123456789" and add in the link.
        </p>
      </div>
    </div>
  );
};

export default SocialMediaIonManagement;
