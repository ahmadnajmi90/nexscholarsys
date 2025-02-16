import React from "react";
import { useForm, usePage } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";
import { useState, useEffect, useRef } from "react";
import NationalityForm from "../Role/Partials/NationalityForm";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useRoles from "../../Hooks/useRoles";
import InputLabel from '@/Components/InputLabel';

export default function Create() {
  const { auth } = usePage().props;
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const grantThemeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (grantThemeRef.current && !grantThemeRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleCheckboxChange = (value) => {
    if (data.grant_theme.includes(value)) {
      setData("grant_theme", data.grant_theme.filter((theme) => theme !== value));
    } else {
      setData("grant_theme", [...data.grant_theme, value]);
    }
  };

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

  function handleSubmit(e) {
    if (e) e.preventDefault();

    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
      console.log(`${key}: ${typeof value}`);
    }

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
    <MainLayout title="">
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg max-w-7xl mx-auto space-y-6"
        >
          <h1 className="text-xl font-bold text-gray-700 text-center">Add New Grant</h1>

          {/* Grant Name */}
          <div>
            <InputLabel htmlFor="title" value="Grant Name" required />
            <input
              id="title"
              type="text"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Enter grant title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <InputLabel htmlFor="description" value="Grant Description" required />
            <div
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              style={{
                height: "300px",
                overflowY: "auto",
              }}
            >
              <ReactQuill
                theme="snow"
                value={data.description}
                onChange={(value) => setData("description", value)}
                placeholder="Enter description"
                style={{
                  height: "300px",
                  maxHeight: "300px",
                }}
              />
            </div>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Start and End Date */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <InputLabel htmlFor="start_date" value="Start Date (Grant)" />
              <input
                id="start_date"
                type="date"
                value={data.start_date}
                onChange={(e) => setData("start_date", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <InputLabel htmlFor="end_date" value="End Date (Grant)" />
              <input
                id="end_date"
                type="date"
                value={data.end_date}
                min={data.start_date || ""}
                onChange={(e) => setData("end_date", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Application Deadline and Grant Type */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <InputLabel htmlFor="application_deadline" value="Application Deadline" />
              <input
                id="application_deadline"
                type="date"
                value={data.application_deadline}
                onChange={(e) => setData("application_deadline", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <InputLabel htmlFor="grant_type" value="Grant Type" />
              <select
                id="grant_type"
                value={data.grant_type}
                onChange={(e) => setData("grant_type", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
            <div ref={grantThemeRef}>
              <InputLabel value="Grant Theme (Multiselect)" />
              <div
                className={`relative mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 px-2.5 cursor-pointer bg-white ${
                  dropdownOpen ? "shadow-lg" : ""
                }`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {data.grant_theme && data.grant_theme.length > 0
                  ? data.grant_theme.join(", ")
                  : "Select Grant Themes"}
              </div>
              {dropdownOpen && (
                <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded shadow-lg w-[37.5rem]">
                  <div className="p-2 space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="Science & Technology"
                        checked={data.grant_theme.includes("Science & Technology")}
                        onChange={(e) => handleCheckboxChange(e.target.value)}
                        className="mr-2"
                      />
                      <span>Science & Technology</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="Social Science"
                        checked={data.grant_theme.includes("Social Science")}
                        onChange={(e) => handleCheckboxChange(e.target.value)}
                        className="mr-2"
                      />
                      <span>Social Science</span>
                    </label>
                  </div>
                </div>
              )}
              {errors.grant_theme && (
                <p className="text-red-500 text-xs mt-1">{errors.grant_theme}</p>
              )}
            </div>

            <div>
              <InputLabel htmlFor="cycle" value="Cycle" />
              <select
                id="cycle"
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
          </div>

          {/* Sponsored By and Contact Email */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <InputLabel htmlFor="sponsored_by" value="Sponsored By" />
              <input
                id="sponsored_by"
                type="text"
                value={data.sponsored_by}
                onChange={(e) => setData("sponsored_by", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Enter sponsor"
              />
            </div>
            <div>
              <InputLabel htmlFor="email" value="Contact Email" />
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Enter email"
              />
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id="usePersonalEmail"
                  checked={data.email === auth.email}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData("email", auth.email);
                    } else {
                      setData("email", "");
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
                title="Country"
                value={data.country}
                isNotSpecify={true}
                onChange={(value) => setData("country", value)}
              />
            </div>
          </div>

          {/* Image and Attachment Upload */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <InputLabel htmlFor="image" value="Upload Image" />
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setData("image", e.target.files[0])}
                className="mt-1 block w-full border-gray-300 rounded-md py-2 text-sm"
              />
            </div>
            <div>
              <InputLabel htmlFor="attachment" value="Upload Attachment" />
              <input
                id="attachment"
                type="file"
                onChange={(e) => setData("attachment", e.target.files[0])}
                className="mt-1 block w-full border-gray-300 rounded-md py-2 text-sm"
              />
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
