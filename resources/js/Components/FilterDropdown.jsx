import React, { useState } from "react";

const FilterDropdown = ({ label, options, selectedValues, setSelectedValues }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCheckboxChange = (value) => {
    const updatedValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];
    setSelectedValues(updatedValues);
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium">{label}</label>
      <div
        className={`relative mt-1 w-full rounded-lg border border-gray-200 p-4 text-sm cursor-pointer bg-white mb-4${
          dropdownOpen ? "shadow-lg" : ""
        }`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {selectedValues && selectedValues.length > 0
          ? selectedValues.join(", ")
          : `Select ${label}`}
      </div>
      {dropdownOpen && (
        <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded shadow-lg">
          <div className="p-2 space-y-2">
            {options.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedValues.includes(option)}
                  onChange={(e) => handleCheckboxChange(e.target.value)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;