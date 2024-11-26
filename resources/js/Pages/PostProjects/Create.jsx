import React from "react";
import { useForm, usePage } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";
import { useState } from "react";

export default function Create() {
  const { auth, isPostgraduate } = usePage().props;

  const { data, setData, post, processing, errors } = useForm({
    title: "",
    description: "",
    image: null,
    project_type: "",
    purpose: "find_sponsorship",
    start_date: "",
    end_date: "",
    tags: [],
    email: "",
    contact_number: "",
    location: "",
    budget: "",
    is_featured: false,
    attachment: null
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
    e.preventDefault();

    const formData = new FormData();

    // Add all other fields to FormData
    Object.keys(data).forEach((key) => {
        if (data[key] instanceof File) {
            formData.append(key, data[key]); // Append file fields
        } else {
            formData.append(key, data[key]); // Append non-file fields
        }
    });

    console.log("Form submitted");
    console.log("Form Data: ", formData); // Log the form data

    // Submit the form using Inertia.js
    post(route("post-projects.store"), {
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
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
            className="w-full rounded-lg border-gray-200 p-4 text-sm"
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
            className="w-full rounded-lg border-gray-200 p-4 text-sm"
          >
            <option value="find_accollaboration">
              Find Academician Collaboration
            </option>
            <option value="find_incollaboration">
              Find Industry Collaboration
            </option>
            <option value="find_sponsorship">Find Sponsorship</option>
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
            className="w-full rounded-lg border-gray-200 p-4 text-sm"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">End Date</label>
          <input
            type="date"
            value={data.end_date}
            onChange={(e) => setData("end_date", e.target.value)}
            className="w-full rounded-lg border-gray-200 p-4 text-sm"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-gray-700 font-medium">
          Tags
        </label>
        <button
          type="button"
          className="w-full text-left border rounded-lg p-4 mt-1 text-sm bg-white"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          Select or Add Tags
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            {/* Predefined Tags */}
            <div className="flex flex-col p-2 max-h-40 overflow-y-auto">
              {/* Add predefined tags here */}
            </div>

            {/* Input for Custom Tag */}
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

        {/* Display Selected Tags */}
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

        {errors.tags && <p className="text-red-500 text-xs mt-2">{errors.tags}</p>}
      </div>

      {/* Email and Contact Number */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            className="w-full rounded-lg border-gray-200 p-4 text-sm"
            placeholder="Enter email"
          />
        </div>
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
      </div>

      {/* Location and Budget */}
      <div className="grid grid-cols-2 gap-8">
      <div>
          <label className="block text-gray-700 font-medium">Location</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => setData("location", e.target.value)}
            className="w-full rounded-lg border-gray-200 p-4 text-sm"
            placeholder="Enter location"
          />
          {errors.location && (
            <p className="text-red-500 text-xs mt-1">{errors.location}</p>
          )}
        </div>
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
            className="w-full rounded-lg border-gray-200 p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">
            Upload Attachment
          </label>
          <input
            type="file"
            onChange={(e) => setData("attachment", e.target.files[0])}
            className="w-full rounded-lg border-gray-200 p-2 text-sm"
          />
        </div>
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
        {errors.is_featured && (
          <p className="text-red-500 text-xs mt-1">{errors.is_featured}</p>
        )}
      </div>

      {/* Buttons */}
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
          Save
        </button>
      </div>
    </form>
  </div>
</MainLayout>

  );
}
