import React, { useState } from "react";

const ProfileGridWithDualFilter = ({
  profilesData,
  supervisorAvailabilityKey, // Pass the specific key for supervisor availability as a prop
}) => {
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedSupervisorAvailability, setSelectedSupervisorAvailability] = useState(""); // Added supervisor availability
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 8;

  // Extract unique research areas and universities dynamically from the provided data
  const uniqueResearchAreas = [
    ...new Set(profilesData.map((profile) => profile.field_of_study)),
  ];
  const uniqueUniversities = [
    ...new Set(profilesData.map((profile) => profile.university)),
  ];

  // Filter profiles based on selected research area, university, and supervisor availability
  const filteredProfiles = profilesData.filter(
    (profile) =>
      (selectedArea === "" || profile.field_of_study === selectedArea) &&
      (selectedUniversity === "" || profile.university === selectedUniversity) &&
      (selectedSupervisorAvailability === "" ||
        profile[supervisorAvailabilityKey]?.toString() ===
          selectedSupervisorAvailability) // Use dynamic key for supervisor availability
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);
  const displayedProfiles = filteredProfiles.slice(
    (currentPage - 1) * profilesPerPage,
    currentPage * profilesPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Filters */}
      <div className="flex justify-center gap-4 mb-6">
        <select
          className="p-2 border border-gray-300 rounded"
          value={selectedArea}
          onChange={(e) => {
            setSelectedArea(e.target.value);
            setCurrentPage(1); // Reset to the first page when the filter changes
          }}
        >
          <option value="">All Research Areas</option>
          {uniqueResearchAreas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>

        <select
          className="p-2 border border-gray-300 rounded"
          value={selectedUniversity}
          onChange={(e) => {
            setSelectedUniversity(e.target.value);
            setCurrentPage(1); // Reset to the first page when the filter changes
            }}
          >
            <option value="">All Universities</option>
            {uniqueUniversities.map((university) => (
            <option key={university} value={university}>
              {university}
            </option>
            ))}
          </select>

          {supervisorAvailabilityKey === "availability_as_supervisor" ?
           (
            <select
            className="p-2 border border-gray-300 rounded"
            value={selectedSupervisorAvailability}
            onChange={(e) => {
              setSelectedSupervisorAvailability(e.target.value);
              setCurrentPage(1); // Reset to the first page when the filter changes
            }}
            >
            <option value="">All Supervisor Availability</option>
            <option value="1">Available as Supervisor</option>
            <option value="0">Not Available as Supervisor</option>
            </select>
          )
          :
          (
            <select
            className="p-2 border border-gray-300 rounded"
            value={selectedSupervisorAvailability}
            onChange={(e) => {
              setSelectedSupervisorAvailability(e.target.value);
              setCurrentPage(1); // Reset to the first page when the filter changes
            }}
            >
            <option value="">All Supervisor Availability</option>
            <option value="1">Available to find Supervisor</option>
            <option value="0">Not Available to find Supervisor</option>
            </select>
          )
          }
        </div>

          {/* Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedProfiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            {/* Banner */}
            <div className="h-32">
              <img
                src={`https://picsum.photos/seed/${profile.id}/500/150`} // Random banner using ID
                alt="Banner"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Profile Image */}
            <div className="flex justify-center -mt-12">
              <img
                src={`https://i.pravatar.cc/300?img=${profile.id}`} // Random avatar using ID
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
            </div>

            {/* Profile Info */}
            <div className="text-center mt-4">
              <h2 className="text-lg font-semibold">{profile.full_name}</h2>
              <p className="text-gray-500 text-sm">{profile.field_of_study}</p>
              <p className="text-gray-500 text-sm">{profile.university}</p>
              <p className="mt-2 text-gray-600 text-sm px-4">{profile.bio}</p>
            </div>

            {/* Supervisor Availability */}
            <div className="flex justify-between items-center mt-6 py-4 border-t px-6">
              <div className="text-center">
                <h3 className="text-gray-700 text-sm font-semibold">
                  {profile[supervisorAvailabilityKey] === 1 ? "Yes" : "No"}
                </h3>
                {supervisorAvailabilityKey === "availability_as_supervisor" ?
                (
                  <p className="text-gray-500 text-sm">Availability as Supervisor</p>
                )
                :
                (
                  <p className="text-gray-500 text-sm">Availability to find Supervisor</p>
                )}
              </div>
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
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileGridWithDualFilter;
