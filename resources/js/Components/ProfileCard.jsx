import React, { useState } from "react";

const ProfileGridWithDualFilter = ({
  profilesData,
  supervisorAvailabilityKey,
  universitiesList, // Pass the complete list of universities
}) => {
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedSupervisorAvailability, setSelectedSupervisorAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 8;

  // Extract unique research areas dynamically from the array data
  const uniqueResearchAreas = [
    ...new Set(
      profilesData.flatMap((profile) => profile.field_of_study || []) // Flatten arrays
    ),
  ];

  // Filter profiles based on selected research area, university, and supervisor availability
  const filteredProfiles = profilesData.filter((profile) => {
    const hasSelectedArea =
      selectedArea === "" || (profile.field_of_study || []).includes(selectedArea);
    const hasSelectedUniversity =
      selectedUniversity === "" || profile.university === parseInt(selectedUniversity);
    const hasSelectedSupervisorAvailability =
      selectedSupervisorAvailability === "" ||
      profile[supervisorAvailabilityKey]?.toString() === selectedSupervisorAvailability;

    return hasSelectedArea && hasSelectedUniversity && hasSelectedSupervisorAvailability;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);
  const displayedProfiles = filteredProfiles.slice(
    (currentPage - 1) * profilesPerPage,
    currentPage * profilesPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get university full_name by ID
  const getUniversityNameById = (id) => {
    const university = universitiesList.find((u) => u.id === id);
    return university ? university.full_name : "Unknown University";
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
          <option value="">All Field of Study</option>
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
          {universitiesList.map((university) => (
            <option key={university.id} value={university.id}>
              {university.full_name}
            </option>
          ))}
        </select>

        <select
          className="p-2 border border-gray-300 rounded"
          value={selectedSupervisorAvailability}
          onChange={(e) => {
            setSelectedSupervisorAvailability(e.target.value);
            setCurrentPage(1); // Reset to the first page when the filter changes
          }}
        >
          <option value="">All Supervisor Availability</option>
          {supervisorAvailabilityKey === "availability_as_supervisor" ? (
            <>
              <option value="1">Available as Supervisor</option>
              <option value="0">Not Available as Supervisor</option>
            </>
          ) : (
            <>
              <option value="1">Available to Find Supervisor</option>
              <option value="0">Not Available to Find Supervisor</option>
            </>
          )}
        </select>
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
              {/* Display field_of_study as a comma-separated string */}
              <p className="text-gray-500 text-sm">
                {Array.isArray(profile.field_of_study) && profile.field_of_study.length > 0
                  ? profile.field_of_study.join(", ")
                  : profile.field_of_study}
              </p>
              <p className="text-gray-500 text-sm">
                {getUniversityNameById(profile.university)}
              </p>
              <p className="mt-2 text-gray-600 text-sm px-4">{profile.bio}</p>
            </div>

            {/* Supervisor Availability */}
            <div className="flex justify-between items-center mt-6 py-4 border-t px-6">
              <div className="text-center">
                <h3 className="text-gray-700 text-sm font-semibold">
                  {profile[supervisorAvailabilityKey] === 1 ? "Yes" : "No"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {supervisorAvailabilityKey === "availability_as_supervisor"
                    ? "Availability as Supervisor"
                    : "Availability to Find Supervisor"}
                </p>
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
