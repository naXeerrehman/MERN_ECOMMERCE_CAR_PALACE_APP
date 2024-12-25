import { useState } from "react";

const SortDropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelection = (selectedValue) => {
    if (selectedValue === "") {
      onChange(null); // Reset sorting when "Sort by" is selected
    } else {
      onChange(selectedValue); // Apply sorting by selected value
    }
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleDropdown}
        className="border px-4 py-2 rounded-md bg-black text-white w-[100px]"
      >
        {value || "Sort by"}
      </button>

      {isOpen && (
        <div className="absolute bg-white text-black shadow-md rounded-md mt-2 w-[100px] text-center z-10">
          {/* "Sort by" option */}
          <div
            onClick={() => handleSelection("")} // Reset sorting
            className="px-2 py-2 cursor-pointer hover:bg-black hover:text-white w-[100px]"
          >
            Sort by
          </div>

          {/* Sorting options */}
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelection(option.value)}
              className="px-4 py-2 cursor-pointer hover:bg-black hover:text-white"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
