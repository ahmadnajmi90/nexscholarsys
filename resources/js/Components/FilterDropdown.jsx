import React from "react";
import Select from "react-select";

const FilterDropdown = ({ label, options, selectedValues, setSelectedValues, placeholder }) => {
  // Compute the currently selected option objects from the selectedValues array.
  const value = options.filter((option) => selectedValues.includes(option.value));

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mt-4">{label}</label>
      <Select
        isMulti
        options={options}
        value={value}
        onChange={(selectedOptions) => {
          const newValues = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
          setSelectedValues(newValues);
        }}
        placeholder={placeholder || `Select ${label}...`}
        className="mt-1"
        classNamePrefix="select"
      />
    </div>
  );
};

export default FilterDropdown;
