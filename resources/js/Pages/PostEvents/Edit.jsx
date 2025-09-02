import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import NationalityForm from "../Role/Partials/NationalityForm";
import useRoles from "../../Hooks/useRoles";
import InputLabel from '@/Components/InputLabel';
import Select from "react-select";
import { Head } from '@inertiajs/react';

export default function Edit({ postEvent, auth }) {
  const { auth: user, researchOptions } = usePage().props;
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
    field_of_research: postEvent.field_of_research || [],
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
    Object.keys(data).forEach((key) => {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });

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
      <Head title="Edit Event" />
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

        <form onSubmit={handleSubmit} className="bg-white p-6 lg:p-0 rounded-lg max-w-7xl mx-auto space-y-4 md:space-y-6">
          <h1 className="text-xl font-bold text-gray-700 text-center">Edit Event</h1>

          {/* Event Name */}
          <div>
            <InputLabel>
              Event Name <span className="text-red-600">*</span>
            </InputLabel>
            <input
              type="text"
              value={data.event_name}
              onChange={(e) => setData("event_name", e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Enter Event Name"
            />
            {errors.event_name && (
              <p className="text-red-500 text-xs mt-1">{errors.event_name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <InputLabel>
              Event Description <span className="text-red-600">*</span>
            </InputLabel>
            <div
              className="mt-1 w-full rounded-lg border border-gray-200 overflow-auto"
              style={{ height: "300px", overflowY: "auto" }}
            >
              <ReactQuill
                theme="snow"
                value={data.description}
                onChange={(value) => setData("description", value)}
                style={{ height: "300px", maxHeight: "300px" }}
                className="text-sm"
                placeholder="Enter description"
              />
            </div>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Event Type and Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <InputLabel>Event Type <span className="text-red-600">*</span></InputLabel>
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
              {errors.event_type && (
                <p className="text-red-500 text-xs mt-1">{errors.event_type}</p>
              )}
            </div>

            <div>
              <InputLabel>Event Mode <span className="text-red-600">*</span></InputLabel>
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
              {errors.event_mode && (
                <p className="text-red-500 text-xs mt-1">{errors.event_mode}</p>
              )}
            </div>
          </div>

          {/* Start/End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <InputLabel>Start Date <span className="text-red-600">*</span></InputLabel>
              <input
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
              <InputLabel>End Date <span className="text-red-600">*</span></InputLabel>
              <input
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

          {/* Start/End Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <InputLabel>Start Time <span className="text-red-600">*</span></InputLabel>
              <input
                type="time"
                value={data.start_time}
                onChange={(e) => setData("start_time", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.start_time && (
                <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>
              )}
            </div>
            <div>
              <InputLabel>End Time <span className="text-red-600">*</span></InputLabel>
              <input
                type="time"
                value={data.end_time}
                onChange={(e) => setData("end_time", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.end_time && (
                <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>
              )}
            </div>
          </div>

          {/* Event Theme and Field of Research */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <InputLabel>Event Theme <span className="text-red-600">*</span></InputLabel>
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
              {errors.event_theme && (
                <p className="text-red-500 text-xs mt-1">{errors.event_theme}</p>
              )}
            </div>
            <div>
              <InputLabel>Field of Research <span className="text-red-600">*</span></InputLabel>
              <Select
                id="field_of_research"
                isMulti
                options={researchOptions.map((option) => ({
                  value: `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}`,
                  label: `${option.field_of_research_name} - ${option.research_area_name} - ${option.niche_domain_name}`,
                }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                classNamePrefix="select"
                value={
                  data.field_of_research?.map((selectedValue) => {
                    const matchedOption = researchOptions.find(
                      (option) =>
                        `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === selectedValue
                    );
                    return {
                      value: selectedValue,
                      label: matchedOption
                        ? `${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`
                        : selectedValue,
                    };
                  })
                }
                onChange={(selectedOptions) => {
                  const selectedValues = selectedOptions.map((option) => option.value);
                  setData("field_of_research", selectedValues);
                }}
                placeholder="Search and select fields of research..."
              />
              {errors.field_of_research && (
                <p className="text-red-500 text-xs mt-1">{errors.field_of_research}</p>
              )}
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
              {errors.registration_url && (
                <p className="text-red-500 text-xs mt-1">{errors.registration_url}</p>
              )}
            </div>
            <div>
              <InputLabel>Registration Deadline <span className="text-red-600">*</span></InputLabel>
              <input
                type="date"
                value={data.registration_deadline}
                onChange={(e) => setData("registration_deadline", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.registration_deadline && (
                <p className="text-red-500 text-xs mt-1">{errors.registration_deadline}</p>
              )}
            </div>
          </div>

          {/* Venue, City and Country */}
          {data.event_mode != "Online" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <InputLabel>Venue <span className="text-red-600">*</span></InputLabel>
              <input
                type="text"
                value={data.venue}
                onChange={(e) => setData("venue", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Enter venue"
              />
              {errors.venue && (
                <p className="text-red-500 text-xs mt-1">{errors.venue}</p>
              )}
            </div>
            <div>
              <InputLabel>City <span className="text-red-600">*</span></InputLabel>
              <input
                type="text"
                value={data.city}
                onChange={(e) => setData("city", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <NationalityForm
                title={"Country"}
                value={data.country}
                onChange={(value) => setData('country', value)}
                errors={errors}
              />
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">{errors.country}</p>
              )}
            </div>
          </div>
          )}

          {/* Contact Email and Upload Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <InputLabel>Contact Email <span className="text-red-600">*</span></InputLabel>
              <input
                type="email"
                value={data.contact_email}
                onChange={(e) => setData("contact_email", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Enter contact email"
              />
              {errors.contact_email && (
                <p className="text-red-500 text-xs mt-1">{errors.contact_email}</p>
              )}
              {/* Use Personal Email Checkbox */}
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id="usePersonalEmail"
                  checked={data.contact_email === auth.user.email}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData("contact_email", auth.user.email);
                    } else {
                      setData("contact_email", "");
                    }
                  }}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <InputLabel htmlFor="usePersonalEmail" className="ml-2 text-gray-700">
                  Use personal email ({auth.user.email})
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
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
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
