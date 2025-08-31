import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { FaEnvelope, FaGoogle, FaGlobe, FaLinkedin, FaFilter } from "react-icons/fa";
import FilterDropdown from "@/Components/FilterDropdown";
import SearchBar from "@/Components/SearchBar";
import Pagination from "@/Components/Pagination";
import UniversitySkeletonCard from "./partials/UniversitySkeletonCard";
import useRoles from "@/Hooks/useRoles";

// CSS for consistent card sizing
const styles = {
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    width: '100%',
    height: '100%',
  }
};

const UniversityList = ({ universities }) => {
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const profilesPerPage = 9;

  // Add useEffect to track Inertia's processing state
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleFinish = () => setIsLoading(false);

    // router.on() returns a function that removes the listener.
    // We capture these remover functions.
    const removeStartListener = router.on('start', handleStart);
    const removeFinishListener = router.on('finish', handleFinish);

    // The cleanup function in the return statement will now call
    // the remover functions, which is the safe way to do this.
    return () => {
      removeStartListener();
      removeFinishListener();
    };
  }, []); // The empty dependency array is correct.

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
      <div className="min-h-screen">
        {/* Mobile Header with Search and Filter */}
        <div className="fixed top-20 right-4 z-50 flex flex-col items-end space-y-2 lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-600 text-white p-2 rounded-lg shadow-lg"
          >
            <FaFilter className="text-xl" />
          </button>
          <SearchBar
            placeholder="Search universities..."
            routeName="universities.index"
            className=""
          />
        </div>

        {/* Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-0 md:py-2 lg:p-0 lg:py-2">
          {/* Left Column - Filter Panel */}
          <div className="lg:w-1/4">
            <div
              className={`fixed lg:relative top-0 left-0 lg:block lg:w-full w-3/4 h-full bg-gray-100 border-r p-4 rounded-lg transition-transform duration-300 z-50 ${
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
          </div>

          {/* Right Column - Search Bar and Content */}
          <div className="lg:w-3/4">
            {/* Search Bar - Desktop */}
            <div className="mb-6 hidden lg:block">
              <SearchBar
                placeholder="Search universities..."
                routeName="universities.index"
                className=""
              />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {isLoading ? (
                // Show skeleton cards while loading
                Array.from({ length: 9 }, (_, index) => (
                  <UniversitySkeletonCard key={index} />
                ))
              ) : (
                // Show actual university cards when not loading
                displayedUniversities.map((uni) => (
                <div key={uni.id} className="flex justify-center">
                  <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col w-full max-w-[450px] sm:max-w-[250px]">
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
                    <div className="text-center mt-4 px-4 flex-grow">
                      <h2 className="text-lg font-semibold truncate">
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
                    <div className="flex justify-center items-center mt-4 py-3 border-t space-x-6 px-4">
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
                </div>
              ))
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UniversityList;
