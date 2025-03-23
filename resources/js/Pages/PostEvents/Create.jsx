import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import NationalityForm from "../Role/Partials/NationalityForm";
import useRoles from "../../Hooks/useRoles";
import InputLabel from '@/Components/InputLabel';
import Select from "react-select";

export default function Create() {
  // Now include researchOptions from Inertia props
  const { auth, researchOptions } = usePage().props;
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();

  // Added field_of_research as an empty array in initial form data
  const { data, setData, post, processing, errors } = useForm({
    event_name: "",
    description: "",
    event_type: "",
    event_mode: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    image: null,
    event_theme: "",
    field_of_research: [],
    registration_url: "",
    registration_deadline: "",
    contact_email: "",
    venue: "",
    city: "",
    country: "",
    event_status: "published",
  });

  function handleSubmit(e) {
    if (e) e.preventDefault();

    const formData = new FormData();
    console.log("Data: ", data);

    // Add all other fields to FormData
    Object.keys(data).forEach((key) => {
      // You could check for files if needed, here we append regardless
      formData.append(key, data[key]);
    });

    // Debug FormData
    console.log("Form Data Contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    // Submit the form using Inertia.js
    post(route("post-events.store"), {
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      onSuccess: () => {
        alert("Event posted successfully.");
      },
      onError: (errors) => {
        console.error("Error updating event:", errors);
        alert("Failed to post the Event. Please try again.");
      },
    });
  }

  return (
    <MainLayout title="">
      <div className="p-4">
        <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-lg max-w-7xl mx-auto space-y-4 md:space-y-6">
          <h1 className="text-xl font-bold text-gray-700 text-center">Add New Event</h1>

          {/* Event Name */}
          <div>
            <InputLabel>
              Event Name <span className="text-red-500">*</span>
            </InputLabel>
            <input
              type="text"
              value={data.event_name}
              onChange={(e) => setData("event_name", e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Enter Event Name"
            />
            {errors.event_name && <p className="text-red-500 text-xs mt-1">{errors.event_name}</p>}
          </div>

          {/* Description */}
          <div>
            <InputLabel>
              Event Description <span className="text-red-500">*</span>
            </InputLabel>
            <div
              className="mt-1 w-full rounded-lg border border-gray-200"
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
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Event Type and Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <InputLabel>Event Type</InputLabel>
              <select
                id="event_type"
                name="event_type"
                value={data.event_type}
                onChange={(e) => setData("event_type", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="" disabled hidden>
                  Select Event Type
                </option>
                <option value="Competition">Competition</option>
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Webinar">Webinar</option>
              </select>
              {errors.event_type && <p className="text-red-500 text-xs mt-1">{errors.event_type}</p>}
            </div>

            <div>
              <InputLabel>Event Mode</InputLabel>
              <select
                id="event_mode"
                name="event_mode"
                value={data.event_mode}
                onChange={(e) => setData("event_mode", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="" disabled hidden>
                  Select Event Mode
                </option>
                <option value="Physical">Physical</option>
                <option value="Online">Online</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              {errors.event_mode && <p className="text-red-500 text-xs mt-1">{errors.event_mode}</p>}
            </div>
          </div>

          {/* Start and End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <InputLabel>Start Date</InputLabel>
              <input
                type="date"
                value={data.start_date}
                onChange={(e) => setData("start_date", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
            </div>
            <div>
              <InputLabel>End Date</InputLabel>
              <input
                type="date"
                value={data.end_date}
                min={data.start_date || ""}
                onChange={(e) => setData("end_date", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
            </div>
          </div>

          {/* Start and End Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <InputLabel>Start Time</InputLabel>
              <input
                type="time"
                value={data.start_time}
                onChange={(e) => setData("start_time", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.start_time && <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>}
            </div>
            <div>
              <InputLabel>End Time</InputLabel>
              <input
                type="time"
                value={data.end_time}
                onChange={(e) => setData("end_time", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.end_time && <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>}
            </div>
          </div>

          {/* Event Theme and Field of Research */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <InputLabel>Event Theme</InputLabel>
              <select
                id="event_theme"
                name="event_theme"
                value={data.event_theme}
                onChange={(e) => setData("event_theme", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="" disabled hidden>
                  Select Event Theme
                </option>
                <option value="Science and Technology">Science and Technology</option>
                <option value="Social Science">Social Science</option>
              </select>
              {errors.event_theme && <p className="text-red-500 text-xs mt-1">{errors.event_theme}</p>}
            </div>
            <div>
              <InputLabel>Field of Research</InputLabel>
              <Select
                id="field_of_research"
                isMulti
                options={researchOptions.map((option) => ({
                  value: `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}`,
                  label: `${option.field_of_research_name} - ${option.research_area_name} - ${option.niche_domain_name}`,
                }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                classNamePrefix="select"
                value={data.field_of_research?.map((selectedValue) => {
                  const matchedOption = researchOptions.find(
                    (option) =>
                      `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` ===
                      selectedValue
                  );
                  return {
                    value: selectedValue,
                    label: matchedOption
                      ? `${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`
                      : selectedValue,
                  };
                })}
                onChange={(selectedOptions) => {
                  const selectedValues = selectedOptions.map((option) => option.value);
                  setData("field_of_research", selectedValues);
                }}
                placeholder="Search and select fields of research..."
              />
              {errors.field_of_research && <p className="text-red-500 text-xs mt-1">{errors.field_of_research}</p>}
            </div>
          </div>

          {/* Registration URL and Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <InputLabel>Registration URL</InputLabel>
              <input
                type="url"
                value={data.registration_url}
                onChange={(e) => setData("registration_url", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Enter registration URL"
              />
              {errors.registration_url && <p className="text-red-500 text-xs mt-1">{errors.registration_url}</p>}
            </div>
            <div>
              <InputLabel>Registration Deadline</InputLabel>
              <input
                type="date"
                value={data.registration_deadline}
                onChange={(e) => setData("registration_deadline", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.registration_deadline && <p className="text-red-500 text-xs mt-1">{errors.registration_deadline}</p>}
            </div>
          </div>

          {/* Venue, City and Country */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <InputLabel>Venue</InputLabel>
              <input
                type="text"
                value={data.venue}
                onChange={(e) => setData("venue", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Enter venue"
              />
              {errors.venue && <p className="text-red-500 text-xs mt-1">{errors.venue}</p>}
            </div>
            <div>
              <InputLabel>City</InputLabel>
              <input
                type="text"
                value={data.city}
                onChange={(e) => setData("city", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Enter city"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
            <div>
              <NationalityForm title={"Country"} value={data.country} onChange={(value) => setData('country', value)} />
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            </div>
          </div>

          {/* Contact Email and Upload Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <InputLabel>Contact Email</InputLabel>
              <input
                type="email"
                value={data.contact_email}
                onChange={(e) => setData("contact_email", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Enter contact email"
              />
              {errors.contact_email && <p className="text-red-500 text-xs mt-1">{errors.contact_email}</p>}
              {/* Use Personal Email Checkbox */}
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id="usePersonalEmail"
                  checked={data.contact_email === auth.email}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData("contact_email", auth.email);
                    } else {
                      setData("contact_email", "");
                    }
                  }}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <InputLabel htmlFor="usePersonalEmail" className="ml-2 text-gray-700">
                  Use personal email ({auth.email})
                </InputLabel>
              </div>
            </div>
            <div>
              <InputLabel>Upload Image</InputLabel>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setData("image", e.target.files[0])}
                className="mt-1 block w-full border-gray-300 rounded-md py-2"
              />
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center md:justify-start space-x-4">
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={processing}
              className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600 w-full md:w-auto"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
