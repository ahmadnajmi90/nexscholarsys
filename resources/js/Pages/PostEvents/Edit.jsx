import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import NationalityForm from "../Role/Partials/NationalityForm";
import useRoles from "../../Hooks/useRoles";

export default function Edit({ postEvent, auth }) {
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
  const { data, setData, post, processing, errors } = useForm({
    event_name: postEvent.event_name || "",
    description: postEvent.description || "",
    event_type: postEvent.event_type || "",
    event_mode: postEvent.event_mode || "",
    start_date: postEvent.start_date || "",
    end_date: postEvent.end_date || "",
    start_time: postEvent.start_time || "",
    end_time: postEvent.end_time || "",
    image: postEvent.image || null,
    event_theme: postEvent.event_theme || "",
    registration_url: postEvent.registration_url || "",
    registration_deadline: postEvent.registration_deadline || "",
    contact_email: postEvent.contact_email || "",
    venue: postEvent.venue || "",
    city: postEvent.city || "",
    country: postEvent.country || "",
    event_status: postEvent.event_status || "published",
  });

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const formData = new FormData();

    // Add all data to FormData
    Object.keys(data).forEach((key) => {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });

    // Debug FormData
    console.log("Form Data Contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    post(route("post-events.update", postEvent.id), {
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      onSuccess: () => {
        alert("Event updated successfully!");
      },
      onError: (errors) => {
        console.error("Error updating event:", errors);
        alert("Failed to update the event. Please try again.");
      },
    });
  };

  return (
    <MainLayout title="">
  <div className="p-4">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg max-w-7xl mx-auto space-y-6"
    >
      <h1 className="text-xl font-bold text-gray-700 text-center">
        Edit Event
      </h1>

      {/* Event Name */}
      <div>
        <label className="block text-gray-700 font-medium">
          Event Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.event_name}
          onChange={(e) => setData("event_name", e.target.value)}
          className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
          placeholder="Enter Event Name"
        />
        {errors.event_name && (
          <p className="text-red-500 text-xs mt-1">{errors.event_name}</p>
        )}
      </div>

   {/* Description */}
<div>
  <label className="block text-gray-700 font-medium">
    Event Description <span className="text-red-500">*</span>
  </label>
  <div
    className="mt-1 w-full rounded-lg border border-gray-200 overflow-auto"
    style={{
        height: "300px", // Set a default height
        overflowY: "auto", // Add vertical scrollbar]

      }}
  >
    <ReactQuill
      theme="snow"
      value={data.description}
      onChange={(value) => setData("description", value)}
      style={{
        height: "300px", // Set height for the editor content area
        maxHeight: "300px", // Restrict content height
      }}
      className="text-sm"
      placeholder="Enter description"
    />
  </div>
  {errors.description && (
    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
  )}
</div>


      {/* Event Type and Location */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className="block text-gray-700 font-medium">Event Type</label>
          <select
            id="event_type"
            name="event_type"
            value={data.event_type}
            onChange={(e) => setData("event_type", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
          >
            <option value="" disabled hidden>Select Event Type</option>
            <option value="Competition">Competition</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Webinar">Webinar</option>
          </select>
          {errors.event_type && (
            <p className="text-red-500 text-xs mt-1">{errors.event_type}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Event Mode</label>
          <select
            id="event_mode"
            name="event_mode"
            value={data.event_mode}
            onChange={(e) => setData("event_mode", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
          >
            <option value="" disabled hidden>Select Event Mode</option>
            <option value="Physical">Physical</option>
            <option value="Online">Online</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          {errors.event_mode && (
            <p className="text-red-500 text-xs mt-1">{errors.event_mode}</p>
          )}
        </div>
      </div>

      {/* Start Date Time and End Date Time */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className="block text-gray-700 font-medium">
            Start Date
          </label>
          <input
            type="date"
            value={data.start_date}
            onChange={(e) => setData("start_date", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">
            End Date
          </label>
          <input
            type="date"
            value={data.end_date}
            min={data.start_date || ''}
            onChange={(e) => setData("end_date", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className="block text-gray-700 font-medium">
            Start Time
          </label>
          <input
            type="time"
            value={data.start_time}
            onChange={(e) => setData("start_time", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">
            End Time
          </label>
          <input
            type="time"
            value={data.end_time}
            onChange={(e) => setData("end_time", e.target.value)}
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
          {postEvent.image && (
              <p className="text-gray-600 text-sm mt-2">
                Current Image:{" "}
                <a
                  href={`/storage/${postEvent.image}`}
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
          <label className="block text-gray-700 font-medium">Event Theme</label>
          <select
            id="event_theme"
            name="event_theme"
            value={data.event_theme}
            onChange={(e) => setData("event_theme", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
          >
            <option value="" disabled hidden>Select Event Theme</option>
            <option value="Science and Technology">Science and Technology</option>
            <option value="Social Science">Social Science</option>
          </select>
          {errors.event_theme && (
            <p className="text-red-500 text-xs mt-1">{errors.event_theme}</p>
          )}
        </div>
      </div>

      {/* Registration URL and Deadline */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className="block text-gray-700 font-medium">
            Registration URL
          </label>
          <input
            type="url"
            value={data.registration_url}
            onChange={(e) => setData("registration_url", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            placeholder="Enter registration URL"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">
            Registration Deadline
          </label>
          <input
            type="date"
            value={data.registration_deadline}
            onChange={(e) => setData("registration_deadline", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
          />
        </div>
      </div>

      {/* Fees and Contact Email */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-700 font-medium">Venue</label>
          <input
            type="text"
            value={data.venue}
            onChange={(e) => setData("venue", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            placeholder="Enter venue"
          />
          {errors.venue && (
            <p className="text-red-500 text-xs mt-1">{errors.venue}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">City</label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => setData("city", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            placeholder="Enter city"
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <NationalityForm title={"Country"} value={data.country} onChange={(value) => setData('country', value)} />
        </div>

      </div>

      {/* Fees and Contact Email */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className="block text-gray-700 font-medium">Contact Email</label>
          <input
            type="email"
            value={data.contact_email}
            onChange={(e) => setData("contact_email", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            placeholder="Enter contact email"
          />
           {/* Use Personal Email Checkbox */}
           <div className="mt-2 flex items-center">
                  <input
                      type="checkbox"
                      id="usePersonalEmail"
                      checked={data.contact_email === auth.email}
                      onChange={(e) => {
                          if (e.target.checked) {
                              setData("contact_email", auth.email); // Set email to personal email
                          } else {
                              setData("contact_email", ""); // Clear email field
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
