import React, { useState, useEffect, useRef } from "react";
import { useForm, usePage } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";
import NationalityForm from "../Role/Partials/NationalityForm";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useRoles from "../../Hooks/useRoles";
import InputLabel from '@/Components/InputLabel';
import { Head } from '@inertiajs/react';

// Simplified array for scholarship options
const scholarshipOptions = [
    "Merit-Based Scholarship", "Dean's Scholarship", "Academic Excellence Scholarship",
    "Need-Based Scholarship", "Hardship Scholarship", "First-Generation Scholarship",
    "STEM Scholarship", "Arts & Humanities Scholarship", "Business/Finance Scholarship",
    "Medical/Healthcare Scholarship", "Minority Scholarship", "Women in STEM Scholarship",
    "International Student Scholarship", "Disability Scholarship", "Athletic Scholarship",
    "Artistic/Creative Scholarship", "Leadership Scholarship"
];

// Grant options remain the same
const grantOptions = [
    "Matching Grant", "Seed Grant", "Research Grant", "Travel Grant",
    "Innovation Grant", "Collaboration Grant", "Training Grant",
    "Capacity-Building Grant", "Community Grant", "Development Grant",
    "Pilot Grant", "Commercialization Grant", "Technology Grant",
    "Sponsorship Grant", "Social Impact Grant", "Emergency or Relief Grant",
    "International Grant", "Equipment Grant", "Small Business Grant"
];

export default function Edit({ fundingItem, auth, type }) {
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();

  // Determine type based on whether the item has a cycle property
  const itemType = type || (fundingItem.cycle ? 'grants' : 'scholarships');

  const { data, setData, post, processing, errors } = useForm({
    type: itemType === 'grants' ? 'grant' : 'scholarship',
    title: fundingItem.title || "",
    description: fundingItem.description || "",
    start_date: fundingItem.start_date || "",
    end_date: fundingItem.end_date || "",
    application_deadline: fundingItem.application_deadline || "",
    grant_type: fundingItem.grant_type || fundingItem.scholarship_type || "",
    grant_theme: fundingItem.grant_theme || fundingItem.scholarship_theme || [],
    scholarship_type: fundingItem.scholarship_type || fundingItem.grant_type || "",
    scholarship_theme: fundingItem.scholarship_theme || fundingItem.grant_theme || [],
    cycle: fundingItem.cycle || "",
    sponsored_by: fundingItem.sponsored_by || "",
    email: fundingItem.email || "",
    website: fundingItem.website || "",
    country: fundingItem.country || "",
    image: fundingItem.image || "",
    attachment: fundingItem.attachment || "",
    status: fundingItem.status || "draft",
  });

  const [selectedUniversity, setSelectedUniversity] = useState(data.university);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const scholarshipThemeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (scholarshipThemeRef.current && !scholarshipThemeRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleCheckboxChange = (value) => {
    const themeField = itemType === 'grants' ? 'grant_theme' : 'scholarship_theme';
    const currentThemes = data[themeField] || [];
    if (currentThemes.includes(value)) {
      setData(themeField, currentThemes.filter((theme) => theme !== value));
    } else {
      setData(themeField, [...currentThemes, value]);
    }
  };

  const handleSubmit = () => {
    // Create a new object with the common data
    const payload = {
      type: itemType === 'grants' ? 'grant' : 'scholarship',
      title: data.title,
      description: data.description,
      start_date: data.start_date,
      end_date: data.end_date,
      application_deadline: data.application_deadline,
      sponsored_by: data.sponsored_by,
      email: data.email,
      website: data.website,
      country: data.country,
      status: data.status,
    };

    // Add file fields if they exist and are new files
    if (data.image instanceof File) {
      payload.image = data.image;
    } else if (typeof data.image === "string") {
      payload.image = data.image; // Keep existing image path
    }

    if (data.attachment instanceof File) {
      payload.attachment = data.attachment;
    } else if (typeof data.attachment === "string") {
      payload.attachment = data.attachment; // Keep existing attachment path
    }

    // Conditionally add the type-specific fields
    if (itemType === 'grants') {
      payload.grant_type = data.grant_type;
      payload.grant_theme = data.grant_theme;
      payload.cycle = data.cycle;
    } else {
      payload.scholarship_type = data.scholarship_type;
      payload.scholarship_theme = data.scholarship_theme;
    }

    // Convert payload to FormData for file uploads
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      if (payload[key] instanceof File) {
        formData.append(key, payload[key]);
      } else if (Array.isArray(payload[key])) {
        formData.append(key, JSON.stringify(payload[key]));
      } else if (payload[key] !== null && payload[key] !== undefined) {
        formData.append(key, payload[key]);
      }
    });

    // Debug FormData
    console.log('Updating payload for:', itemType);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Submit the clean payload
    post(route("funding.update", { id: fundingItem.id }), {
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      onSuccess: () => {
        alert(`${itemType === 'grants' ? 'Grant' : 'Scholarship'} updated successfully!`);
      },
      onError: (errors) => {
        console.error(`Error updating ${itemType === 'grants' ? 'grant' : 'scholarship'}:`, errors);
        alert(`Failed to update ${itemType === 'grants' ? 'grant' : 'scholarship'}. Please try again.`);
      },
    });
  };

  return (
    <MainLayout title="">
      <Head title={`Edit ${itemType === 'grants' ? 'Grant' : 'Scholarship'}`} />
      <div className="p-4">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="bg-white p-6 lg:p-0 rounded-lg max-w-7xl mx-auto space-y-4 sm:space-y-6"
        >
          <h1 className="text-xl font-bold text-gray-700 text-center">
            Edit {itemType === 'grants' ? 'Grant' : 'Scholarship'}
          </h1>

          {/* Title */}
          <div>
            <InputLabel htmlFor="title" value={<>{itemType === 'grants' ? 'Grant' : 'Scholarship'} Name <span className="text-red-600">*</span></>} />
            <input
              type="text"
              id="title"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Enter grant title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Grant Description */}
          <div>
            <InputLabel htmlFor="description" value={<>{itemType === 'grants' ? 'Grant' : 'Scholarship'} Description <span className="text-red-600">*</span></>} />
            <div
              id="description"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              style={{ height: "300px", overflowY: "auto" }}
            >
              <ReactQuill
                theme="snow"
                value={data.description}
                onChange={(value) => setData("description", value)}
                placeholder="Enter description"
                style={{ height: "300px", maxHeight: "300px" }}
              />
            </div>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Start and End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div>
              <InputLabel htmlFor="start_date" value={<>Start Date (Grant) <span className="text-red-600">*</span></>} />
              <input
                id="start_date"
                type="date"
                value={data.start_date}
                onChange={(e) => setData("start_date", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.start_date && (
                <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>
              )}
            </div>
            <div>
              <InputLabel htmlFor="end_date" value={<>End Date (Grant) <span className="text-red-600">*</span></>} />
              <input
                id="end_date"
                type="date"
                value={data.end_date}
                min={data.start_date || ""}
                onChange={(e) => setData("end_date", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.end_date && (
                <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Application Deadline and Grant Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div>
              <InputLabel htmlFor="application_deadline" value={<>Application Deadline <span className="text-red-600">*</span></>} />
              <input
                id="application_deadline"
                type="date"
                value={data.application_deadline}
                onChange={(e) => setData("application_deadline", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.application_deadline && (
                <p className="text-red-500 text-xs mt-1">{errors.application_deadline}</p>
              )}
            </div>

            <div>
              <InputLabel htmlFor={itemType === 'grants' ? 'grant_type' : 'scholarship_type'} value={<>{itemType === 'grants' ? 'Grant' : 'Scholarship'} Type <span className="text-red-600">*</span></>} />
              <select
                id={itemType === 'grants' ? 'grant_type' : 'scholarship_type'}
                name={itemType === 'grants' ? 'grant_type' : 'scholarship_type'}
                value={data[itemType === 'grants' ? 'grant_type' : 'scholarship_type']}
                onChange={(e) => setData(itemType === 'grants' ? 'grant_type' : 'scholarship_type', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="" disabled hidden>
                  Select a {itemType === 'grants' ? 'Grant' : 'Scholarship'} Type
                </option>
                {itemType === 'grants'
                    ? grantOptions.map(option => <option key={option} value={option}>{option}</option>)
                    : scholarshipOptions.map(option => <option key={option} value={option}>{option}</option>)
                }
              </select>
              {errors[itemType === 'grants' ? 'grant_type' : 'scholarship_type'] && (
                <p className="text-red-500 text-xs mt-1">{errors[itemType === 'grants' ? 'grant_type' : 'scholarship_type']}</p>
              )}
            </div>
          </div>

          {/* Theme and Cycle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div ref={scholarshipThemeRef} key={itemType}>
              <InputLabel htmlFor={itemType === 'grants' ? 'grant_theme' : 'scholarship_theme'} value={<>{itemType === 'grants' ? 'Grant' : 'Scholarship'} Theme (Multiselect) <span className="text-red-600">*</span></>} />
              <div
                id={itemType === 'grants' ? 'grant_theme' : 'scholarship_theme'}
                className={`relative mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 px-2.5 cursor-pointer bg-white ${
                  dropdownOpen ? "shadow-lg" : ""
                }`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {data[itemType === 'grants' ? 'grant_theme' : 'scholarship_theme']?.length > 0
                  ? data[itemType === 'grants' ? 'grant_theme' : 'scholarship_theme'].join(", ")
                  : `Select ${itemType === 'grants' ? 'Grant' : 'Scholarship'} Themes`}
              </div>
              {dropdownOpen && (
                <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded shadow-lg w-full">
                  <div className="p-2 space-y-2">
                    <InputLabel className="flex items-center" htmlFor="theme-science" value="Science & Technology">
                      <input
                        id="theme-science"
                        type="checkbox"
                        value="Science & Technology"
                        checked={data[itemType === 'grants' ? 'grant_theme' : 'scholarship_theme']?.includes("Science & Technology") || false}
                        onChange={(e) => handleCheckboxChange(e.target.value)}
                        className="mr-2"
                      />
                    </InputLabel>
                    <InputLabel className="flex items-center" htmlFor="theme-social" value="Social Science">
                      <input
                        id="theme-social"
                        type="checkbox"
                        value="Social Science"
                        checked={data[itemType === 'grants' ? 'grant_theme' : 'scholarship_theme']?.includes("Social Science") || false}
                        onChange={(e) => handleCheckboxChange(e.target.value)}
                        className="mr-2"
                      />
                    </InputLabel>
                  </div>
                </div>
              )}
              {errors[itemType === 'grants' ? 'grant_theme' : 'scholarship_theme'] && (
                <p className="text-red-500 text-xs mt-1">{errors[itemType === 'grants' ? 'grant_theme' : 'scholarship_theme']}</p>
              )}
            </div>

            {/* Cycle field - only show for grants */}
            {itemType === 'grants' && (
              <div>
                <InputLabel htmlFor="cycle" value={<>Cycle <span className="text-red-600">*</span></>} />
                <select
                  id="cycle"
                  name="cycle"
                  value={data.cycle}
                  onChange={(e) => setData("cycle", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
            )}
          </div>

          {/* Sponsored By and Contact Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div>
              <InputLabel htmlFor="sponsored_by" value={<>Sponsored By <span className="text-red-600">*</span></>} />
              <input
                id="sponsored_by"
                type="text"
                value={data.sponsored_by}
                onChange={(e) => setData("sponsored_by", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Enter sponsor"
              />
              {errors.sponsored_by && (
                <p className="text-red-500 text-xs mt-1">{errors.sponsored_by}</p>
              )}
            </div>
            <div>
              <InputLabel htmlFor="email" value={<>Contact Email <span className="text-red-600">*</span></>} />
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id="usePersonalEmail"
                  checked={data.email === auth.user.email}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData("email", auth.user.email);
                    } else {
                      setData("email", "");
                    }
                  }}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <InputLabel htmlFor="usePersonalEmail" value={`Use personal email (${auth.user.email})`} className="ml-2 text-gray-700" />
              </div>
            </div>
          </div>

          {/* Website and Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div>
              <InputLabel htmlFor="website" value="Website / Link" />
              <input
                id="website"
                type="url"
                value={data.website}
                onChange={(e) => setData("website", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Enter Website / Link"
              />
              {errors.website && (
                <p className="text-red-500 text-xs mt-1">{errors.website}</p>
              )}
            </div>
            <div>
            <NationalityForm
                title={"Country"}
                value={data.country}
                isNotSpecify={true}
                onChange={(value) => setData("country", value)}
                errors={errors}
              />
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">{errors.country}</p>
              )}
            </div>
          </div>

          {/* Image and Attachment Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div>
              <InputLabel htmlFor="image" value="Upload Image" />
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setData("image", e.target.files[0])}
                className="mt-1 block w-full border-gray-300 rounded-md"
              />
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
              {fundingItem.image && (
                <p className="text-gray-600 text-sm mt-2">
                  Current Image:{" "}
                  <a
                    href={`/storage/${fundingItem.image}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Image
                  </a>
                </p>
              )}
            </div>
            <div>
              <InputLabel htmlFor="attachment" value="Upload Attachment" />
              <input
                id="attachment"
                type="file"
                onChange={(e) => setData("attachment", e.target.files[0])}
                className="mt-1 block w-full border-gray-300 rounded-md"
              />
              {errors.attachment && (
                <p className="text-red-500 text-xs mt-1">{errors.attachment}</p>
              )}
              {fundingItem.attachment && (
                <p className="text-gray-600 text-sm mt-2">
                  Current Attachment:{" "}
                  <a
                    href={`/storage/${fundingItem.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Attachment
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => {
                handleSubmit();
              }}
              disabled={processing}
              className="w-full sm:w-auto inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
