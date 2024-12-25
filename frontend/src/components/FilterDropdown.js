import { useState } from "react";

const FilterDropdown = ({ categories, placeholder, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const handleOptionClick = (value) => {
    setSelectedValue(value);
    onFilterChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-center">
      {/* Dropdown button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border px-4 py-2 rounded-md bg-black text-white w-[100px] text-center"
      >
        {selectedValue === null ? placeholder : selectedValue}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-[100px] bg-white border rounded-md shadow-lg">
          <ul className="py-1">
            {/* Reset option */}
            <li
              onClick={() => handleOptionClick(null)}
              className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer"
            >
              {placeholder}
            </li>
            {/* Category options */}
            {categories.map((category, index) => (
              <li
                key={index}
                onClick={() => handleOptionClick(category.label)}
                className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer"
              >
                {category.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
