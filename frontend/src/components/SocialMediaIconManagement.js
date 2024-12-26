import React, { useState, useEffect } from "react";

const IconManager = () => {
  const [icons, setIcons] = useState([]);
  const [newIcon, setNewIcon] = useState({
    name: "",
    image: null, // For image file
    link: "", // For link
  });
  const [editingIcon, setEditingIcon] = useState(null); // For editing
  const [loading, setLoading] = useState(true); // Track loading state

  const handleAddIcon = async () => {
    try {
      const formData = new FormData();
      formData.append("link", newIcon.link); // Add link
      formData.append("image", newIcon.image);

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

  const handleEditIcon = async () => {
    try {
      const formData = new FormData();
      formData.append("link", editingIcon.link); // Add link
      formData.append("image", editingIcon.image);

      const response = await fetch(
        `http://localhost:5000/api/icons/${editingIcon._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      const updatedIcon = await response.json();
      setIcons((prevIcons) =>
        prevIcons.map((icon) =>
          icon._id === updatedIcon._id ? updatedIcon : icon
        )
      );
      setEditingIcon(null); // Close edit mode
    } catch (error) {
      console.error("Failed to edit icon", error);
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
            value={editingIcon ? editingIcon.link : newIcon.link}
            onChange={(e) =>
              editingIcon
                ? setEditingIcon({ ...editingIcon, link: e.target.value })
                : setNewIcon({ ...newIcon, link: e.target.value })
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
            onChange={(e) =>
              editingIcon
                ? setEditingIcon({ ...editingIcon, image: e.target.files[0] })
                : setNewIcon({ ...newIcon, image: e.target.files[0] })
            }
            className="border p-2"
          />
        </div>

        <button
          onClick={editingIcon ? handleEditIcon : handleAddIcon}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          {editingIcon ? "Update Icon" : "Add Icon"}
        </button>
        {editingIcon && (
          <button
            onClick={() => setEditingIcon(null)}
            className="bg-red-500 text-white px-4 py-2 rounded-md ml-2"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default IconManager;
