import React from "react";
import { useForm, usePage } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";
import { useState } from "react";

export default function Create() {
  const { auth, isPostgraduate } = usePage().props;

  const { data, setData, post, processing, errors } = useForm({
    title: "",
    description: "",
    project_type: "",
    purpose: "",
    start_date: "",
    end_date: "",
    image: null,
    attachment: null,
    email: "",
    location: "",
    project_status: "published",
  });
  
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility
  const [customTag, setCustomTag] = useState(""); // State to manage custom tag input

  const handleAddCustomTag = () => {
    if (customTag.trim() !== "" && !data.tags?.includes(customTag)) {
      setData("tags", [...(data.tags || []), customTag]); // Add the custom tag
      setCustomTag(""); // Clear the input field
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setData("tags", data.tags?.filter((tag) => tag !== tagToRemove)); // Remove the tag
  };

  function handleSubmit(e) {
    if (e) e.preventDefault();

    const formData = new FormData();

    // Add all other fields to FormData
    Object.keys(data).forEach((key) => {
        if (data[key] instanceof File) {
            formData.append(key, data[key]); // Append file fields
        } else {
            formData.append(key, data[key]); // Append non-file fields
        }
    });

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
      console.log(`${key}: ${typeof value}`);
    } 

    // Submit the form using Inertia.js
    post(route("post-projects.store"), {
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },

        onSuccess: () => {
          alert("Project posted successfully.");
        },
        onError: (errors) => {
            console.error("Error updating Project:", errors);
            alert("Failed to post the Project. Please try again.");
        },
    });
  }

  return (
    <MainLayout title="" isPostgraduate={isPostgraduate}>
  <div className="p-4">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg max-w-7xl mx-auto space-y-6"
    >
      <h1 className="text-xl font-bold text-gray-700 text-center">
        Add New Project
      </h1>

      {/* Title */}
      <div>
        <label className="block text-gray-700 font-medium">
          Project Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData("title", e.target.value)}
          className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
          placeholder="Enter Project Name"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-gray-700 font-medium">
          Project Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.description}
          onChange={(e) => setData("description", e.target.value)}
          className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
          placeholder="Enter project description"
        ></textarea>
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      {/* Project Type and Purpose */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className="block text-gray-700 font-medium">
            Project Type
          </label>
          <select
            id="project_type"
            name="project_type"
            value={data.project_type}
            onChange={(e) => setData("project_type", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
          >
            <option value="" disabled hidden>
              Select a Project Type
            </option>
            <option value="Fundamental Research">Fundamental Research</option>
            <option value="Applied Research">Applied Research</option>
            <option value="Fundamental + Applied">
              Fundamental + Applied
            </option>
            <option value="Knowledge Transfer Program (KTP)">
              Knowledge Transfer Program (KTP)
            </option>
            <option value="CSR (Corporate Social Responsibility)">
              CSR (Corporate Social Responsibility)
            </option>
          </select>
          {errors.project_type && (
            <p className="text-red-500 text-xs mt-1">{errors.project_type}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Purpose</label>
          <select
            value={data.purpose}
            onChange={(e) => setData("purpose", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
          >
            <option value="" disabled hidden> Select a Purpose</option>
            <option value="find_accollaboration">
              Find Academician Collaboration
            </option>
            <option value="find_incollaboration">
              Find Industry Collaboration
            </option>
            <option value="find_sponsorship">Find Sponsorship</option>
            <option value="showcase">Showcase</option>
          </select>
        </div>
      </div>

      {/* Start Date and End Date */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className="block text-gray-700 font-medium">Start Date</label>
          <input
            type="date"
            value={data.start_date}
            onChange={(e) => setData("start_date", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">End Date</label>
          <input
            type="date"
            value={data.end_date}
            min={data.start_date||''}
            onChange={(e) => setData("end_date", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
          />
        </div>
      </div>

      {/* Image Upload and Attachment Upload */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className="block text-gray-700 font-medium">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setData("image", e.target.files[0])}
            className="mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">
            Upload Attachment
          </label>
          <input
            type="file"
            onChange={(e) => setData("attachment", e.target.files[0])}
            className="mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"
          />
        </div>
      </div>

      {/* Email and Contact Number */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className="block text-gray-700 font-medium">Contact Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            placeholder="Enter email"
          />
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
        <div>
          <label className="block text-gray-700 font-medium">Location</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => setData("location", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            placeholder="Enter location"
          />
          {errors.location && (
            <p className="text-red-500 text-xs mt-1">{errors.location}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        {/* Save as Draft Button */}
          {/* <button
            type="button"
            onClick={() => {
              setTempStatus("draft");
              handleSubmit();
            }}
            disabled={processing}
            className="inline-block rounded-lg bg-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Save as Draft
          </button> */}

          {/* Publish Button */}
          <button
            type="button"
            onClick={() => {
              handleSubmit();
            }}
            disabled={processing}
            className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600"
          >
            Publish
          </button>
      </div>
    </form>
  </div>
</MainLayout>

  );
}
