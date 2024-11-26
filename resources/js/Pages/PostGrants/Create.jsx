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
    post_status: "draft",
    grant_status: "open",
    category: "",
    tags: [],
    sponsored_by: "",
    location: "",
    email: "",
    contact_number: "",
    purpose: "find_pgstudent",
    start_date: "",
    end_date: "",
    budget: "",
    eligibility_criteria: "",
    is_featured: false,
    application_url: "",
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
    post(route("post-grants.store"), {
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
          Add New Grant
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
            placeholder="Enter grant title"
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

        {/* Post Status and Grant Status */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-gray-700 font-medium">Post Status</label>
            <select
              value={data.post_status}
              onChange={(e) => setData("post_status", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Grant Status</label>
            <select
              value={data.grant_status}
              onChange={(e) => setData("grant_status", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Start and End Date */}
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

        {/* Sponsored By and Category */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-gray-700 font-medium">Sponsored By</label>
            <input
              type="text"
              value={data.sponsored_by}
              onChange={(e) => setData("sponsored_by", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter sponsor"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-gray-700 font-medium">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={data.category}
              onChange={(e) => setData("category", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
            >                                                                                   
              <option value="" disabled hidden>
                Select a Category
              </option>
              <option value="Fundamental Research">Fundamental Research</option>
              <option value="Applied Research">Applied Research</option>
              <option value="Fundamental + Applied">Fundamental + Applied</option>
              <option value="Knowledge Transfer Program (KTP)">
                Knowledge Transfer Program (KTP)
              </option>
              <option value="CSR (Corporate Social Responsibility)">
                CSR (Corporate Social Responsibility)
              </option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>
        </div>

        {/* Purpose and Location */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-gray-700 font-medium">Purpose</label>
            <select
              value={data.purpose}
              onChange={(e) => setData("purpose", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
            >
              <option value="find_pgstudent">Find Postgraduate Student</option>
              <option value="find_collaboration">Find Collaboration</option>
            </select>
          </div>
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

        {/* Image and Attachment Upload */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-gray-700 font-medium">Upload Image</label>
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

        {/* Eligibility Criteria */}
        <div>
          <label className="block text-gray-700 font-medium">
            Eligibility Criteria
          </label>
          <textarea
            value={data.eligibility_criteria}
            onChange={(e) => setData("eligibility_criteria", e.target.value)}
            className="w-full rounded-lg border-gray-200 p-4 text-sm"
            placeholder="Enter eligibility criteria"
          ></textarea>
        </div>

        
          {/* Application URL */}
          <div>
              <label className="block text-gray-700 font-medium">
                  Application URL
              </label>
              <input
                  type="url"
                  value={data.application_url}
                  onChange={(e) => setData("application_url", e.target.value)}
                  className="w-full rounded-lg border-gray-200 p-4 text-sm"
                  placeholder="Enter application URL"
              />
              {errors.application_url && (
                  <p className="text-red-500 text-xs mt-1">{errors.application_url}</p>
              )}
          </div>

          <div className="grid grid-cols-2 gap-8">
  {/* Tags */}
  <div className="relative">
    <label htmlFor="tags" className="block text-gray-700 font-medium">
      Tags
    </label>
    <button
      type="button"
      className="w-full text-left border rounded-lg p-4 mt-2 text-sm bg-white"
      onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown
    >
      Select or Add Tags
    </button>

    {/* Dropdown Menu */}
    {dropdownOpen && (
      <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="flex flex-col p-2 max-h-40 overflow-y-auto">
          {/* Predefined Tags */}
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

          {/* Other tags */}
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

  {/* Featured Grant */}
  <div>
    <label className="block text-gray-700 font-medium">Featured Grant</label>
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
