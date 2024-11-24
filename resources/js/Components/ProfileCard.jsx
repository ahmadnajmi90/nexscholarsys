import React, { useState } from "react";
import { FaEnvelope, FaGoogle, FaGlobe, FaLinkedin } from "react-icons/fa";

const ProfileGridWithDualFilter = ({
    profilesData,
    supervisorAvailabilityKey,
    universitiesList, // Pass the complete list of universities
    isPostgraduateList,
    users
}) => {
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedUniversity, setSelectedUniversity] = useState("");
    const [selectedSupervisorAvailability, setSelectedSupervisorAvailability] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const profilesPerPage = 8;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);

    const handleQuickInfoClick = (profile) => {
        setSelectedProfile(profile);
        setIsModalOpen(true);
    };

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
        const university = universitiesList.find((u) => u.id === id); // Find the university by ID
        return university ? university.short_name : "Unknown University"; // Return the full_name or a default string
    };

    return (


        <div className="min-h-screen p-4 sm:p-6">
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
                <select
                    className="p-2 border border-gray-300 rounded w-full sm:w-auto"
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
                    className="p-2 border border-gray-300 rounded w-full sm:w-auto"
                    value={selectedUniversity}
                    onChange={(e) => {
                        setSelectedUniversity(e.target.value);
                        setCurrentPage(1); // Reset to the first page when the filter changes
                    }}
                >
                    <option value="">All Universities</option>
                    {universitiesList.map((university) => (
                        <option key={university.id} value={university.id}>
                            {university.short_name}
                        </option>
                    ))}
                </select>

                <select
                    className="p-2 border border-gray-300 rounded w-full sm:w-auto"
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
                            <option value="1">Looking for a Supervisor</option>
                            <option value="0">Not Looking for a Supervisor</option>
                        </>
                    )}
                </select>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {displayedProfiles.map((profile) => (
                    <div
                        key={profile.id}
                        className="bg-white shadow-md rounded-lg overflow-hidden relative"
                    >
                        {/* University Badge */}
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px]  font-semibold px-2.5 py-0.5  rounded-full">
                            {getUniversityNameById(profile.university)}
                        </div>
                        {!isPostgraduateList && profile.verified === 1 &&(
                        <div className="relative group">
                            <span className="absolute top-2 right-2 whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] text-purple-700 cursor-pointer">
                                Verified
                            </span>
                            {/* Tooltip */}
                            <div className="absolute top-8 right-0 hidden group-hover:flex items-center bg-gray-800 text-white text-xs rounded px-3 py-2 shadow-lg z-10">
                                This account is verified by {getUniversityNameById(profile.university)}
                            </div>
                        </div>
                        )}

                        {/* Banner */}
                        <div className="h-32">
                            <img
                                src={`https://picsum.photos/seed/${profile.id}/500/150`}
                                alt="Banner"
                                className="object-cover w-full h-full"
                            />
                        </div>

                        {/* Profile Image */}
                        <div className="flex justify-center -mt-12">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                <img
                                    src={
                                        profile.profile_picture !== null
                                            ? `/storage/${profile.profile_picture}`
                                            : '/storage/profile_pictures/default.jpg'
                                    }
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="text-center mt-4">
                            <h2 className="text-lg font-semibold">{profile.full_name}</h2>

                            {/* Display only the first field of study */}
                            <p className="text-gray-500 text-sm">
                                {Array.isArray(profile.field_of_study) && profile.field_of_study.length > 0
                                    ? profile.field_of_study[0] // Display the first field of study
                                    : profile.field_of_study && profile.field_of_study.length > 0
                                    ? profile.field_of_study // Display the field_of_study directly if not an array but has content
                                    : "No Field of Study"}
                            </p>
                            <p className="text-gray-500 text-sm">{profile.current_position}</p>
                            {/* Quick Info Button */}
                                    <button
                                        onClick={() => handleQuickInfoClick(profile)}
                                        className="mt-2 bg-blue-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-blue-600"
                                    >
                                        Quick Info
                                    </button>

                        </div>

                        {/* Social Links */}
                        <div className="flex justify-around items-center mt-6 py-4 border-t px-10">
                            {/* Email Icon */}
                            <FaEnvelope
                                className="text-gray-500 text-sm cursor-pointer hover:text-blue-700"
                                title="Copy Email"
                                onClick={() => handleCopyEmail(profile.email)}
                            />
                            {/* Google Scholar Icon */}
                            <a
                                href={profile.google_scholar}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 text-sm hover:text-red-700"
                                title="Google Scholar"
                            >
                                <FaGoogle />
                            </a>
                            {/* Website Icon */}
                            <a
                                href={profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 text-sm hover:text-green-700"
                                title="Website"
                            >
                                <FaGlobe />
                            </a>
                            {/* LinkedIn Icon */}
                            <a
                                href={profile.linkedin}
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

                {/* Modal for Quick Info */}
                {isModalOpen && selectedProfile && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg relative">
      {/* Close Button */}
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Modal Header */}
      <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
        {selectedProfile.full_name}
      </h3>

      {/* Modal Content */}
      <div className="space-y-4">
        <p className="text-gray-600">
          <span className="font-semibold">University:</span>{" "}
          {getUniversityNameById(selectedProfile.university)}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Bio:</span>{" "}
          {selectedProfile.bio || "No bio available."}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Fields of Study:</span>{" "}
          {Array.isArray(selectedProfile.field_of_study)
            ? selectedProfile.field_of_study.join(", ")
            : selectedProfile.field_of_study || "No fields of study"}
        </p>
        <p className="text-gray-600">
            {supervisorAvailabilityKey == "availability_as_supervisor" ? (<span className="font-semibold">Available as supervisor:</span>) : (<span className="font-semibold">Looking for a supervisor:</span>)}
          {selectedProfile[supervisorAvailabilityKey] === 1
            ? " Yes"
            : " No"}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Email:</span>{" "}
          {users.find((user) => user.unique_id === (selectedProfile.academician_id || selectedProfile.postgraduate_id))?.email || "No email provided"}
        </p>
      </div>

      {/* Footer Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-6 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 border rounded ${currentPage === index + 1
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
