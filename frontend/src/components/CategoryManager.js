import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
const CategoryManager = ({
  onFilterApply,
}) => {
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [editedLabel, setEditedLabel] = useState("");
  const [categories, setCategories] = useState([]);
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Load categories from localStorage
  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem("categories"));
    if (storedCategories) {
      setCategories(storedCategories); 
    }
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  // Add a new category
  const handleAdd = () => {
    if (newCategory.trim()) {
      const category = {
        value: newCategory.toLowerCase(),
        label: capitalizeFirstLetter(newCategory),
      };
      setCategories((prevCategories) => {
        const updatedCategories = [...prevCategories, category];
        localStorage.setItem("categories", JSON.stringify(updatedCategories));
        return updatedCategories;
      });
      setNewCategory(""); // Clear the input after adding
    }
  };

  // Start editing a category
  const handleEditCategory = (category) => {
    setEditCategory(category);
    setEditedLabel(category.label);
  };

  // Save edited category
  const handleSaveEdit = () => {
    setCategories((prevCategories) => {
      const updatedCategories = prevCategories.map((cat) =>
        cat.value === editCategory.value
          ? { ...cat, label: capitalizeFirstLetter(editedLabel) }
          : cat
      );
      localStorage.setItem("categories", JSON.stringify(updatedCategories));
      return updatedCategories;
    });
    setEditCategory(null);
    setEditedLabel("");
  };

  // Delete a category
  const handleDelete = (categoryToDelete) => {
    setCategories((prevCategories) => {
      const filteredCategories = prevCategories.filter(
        (category) => category.value !== categoryToDelete
      );
      localStorage.setItem("categories", JSON.stringify(filteredCategories));
      return filteredCategories;
    });
  };

  return (
    <div className="p-4 border rounded-md w-[400px] mx-auto mt-3">
      <h2 className="text-lg font-semibold mb-4">Manage Categories</h2>

      {/* Add Category */}
      <div className="mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Add new category"
          className="border rounded-md px-2 py-1 w-full mb-2"
        />
        <button
          onClick={handleAdd}
          className="bg-black text-white rounded-md px-4 py-2 w-full"
        >
          Add Category
        </button>
      </div>

      {/* List and Edit/Delete Categories */}
      <div>
        {categories.map((category) => (
          <div
            key={category.value}
            className="flex justify-between items-center mb-2"
          >
            {editCategory?.value === category.value ? (
              <>
                <input
                  type="text"
                  value={editedLabel}
                  onChange={(e) => setEditedLabel(e.target.value)}
                  className="border rounded-md px-2 py-1 w-[70%]"
                />
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-500 text-white rounded-md px-2 ml-2"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span>{category.label}</span>
                <div>
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="text-yellow-500 mr-2"
                  >
                    <FaRegEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(category.value)}
                    className="text-red-500"
                  >
                    <MdDelete />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
