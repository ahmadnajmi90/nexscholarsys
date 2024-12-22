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
        className={`relative mt-1 w-full rounded-lg border border-gray-200 p-4 text-sm cursor-pointer bg-white ${
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

const PostingCard = ({ data, title, isProject, isEvent, isGrant }) => {
  const [typeFilter, setTypeFilter] = useState([]);
  const [countryFilter, setCountryFilter] = useState([]);
  const [themeFilter, setThemeFilter] = useState([]);
  const [eventModeFilter, setEventModeFilter] = useState([]); // New filter for event mode

  // Extract unique options dynamically
  const uniqueTypeOptions = [
    ...new Set(
      data.map((item) =>
        isProject
          ? item.category
          : isEvent
          ? item.event_type
          : isGrant
          ? item.grant_type
          : null
      )
    ),
  ].filter(Boolean);

  const uniqueCountryOptions = [
    ...new Set(
      data.map((item) =>
        isProject ? item.origin_country : isEvent || isGrant ? item.country : null
      )
    ),
  ].filter(Boolean);

  const uniqueThemeOptions = [
    ...new Set(
      data.flatMap((item) =>
        isProject
          ? item.project_theme || []
          : isEvent
          ? item.event_theme || []
          : isGrant
          ? item.grant_theme || []
          : []
      )
    ),
  ].filter(Boolean);

  const uniqueEventModeOptions = [
    ...new Set(
      isEvent ? data.map((item) => item.event_mode).filter(Boolean) : []
    ),
  ]; // Extract unique event_mode values

  // Filter data based on selected filters
  const filteredData = data.filter((item) => {
    const matchesType =
      typeFilter.length === 0 ||
      typeFilter.some((type) =>
        isProject
          ? item.category === type
          : isEvent
          ? item.event_type === type
          : isGrant
          ? item.grant_type === type
          : true
      );

    const matchesCountry =
      countryFilter.length === 0 ||
      countryFilter.some((country) =>
        isProject
          ? item.origin_country === country
          : isEvent || isGrant
          ? item.country === country
          : true
      );

    const matchesTheme =
      themeFilter.length === 0 ||
      themeFilter.some((theme) =>
        isProject
          ? item.project_theme?.includes(theme)
          : isEvent
          ? item.event_theme?.includes(theme)
          : isGrant
          ? item.grant_theme?.includes(theme)
          : true
      );

    const matchesEventMode =
      eventModeFilter.length === 0 ||
      (isEvent && eventModeFilter.includes(item.event_mode));

    return matchesType && matchesCountry && matchesTheme && matchesEventMode;
  });

  return (
    <div className="min-h-screen flex">
      {/* Sidebar for Filters */}
      <div className="w-1/4 p-4 bg-gray-100 border-r">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="space-y-4">
          {/* Type Filter */}
          <FilterDropdown
            label={isProject ? "Purpose" : isEvent ? "Event Type" : "Grant Type"}
            options={uniqueTypeOptions}
            selectedValues={typeFilter}
            setSelectedValues={setTypeFilter}
          />
          {/* Event Mode Filter */}
          {isEvent && (
            <FilterDropdown
              label="Event Mode"
              options={uniqueEventModeOptions}
              selectedValues={eventModeFilter}
              setSelectedValues={setEventModeFilter}
            />
          )}
          {/* Theme Filter */}
          <FilterDropdown
            label={isProject ? "Project Theme" : isEvent ? "Event Theme" : "Grant Theme"}
            options={uniqueThemeOptions}
            selectedValues={themeFilter}
            setSelectedValues={setThemeFilter}
          />
          {/* Country Filter */}
          <FilterDropdown
            label="Country"
            options={uniqueCountryOptions}
            selectedValues={countryFilter}
            setSelectedValues={setCountryFilter}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden text-center pb-8"
            >
              {/* Image Section */}
              <img
                src={item.image !== null ? `/storage/${item.image}` : "/storage/default.jpg"}
                alt={item[title]}
                className="w-full h-48 object-cover"
              />

              {/* Content Section */}
              <div className="p-8">
                <h2
                  className="text-xl font-semibold text-gray-800 text-center truncate"
                  style={{ maxWidth: "100%" }}
                  title={item[title]}
                >
                  {item[title]}
                </h2>
                <p
                  className="text-gray-600 mt-4 text-center"
                  style={{
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: item.description || "No description available.",
                  }}
                ></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostingCard;
