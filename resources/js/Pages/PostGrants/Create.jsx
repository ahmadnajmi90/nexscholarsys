import React from "react";
import { useForm, usePage } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";
import { useState } from "react";
import NationalityForm from "../Role/Partials/NationalityForm";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Create() {
  const { auth, isPostgraduate, isUndergraduate } = usePage().props;

  const { data, setData, post, processing, errors } = useForm({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    application_deadline: "",
    grant_type: "",
    grant_theme: [],
    cycle: "",
    sponsored_by: "",
    email: "",
    website: "",
    country: "",
    image: null,
    attachment: null,
    status: "published",
  });

  const [selectedUniversity, setSelectedUniversity] = useState(data.university);

  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility
  const handleCheckboxChange = (value) => {
    if (data.grant_theme.includes(value)) {
      // Remove the value if already selected
      setData("grant_theme", data.grant_theme.filter((theme) => theme !== value));
    } else {
      // Add the value if not already selected
      setData("grant_theme", [...data.grant_theme, value]);
    }
  };

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
        }else if (Array.isArray(data[key])) {
            formData.append(key, JSON.stringify(data[key])); // Convert arrays to JSON strings
        }
        else {
            formData.append(key, data[key]); // Append non-file fields
        }
    });

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
      console.log(`${key}: ${typeof value}`);
    }

    // Submit the form using Inertia.js
    post(route("post-grants.store"), {
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },

        onSuccess: () => {
          alert("Grant posted successfully.");
        },
        onError: (errors) => {
            console.error("Error updating profile:", errors);
            alert("Failed to post the grant. Please try again.");
        },
    });
  }

  return (
    <MainLayout title="" isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate}>
    <div className="p-4">
      {/* Back Arrow */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 text-gray-700 hover:text-gray-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg max-w-7xl mx-auto space-y-6"
      >
        <h1 className="text-xl font-bold text-gray-700 text-center">
          Add New Grant
        </h1>

        {/* Grant Name */}
        <div>
          <label className="block text-gray-700 font-medium">
            Grant Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData("title", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            placeholder="Enter grant title"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        <div>
      {/* Description */}
      <div>
        <label className="block text-gray-700 font-medium">
          Grant Description <span className="text-red-500">*</span>
        </label>
        <div
          className="mt-1 w-full rounded-lg border border-gray-200"
          style={{
            height: "300px", // Set a default height
            overflowY: "auto", // Add vertical scrollbar]

          }}
        >
          <ReactQuill
            theme="snow"
            value={data.description}
            onChange={(value) => setData("description", value)}
            placeholder="Enter description"
            style={{
              height: "300px", // Set height for the editor content area
              maxHeight: "300px", // Restrict content height
            }}
          />
        </div>
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>
    </div>

        {/* Start and End Date */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-gray-700 font-medium">Start Date (Grant)</label>
            <input
              type="date"
              value={data.start_date}
              onChange={(e) => {
                setData("start_date", e.target.value);
              }}
              className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">End Date (Grant)</label>
            <input
              type="date"
              value={data.end_date}
              min={data.start_date || ""} // Set the minimum date to start_date
              onChange={(e) => {
                setData("end_date", e.target.value);
              }}
              className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            />
          </div>
        </div>

        {/* Application Deadline and Duration */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="mt-1 block text-gray-700 font-medium">Application Deadline</label>
            <input
              type="date"
              value={data.application_deadline}
              onChange={(e) => setData("application_deadline", e.target.value)}
              className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            />
          </div>

          <div>
            <label htmlFor="grant_type" className="block text-gray-700 font-medium">
              Grant Type
            </label>
            <select
              id="grant_type"
              name="grant_type"
              value={data.grant_type}
              onChange={(e) => setData("grant_type", e.target.value)}
              className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            >
              <option value="" disabled hidden>
                Select a Grant Type
              </option>
              <option value="Matching Grant">Matching Grant</option>
              <option value="Seed Grant">Seed Grant</option>
              <option value="Research Grant">Research Grant</option>
              <option value="Travel Grant">Travel Grant</option>
              <option value="Innovation Grant">Innovation Grant</option>
              <option value="Collaboration Grant">Collaboration Grant</option>
              <option value="Training Grant">Training Grant</option>
              <option value="Capacity-Building Grant">Capacity-Building Grant</option>
              <option value="Community Grant">Community Grant</option>
              <option value="Development Grant">Development Grant</option>
              <option value="Pilot Grant">Pilot Grant</option>
              <option value="Commercialization Grant">Commercialization Grant</option>
              <option value="Technology Grant">Technology Grant</option>
              <option value="Sponsorship Grant">Sponsorship Grant</option>
              <option value="Social Impact Grant">Social Impact Grant</option>
              <option value="Emergency or Relief Grant">Emergency or Relief Grant</option>
              <option value="International Grant">International Grant</option>
              <option value="Equipment Grant">Equipment Grant</option>
              <option value="Small Business Grant">Small Business Grant</option>
            </select>
            {errors.grant_type && (
              <p className="text-red-500 text-xs mt-1">{errors.grant_type}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-gray-700 font-medium">Grant Theme (Multiselect)</label>
            <div
              className={`relative mt-1 w-full rounded-lg border border-gray-200 p-4 text-sm cursor-pointer bg-white ${
                dropdownOpen ? "shadow-lg" : ""
              }`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {data.grant_theme && data.grant_theme.length > 0
                ? data.grant_theme.join(", ")
                : "Select Grant Themes"}
            </div>
            {dropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded shadow-lg">
                <div className="p-2 space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="Science & Technology"
                      checked={data.grant_theme.includes("Science & Technology")}
                      onChange={(e) => handleCheckboxChange(e.target.value)}
                      className="mr-2"
                    />
                    Science & Technology
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="Social Science"
                      checked={data.grant_theme.includes("Social Science")}
                      onChange={(e) => handleCheckboxChange(e.target.value)}
                      className="mr-2"
                    />
                    Social Science
                  </label>
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="cycle" className="block text-gray-700 font-medium">
              Cycle
            </label>
            <select
              id="cycle"
              name="cycle"
              value={data.cycle}
              onChange={(e) => setData("cycle", e.target.value)}
              className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            >
              <option value="" disabled hidden>
                Select Cycle
              </option>
              <option value="No Cycle">No Cycle</option>
              <option value="Cycle 1">Cycle 1</option>
              <option value="Cycle 2">Cycle 2</option>
              <option value="Cycle 3">Cycle 3</option>
            </select>
            {errors.cycle && (
              <p className="text-red-500 text-xs mt-1">{errors.cycle}</p>
            )}
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
              className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter sponsor"
            />
          </div>
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
        </div>

        {/* Website and Country */}
        <div className="grid grid-cols-2 gap-8">
          <div>
              <label className="block text-gray-700 font-medium">
                  Website / Link
              </label>
              <input
                  type="url"
                  value={data.website}
                  onChange={(e) => setData("website", e.target.value)}
                  className="w-full rounded-lg border-gray-200 p-4 text-sm"
                  placeholder="Enter Website / Link"
              />
              {errors.website && (
                  <p className="text-red-500 text-xs mt-1">{errors.website}</p>
              )}
          </div>

          <div>
            <NationalityForm title={"Country"} value={data.country} isNotSpecify={true} onChange={(value) => setData('country', value)} />
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

          {/* <div className="grid grid-cols-2 gap-8"> */}
  {/* Tags */}
  {/* <div className="relative">
    <label htmlFor="tags" className="block text-gray-700 font-medium">
      Tags
    </label>
    <button
      type="button"
      className="w-full text-left border rounded-lg p-4 mt-2 text-sm bg-white"
      onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown
    >
      Select or Add Tags
    </button> */}

    {/* Dropdown Menu */}
    {/* {dropdownOpen && (
      <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="flex flex-col p-2 max-h-40 overflow-y-auto"> */}
          {/* Predefined Tags */}
          {/* <label className="inline-flex items-center py-1">
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
          </label> */}

          {/* Other tags */}
          {/* <label className="inline-flex items-center py-1">
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
        </div> */}

        {/* Input for Custom Tag */}
        {/* <div className="border-t border-gray-200 p-2 mt-2">
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
      </div> */}
    {/* )} */}

    {/* Display Selected Tags */}
    {/* <div className="mt-3 flex flex-wrap gap-2">
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
  </div> */}

  {/* Featured Grant */}
  {/* <div>
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
  </div> */}
{/* </div> */}



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

        {/* There will be the avaibility to send the email or chat or request to applied through nexscholar.  */}
  </MainLayout>

  );
}
