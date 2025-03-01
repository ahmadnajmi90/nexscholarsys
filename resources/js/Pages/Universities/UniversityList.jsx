import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { FaEnvelope, FaGoogle, FaGlobe, FaLinkedin, FaFilter } from "react-icons/fa";
import FilterDropdown from "@/Components/FilterDropdown";
import useRoles from "@/Hooks/useRoles";

const UniversityList = ({ universities }) => {
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const profilesPerPage = 9;

  // Convert unique options to objects with value and label
  const uniqueCountries = [...new Set(universities.map((uni) => uni.country))]
    .filter(Boolean)
    .map((country) => ({ value: country, label: country }));
  const uniqueTypes = [...new Set(universities.map((uni) => uni.university_type))]
    .filter(Boolean)
    .map((university_type) => ({ value: university_type, label: university_type }));
  const uniqueCategories = [...new Set(universities.map((uni) => uni.university_category))]
    .filter(Boolean)
    .map((university_category) => ({ value: university_category, label: university_category }));

  // Filter universities based on selected filters
  const filteredUniversities = universities.filter((uni) => {
    return (
      (selectedCountries.length === 0 || selectedCountries.includes(uni.country)) &&
      (selectedTypes.length === 0 || selectedTypes.includes(uni.university_type)) &&
      (selectedCategories.length === 0 || selectedCategories.includes(uni.university_category))
    );
  });

  const totalPages = Math.ceil(filteredUniversities.length / profilesPerPage);
  const displayedUniversities = filteredUniversities.slice(
    (currentPage - 1) * profilesPerPage,
    currentPage * profilesPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <MainLayout title={"List of Universities"}>
      <div className="min-h-screen flex">
        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="fixed top-20 right-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg lg:hidden"
        >
          <FaFilter className="text-xl" />
        </button>

        {/* Sidebar for Filters */}
        <div
          className={`fixed lg:relative top-0 left-0 lg:block lg:w-1/4 w-3/4 h-full bg-gray-100 border-r p-4 rounded-lg transition-transform duration-300 z-50 ${
            showFilters ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
            Filters
            {/* Mobile close button */}
            <button onClick={() => setShowFilters(false)} className="text-gray-600 lg:hidden">
              ✕
            </button>
          </h2>
          <FilterDropdown
            label="Country"
            options={uniqueCountries}
            selectedValues={selectedCountries}
            setSelectedValues={setSelectedCountries}
          />
          <FilterDropdown
            label="University Type"
            options={uniqueTypes}
            selectedValues={selectedTypes}
            setSelectedValues={setSelectedTypes}
          />
          <FilterDropdown
            label="University Category"
            options={uniqueCategories}
            selectedValues={selectedCategories}
            setSelectedValues={setSelectedCategories}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 py-6 sm:py-4 lg:py-0 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayedUniversities.map((uni) => (
              <div
                key={uni.id}
                className="bg-white shadow-md rounded-lg overflow-hidden relative"
              >
                {/* Faculty Banner */}
                <div className="h-32">
                  <img
                    src={
                      uni.background_image
                        ? `/storage/${uni.background_image}`
                        : "/storage/university_background_images/default.jpg"
                    }
                    alt="University Banner"
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* University Logo */}
                <div className="flex justify-center -mt-12">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={
                        uni.profile_picture
                          ? `/storage/${uni.profile_picture}`
                          : "/storage/university_profile_pictures/default.png"
                      }
                      alt="University Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* University Info */}
                <div className="text-center mt-4">
                  <h2 className="text-lg font-semibold mb-2 overflow-hidden truncate px-4">
                    {uni.full_name}
                  </h2>
                  <p className="text-gray-500 text-sm">{uni.country}</p>
                  <button
                    onClick={() =>
                      (window.location.href = route("universities.faculties", { university: uni.id }))
                    }
                    className="mt-2 bg-blue-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-blue-600"
                  >
                    View
                  </button>
                </div>

                {/* Social Links */}
                <div className="flex justify-around items-center mt-6 py-4 border-t px-10">
                  <FaEnvelope
                    className="text-gray-500 text-sm cursor-pointer hover:text-blue-700"
                    title="Copy Email"
                  />
                  <a
                    href={uni.google_scholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 text-sm hover:text-red-700"
                    title="Google Scholar"
                  >
                    <FaGoogle />
                  </a>
                  <a
                    href={uni.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 text-sm hover:text-green-700"
                    title="Website"
                  >
                    <FaGlobe />
                  </a>
                  <a
                    href={uni.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 text-sm hover:text-blue-800"
                    title="LinkedIn"
                  >
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 border rounded ${
                  currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UniversityList;
