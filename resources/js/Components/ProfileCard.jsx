import React, { useState } from "react";

// List of random names
const randomNames = [
  "Alice Johnson",
  "Bob Smith",
  "Charlie Brown",
  "Diana Prince",
  "Edward Norton",
  "Fiona Gallagher",
  "George Michael",
  "Hannah Montana",
  "Ian Curtis",
  "Julia Roberts",
  "Kevin Hart",
  "Luna Lovegood",
  "Mark Ruffalo",
  "Nina Simone",
  "Oscar Wilde",
  "Penny Lane",
  "Quentin Tarantino",
  "Rachel Green",
  "Steve Jobs",
  "Taylor Swift",
  "Uma Thurman",
  "Victor Hugo",
  "Will Smith",
  "Xander Cage",
  "Yara Shahidi",
  "Zoe Saldana",
  "Anna Kendrick",
  "Brian May",
  "Catherine Zeta-Jones",
  "David Beckham",
];

// Mock data for universities in Malaysia
const universities = [
  "Universiti Malaya (UM)",
  "Universiti Teknologi Malaysia (UTM)",
  "Universiti Kebangsaan Malaysia (UKM)",
  "Universiti Sains Malaysia (USM)",
  "Universiti Putra Malaysia (UPM)",
  "Universiti Teknologi MARA (UiTM)",
  "Universiti Islam Antarabangsa Malaysia (UIAM)",
  "Universiti Malaysia Sabah (UMS)",
  "Universiti Malaysia Sarawak (UNIMAS)",
  "Universiti Pendidikan Sultan Idris (UPSI)",
];

// Generate 30 sample profiles with random names and universities
const profilesData = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  name: randomNames[index % randomNames.length], // Random names from the list
  area: [
    "Artificial Intelligence (Generative AI)",
    "Quantum Computing",
    "Clean Energy Technologies",
    "Synthetic Biology",
    "Climate Change Mitigation",
    "Advanced Robotics",
    "Natural Language Processing",
    "Autonomous Vehicles",
    "Space Exploration Technologies",
    "Edge Computing",
  ][index % 10], // Cycle through research areas
  university: universities[index % universities.length], // Cycle through universities
  followers: Math.floor(Math.random() * 100) + 1,
  following: Math.floor(Math.random() * 50) + 1,
}));

const uniqueResearchAreas = [
  ...new Set(profilesData.map((profile) => profile.area)),
];
const uniqueUniversities = [
  ...new Set(profilesData.map((profile) => profile.university)),
];

const ProfileGridWithDualFilter = () => {
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 8;

  // Filter profiles based on selected research area and university
  const filteredProfiles = profilesData.filter(
    (profile) =>
      (selectedArea === "" || profile.area === selectedArea) &&
      (selectedUniversity === "" || profile.university === selectedUniversity)
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
              <h2 className="text-lg font-semibold">{profile.name}</h2>
              <p className="text-gray-500 text-sm">{profile.area}</p>
              <p className="text-gray-500 text-sm">{profile.university}</p>
              <p className="mt-2 text-gray-600 text-sm px-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

            {/* Followers and Following */}
            <div className="flex justify-between items-center mt-6 py-4 border-t px-6">
              <div className="text-center">
                <h3 className="text-gray-700 text-sm font-semibold">
                  {profile.followers}
                </h3>
                <p className="text-gray-500 text-sm">Followers</p>
              </div>
              <div className="text-center">
                <h3 className="text-gray-700 text-sm font-semibold">
                  {profile.following}
                </h3>
                <p className="text-gray-500 text-sm">Following</p>
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
