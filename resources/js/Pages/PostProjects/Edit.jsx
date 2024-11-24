import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";
import axios from 'axios';


export default function Edit({ postProject, auth }) {
  const { data, setData, put, processing, errors } = useForm({
    title: postProject.title || "",
    description: postProject.description || "",
    // image: null,
    project_type: postProject.project_type || "",
    purpose: postProject.purpose || "find_sponsorship",
    start_date: postProject.start_date || "",
    end_date: postProject.end_date || "",
    tags: postProject.tags ? JSON.parse(postProject.tags) : [],
    email: postProject.email || "",
    contact_number: postProject.contact_number || "",
    location: postProject.location || "",
    budget: postProject.budget || "",
    is_featured: postProject.is_featured || false,
    // attachment: null,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customTag, setCustomTag] = useState("");

  const handleAddCustomTag = () => {
    if (customTag.trim() !== "" && !data.tags?.includes(customTag)) {
      setData("tags", [...(data.tags || []), customTag]);
      setCustomTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setData("tags", data.tags?.filter((tag) => tag !== tagToRemove));
  };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const formData = new FormData();

//     Object.keys(data).forEach((key) => {
//       if (data[key] instanceof File) {
//         formData.append(key, data[key]);
//       } else if (Array.isArray(data[key])) {
//         formData.append(key, JSON.stringify(data[key]));
//       } else {
//         formData.append(key, data[key]);
//       }
//     });

//     console.log("Form submitted");
//     console.log("Form Data: ", formData); // Log the form data

//     put(route("post-grants.update", postGrant.id), {
//       data: formData,
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//   };

const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Add all data to FormData
    Object.keys(data).forEach((key) => {
        if (data[key] instanceof File) {
            formData.append(key, data[key]);
        } else if (Array.isArray(data[key])) {
            formData.append(key, JSON.stringify(data[key])); // Convert arrays to JSON
        } else {
            formData.append(key, data[key]);
        }
    });

    // Debug FormData
    console.log("Form Data Contents:");
    for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
    }

    try {
        formData.append('_method', 'POST'); // or 'PUT'
        const response = await axios.post(
            `/post-projects/${postProject.id}`, // Update the endpoint for your route
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data', // Required for FormData
                },
            }
        );

        console.log("Form submitted successfully:", response.data);

        // Optionally redirect or show success message
        window.location.href = "/post-projects";
    } catch (error) {
        if (error.response && error.response.data) {
            console.error("Validation errors:", error.response.data.errors);
            // Handle validation errors if needed
        } else {
            console.error("An error occurred:", error);
        }
    }
};

  return (
    <MainLayout title="Edit Project">
      <div className="p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg max-w-lg mx-auto space-y-6 shadow-lg"
        >
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            Edit Project
          </h1>

          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter project title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter description"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Image Upload */}
          {/* <div>
            <label className="block text-gray-700 font-medium">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setData("image", e.target.files[0])}
              className="w-full rounded-lg border-gray-200 p-2 text-sm"
            />
            {postGrant.image && (
              <p className="text-gray-600 text-sm mt-2">
                Current Image:{" "}
                <a
                  href={`/storage/${postGrant.image}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Image
                </a>
              </p>
            )}
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}
          </div> */}

          {/* Project Type */}
          <div>
            <label htmlFor="project_type" className="block text-gray-700 font-medium">
              Project Type
            </label>
            <select
              id="project_type"
              name="project_type"
              value={data.project_type}
              onChange={(e) => setData("project_type", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
            >
              <option value="" disabled hidden>
                Select a Project Type
              </option>
              <option value="Fundamental Research">Fundamental Research</option>
              <option value="Applied Research">Applied Research</option>
              <option value="Fundamental + Applied">Fundamental + Applied</option>
              <option value="Knowledge Transfer Program (KTP)">Knowledge Transfer Program (KTP)</option>
              <option value="CSR (Corporate Social Responsibility)">CSR (Corporate Social Responsibility)</option>
            </select>
            {errors.project_type && <p className="text-red-500 text-xs mt-1">{errors.project_type}</p>}
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-gray-700 font-medium">Purpose</label>
            <select
              value={data.purpose}
              onChange={(e) => setData("purpose", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
            >
              <option value="find_accollaboration">Find Academician Collaboration</option>
              <option value="find_incollaboration">Find Industry Collaboration</option>
              <option value="find_sponsorship">Find Sponsorship</option>
            </select>
          </div>

          {/* Start and End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">
                Start Date
              </label>
              <input
                type="date"
                value={data.start_date}
                onChange={(e) => setData("start_date", e.target.value)}
                className="w-full rounded-lg border-gray-200 p-4 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                End Date
              </label>
              <input
                type="date"
                value={data.end_date}
                onChange={(e) => setData("end_date", e.target.value)}
                className="w-full rounded-lg border-gray-200 p-4 text-sm"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="relative">
            <label htmlFor="tags" className="block text-gray-700 font-medium">
              Tags
            </label>
            <button
              type="button"
              className="w-full text-left border rounded-lg p-2 mt-1 text-sm bg-white"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Select or Add Tags
            </button>
            {dropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="flex flex-col p-2 max-h-40 overflow-y-auto">
                  <label className="inline-flex items-center py-1">
                    <input
                      type="checkbox"
                      name="tags"
                      value="Artificial Intelligence"
                      checked={data.tags?.includes("Artificial Intelligence")}
                      onChange={(e) => {
                        const tag = e.target.value;
                        setData(
                          "tags",
                          e.target.checked
                            ? [...(data.tags || []), tag]
                            : data.tags.filter((t) => t !== tag)
                        );
                      }}
                      className="form-checkbox rounded text-blue-500"
                    />
                    <span className="ml-2">Artificial Intelligence</span>
                  </label>
                  <label className="inline-flex items-center py-1">
                    <input
                      type="checkbox"
                      name="tags"
                      value="Quantum Computing"
                      checked={data.tags?.includes("Quantum Computing")}
                      onChange={(e) => {
                        const tag = e.target.value;
                        setData(
                          "tags",
                          e.target.checked
                            ? [...(data.tags || []), tag]
                            : data.tags.filter((t) => t !== tag)
                        );
                      }}
                      className="form-checkbox rounded text-blue-500"
                    />
                    <span className="ml-2">Quantum Computing</span>
                  </label>

                <label className="inline-flex items-center py-1">
                    <input
                      type="checkbox"
                      name="tags"
                      value="Climate Change"
                      checked={data.tags?.includes("Climate Change")}
                      onChange={(e) => {
                        const tag = e.target.value;
                        setData(
                          "tags",
                          e.target.checked
                            ? [...(data.tags || []), tag]
                            : data.tags.filter((t) => t !== tag)
                        );
                      }}
                      className="form-checkbox rounded text-blue-500"
                    />
                    <span className="ml-2">Climate Change</span>
                  </label>

                  <label className="inline-flex items-center py-1">
                    <input
                      type="checkbox"
                      name="tags"
                      value="Clean Energy"
                      checked={data.tags?.includes("Clean Energy")}
                      onChange={(e) => {
                        const tag = e.target.value;
                        setData(
                          "tags",
                          e.target.checked
                            ? [...(data.tags || []), tag]
                            : data.tags.filter((t) => t !== tag)
                        );
                      }}
                      className="form-checkbox rounded text-blue-500"
                    />
                    <span className="ml-2">Clean Energy</span>
                  </label>

                  <label className="inline-flex items-center py-1">
                    <input
                      type="checkbox"
                      name="tags"
                      value="Robotics"
                      checked={data.tags?.includes("Robotics")}
                      onChange={(e) => {
                        const tag = e.target.value;
                        setData(
                          "tags",
                          e.target.checked
                            ? [...(data.tags || []), tag]
                            : data.tags.filter((t) => t !== tag)
                        );
                      }}
                      className="form-checkbox rounded text-blue-500"
                    />
                    <span className="ml-2">Robotics</span>
                  </label>
                </div>

                <div className="border-t border-gray-200 p-2 mt-2">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="Add custom tag"
                    className="w-full p-2 border rounded-md text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="mt-2 w-full bg-blue-500 text-white p-2 rounded-md text-sm hover:bg-blue-600"
                  >
                    Add Tag
                  </button>
                </div>
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {data.tags?.map((tag) => (
                <div
                  key={tag}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Email */}
            <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    className="w-full rounded-lg border-gray-200 p-4 text-sm"
                    placeholder="Enter email"
                />
                {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
                {/* Use Personal Email Checkbox */}
                <div className="mt-2 flex items-center">
                    <input
                        type="checkbox"
                        id="usePersonalEmail"
                        checked={data.email === auth.email}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setData("email", auth.email); // Set email to personal email
                            } else {
                                setData("email", ""); // Clear email field
                            }
                        }}
                        className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <label htmlFor="usePersonalEmail" className="ml-2 text-gray-700">
                        Use personal email ({auth.email})
                    </label>
                </div>
            </div>


          {/* Contact Number */}
          <div>
            <label className="block text-gray-700 font-medium">
              Contact Number
            </label>
            <input
              type="text"
              value={data.contact_number}
              onChange={(e) => setData("contact_number", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter contact number"
            />
          </div>

          
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-gray-700 font-medium">
              Location
            </label>
            <select
              id="location"
              name="location"
              value={data.location}
              onChange={(e) => setData("location", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
            >
              <option value="" disabled hidden>
                Select a Location
              </option>
              <option value="On-Campus">On-Campus</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>
          
          {/* Budget */}
          <div>
            <label className="block text-gray-700 font-medium">Budget</label>
            <input
              type="number"
              value={data.budget}
              onChange={(e) => setData("budget", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter budget (e.g., 5000.00)"
            />
          </div>

          {/* Featured Project */}
          <div>
            <label className="block text-gray-700 font-medium">
              Featured Project
            </label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="is_featured"
                  value="true"
                  checked={data.is_featured === 1}
                  onChange={() => setData("is_featured", 1)}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="is_featured"
                  value="false"
                  checked={data.is_featured === 0}
                  onChange={() => setData("is_featured", 0)}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">No</span>
              </label>
            </div>
            {errors.is_featured && <p className="text-red-500 text-xs mt-1">{errors.is_featured}</p>}
          </div>

          {/* Attachment Upload */}
          {/* <div>
            <label className="block text-gray-700 font-medium">
              Upload Attachment
            </label>
            <input
              type="file"
              onChange={(e) => setData("attachment", e.target.files[0])}
              className="w-full rounded-lg border-gray-200 p-2 text-sm"
            />
            {postGrant.attachment && (
              <p className="text-gray-600 text-sm mt-2">
                Current Attachment:{" "}
                <a
                  href={`/storage/${postGrant.attachment}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Attachment
                </a>
              </p>
            )}
            {errors.attachment && (
              <p className="text-red-500 text-xs mt-1">{errors.attachment}</p>
            )}
          </div> */}

          {/* Save Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-block rounded-lg bg-gray-200 px-5 py-3 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}