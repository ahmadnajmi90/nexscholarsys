import React from "react";
import Select from "react-select";

const FilterDropdown = ({ label, options, selectedValues, setSelectedValues, placeholder }) => {
  // Ensure options and selectedValues are arrays (handle undefined, null or non-array values)
  const safeOptions = Array.isArray(options) ? options : [];
  const safeSelectedValues = Array.isArray(selectedValues) ? selectedValues : [];
  
  // Compute the currently selected option objects from the selectedValues array.
  const value = safeOptions.filter((option) => safeSelectedValues.includes(option.value));

  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Select
        isMulti
        options={safeOptions}
        value={value}
        onChange={(selectedOptions) => {
          const newValues = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
          setSelectedValues(newValues);
        }}
        placeholder={placeholder || `Filter by ${label.toLowerCase()}...`}
        className="basic-multi-select"
        classNamePrefix="select"
        isSearchable={true}
      />
    </div>
  );
};

export default FilterDropdown;
