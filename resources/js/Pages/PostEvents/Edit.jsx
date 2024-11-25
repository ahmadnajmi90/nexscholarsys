import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";

export default function Edit({ postEvent, auth, isPostgraduate }) {
  const { data, setData, post, processing, errors } = useForm({
    event_name: postEvent.event_name || "",
    description: postEvent.description || "",
    image: postEvent.image || null,
    event_type: postEvent.event_type || "conference",
    theme: postEvent.theme ? JSON.parse(postEvent.theme) : [],
    location: postEvent.location || "",
    start_date_time: postEvent.start_date_time || "",
    end_date_time: postEvent.end_date_time || "",
    organized_by: postEvent.organized_by || "",
    target_audience: postEvent.target_audience ? JSON.parse(postEvent.target_audience) : [],
    registration_url: postEvent.registration_url || "",
    registration_deadline: postEvent.registration_deadline || "",
    fees: postEvent.fees || "",
    contact_email: postEvent.contact_email || "",
    contact_number: postEvent.contact_number || "",
    agenda: postEvent.agenda || "",
    speakers: postEvent.speakers || "",
    sponsors: postEvent.sponsors || "",
    attachment: postEvent.attachment || null,
    event_status: postEvent.event_status || "draft",
    is_featured: postEvent.is_featured || false,
  });

  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [audienceDropdownOpen, setAudienceDropdownOpen] = useState(false);
  const [customTheme, setCustomTheme] = useState("");
  const [customTargetAudience, setCustomTargetAudience] = useState("");

  const handleAddCustomTag = () => {
    if (customTheme.trim() !== "" && !data.theme?.includes(customTheme)) {
      setData("theme", [...(data.theme || []), customTheme]);
      setCustomTheme("");
    } else if (
      customTargetAudience.trim() !== "" &&
      !data.target_audience?.includes(customTargetAudience)
    ) {
      setData("target_audience", [
        ...(data.target_audience || []),
        customTargetAudience,
      ]);
      setCustomTargetAudience("");
    }
  };

  const handleRemoveTheme = (themeToRemove) => {
    setData("theme", data.theme?.filter((theme) => theme !== themeToRemove));
  };

  const handleRemoveTargetAudience = (audienceToRemove) => {
    setData(
      "target_audience",
      data.target_audience?.filter((audience) => audience !== audienceToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Add all data to FormData
    Object.keys(data).forEach((key) => {
      if (key === "theme" || key === "target_audience") {
        formData.append(key, JSON.stringify(data[key]));
      } else if (data[key] instanceof File) {
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
    <MainLayout title="Edit Event" isPostgraduate={isPostgraduate}>
      <div className="p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg max-w-lg mx-auto space-y-6 shadow-lg"
        >
          <h1 className="text-xl font-semibold text-gray-700 text-center">
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
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter Event Name"
            />
            {errors.event_name && (
              <p className="text-red-500 text-xs mt-1">{errors.event_name}</p>
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

          {/* Image */}
          <div>
            <label className="block text-gray-700 font-medium">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setData("image", e.target.files[0]);
                }
              }}
              className="w-full rounded-lg border-gray-200 p-2 text-sm"
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
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-gray-700 font-medium">Event Type</label>
            <select
              value={data.event_type}
              onChange={(e) => setData("event_type", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
            >
              <option value="competition">Competition</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="webinar">Webinar</option>
            </select>
          </div>

          {/* Theme */}
          <div className="relative">
            <label htmlFor="theme" className="block text-gray-700 font-medium">
              Theme
            </label>
            <button
              type="button"
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="w-full text-left border rounded-lg p-2 mt-1 text-sm bg-white"
            >
              Select or Add Theme
            </button>

            {/* Dropdown Menu */}
            {themeDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="flex flex-col p-2 max-h-40 overflow-y-auto">
                  {/* Predefined Theme */}
                  <label className="inline-flex items-center py-1">
                    <input
                      type="checkbox"
                      name="theme"
                      value="Artificial Intelligence"
                      checked={data.theme?.includes("Artificial Intelligence")}
                      onChange={(e) => {
                        const theme = e.target.value;
                        setData(
                          "theme",
                          e.target.checked
                            ? [...(data.theme || []), theme]
                            : data.theme.filter((t) => t !== theme)
                        );
                      }}
                      className="form-checkbox rounded text-blue-500"
                    />
                    <span className="ml-2">Artificial Intelligence</span>
                  </label>

                  <label className="inline-flex items-center py-1">
                    <input
                      type="checkbox"
                      name="theme"
                      value="Quantum Computing"
                      checked={data.theme?.includes("Quantum Computing")}
                      onChange={(e) => {
                        const theme = e.target.value;
                        setData(
                          "theme",
                          e.target.checked
                            ? [...(data.theme || []), theme]
                            : data.theme.filter((t) => t !== theme)
                        );
                      }}
                      className="form-checkbox rounded text-blue-500"
                    />
                    <span className="ml-2">Quantum Computing</span>
                  </label>

                  <label className="inline-flex items-center py-1">
                    <input
                      type="checkbox"
                      name="theme"
                      value="Climate Change"
                      checked={data.theme?.includes("Climate Change")}
                      onChange={(e) => {
                        const theme = e.target.value;
                        setData(
                          "theme",
                          e.target.checked
                            ? [...(data.theme || []), theme]
                            : data.theme.filter((t) => t !== theme)
                        );
                      }}
                      className="form-checkbox rounded text-blue-500"
                    />
                    <span className="ml-2">Climate Change</span>
                  </label>

                  <label className="inline-flex items-center py-1">
                    <input
                      type="checkbox"
                      name="theme"
                      value="Clean Energy"
                      checked={data.theme?.includes("Clean Energy")}
                      onChange={(e) => {
                        const theme = e.target.value;
                        setData(
                          "theme",
                          e.target.checked
                            ? [...(data.theme || []), theme]
                            : data.theme.filter((t) => t !== theme)
                        );
                      }}
                      className="form-checkbox rounded text-blue-500"
                    />
                    <span className="ml-2">Clean Energy</span>
                  </label>

                  <label className="inline-flex items-center py-1">
                    <input
                      type="checkbox"
                      name="theme"
                      value="Robotics"
                      checked={data.theme?.includes("Robotics")}
                      onChange={(e) => {
                        const theme = e.target.value;
                        setData(
                          "theme",
                          e.target.checked
                            ? [...(data.theme || []), theme]
                            : data.theme.filter((t) => t !== theme)
                        );
                      }}
                      className="form-checkbox rounded text-blue-500"
                    />
                    <span className="ml-2">Robotics</span>
                  </label>
                </div>

                {/* Input for Custom Theme */}
                <div className="border-t border-gray-200 p-2 mt-2">
                  <input
                    type="text"
                    value={customTheme}
                    onChange={(e) => setCustomTheme(e.target.value)}
                    placeholder="Add custom theme"
                    className="w-full p-2 border rounded-md text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="mt-2 w-full bg-blue-500 text-white p-2 rounded-md text-sm hover:bg-blue-600"
                  >
                    Add Theme
                  </button>
                </div>
              </div>
            )}

            {/* Display Selected Theme */}
            <div className="mt-3 flex flex-wrap gap-2">
              {data.theme?.map((theme) => (
                <div
                  key={theme}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {theme}
                  <button
                    type="button"
                    onClick={() => handleRemoveTheme(theme)}
                    className="text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            {errors.theme && <p className="text-red-500 text-xs mt-2">{errors.theme}</p>}
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

          {/* Start and End Date Time*/}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">
                Start Date Time
              </label>
              <input
                type="datetime-local"
                value={data.start_date_time}
                onChange={(e) => setData("start_date_time", e.target.value)}
                className="w-full rounded-lg border-gray-200 p-4 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                End Date Time
              </label>
              <input
                type="datetime-local"
                value={data.end_date_time}
                onChange={(e) => setData("end_date_time", e.target.value)}
                className="w-full rounded-lg border-gray-200 p-4 text-sm"
              />
            </div>
          </div>

          {/* Organized By */}
          <div>
            <label className="block text-gray-700 font-medium">
              Organized By
            </label>
            <input
              type="text"
              value={data.organized_by}
              onChange={(e) => setData("organized_by", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter organizer"
            />
          </div>

          {/* Target Audience */}
          <div className="relative">
            <label htmlFor="target_audience" className="block text-gray-700 font-medium">
              Target Audience
            </label>
            <button
  type="button"
  onClick={() => setAudienceDropdownOpen(!audienceDropdownOpen)}
  className="w-full text-left border rounded-lg p-2 mt-1 text-sm bg-white"
>
  Select or Add Target Audience
</button>

            {/* Dropdown Menu */}
            {audienceDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="flex flex-col p-2 max-h-40 overflow-y-auto">
                  {/* Predefined Tags */}
                  <label className="inline-flex items-center py-1">
                    <input
                      type="checkbox"
                      name="target_audience"
                      value="Undergraduates"
                      checked={data.target_audience?.includes("Undergraduates")}
                      onChange={(e) => {
                        const target_audience = e.target.value;
                        setData(
                          "target_audience",
                          e.target.checked
                            ? [...(data.target_audience || []), target_audience]
                            : data.target_audience.filter((t) => t !== target_audience)
                        );
                      }}
                      className="form-checkbox rounded text-blue-500"
                    />
                    <span className="ml-2">Undergraduates</span>
                  </label>

                  <label className="inline-flex items-center py-1">
                    <input
                      type="checkbox"
                      name="target_audience"
                      value="Postgraduates"
                      checked={data.target_audience?.includes("Postgraduates")}
                      onChange={(e) => {
                        const target_audience = e.target.value;
                        setData(
                          "target_audience",
                          e.target.checked
                            ? [...(data.target_audience || []), target_audience]
                            : data.target_audience.filter((t) => t !== target_audience)
                        );
                      }}
                      className="form-checkbox rounded text-blue-500"
                    />
                    <span className="ml-2">Postgraduates</span>
                  </label>

                  <label className="inline-flex items-center py-1">
                    <input
                      type="checkbox"
                      name="target_audience"
                      value="Researchers"
                      checked={data.target_audience?.includes("Researchers")}
                      onChange={(e) => {
                        const target_audience = e.target.value;
                        setData(
                          "target_audience",
                          e.target.checked
                            ? [...(data.target_audience || []), target_audience]
                            : data.target_audience.filter((t) => t !== ttarget_audienceag)
                        );
                      }}
                      className="form-checkbox rounded text-blue-500"
                    />
                    <span className="ml-2">Researchers</span>
                  </label>

                  <label className="inline-flex items-center py-1">
                    <input
                      type="checkbox"
                      name="target_audience"
                      value="Academicians"
                      checked={data.target_audience?.includes("Academicians")}
                      onChange={(e) => {
                        const target_audience = e.target.value;
                        setData(
                          "target_audience",
                          e.target.checked
                            ? [...(data.target_audience || []), target_audience]
                            : data.target_audience.filter((t) => t !== target_audience)
                        );
                      }}
                      className="form-checkbox rounded text-blue-500"
                    />
                    <span className="ml-2">Academicians</span>
                  </label>
                </div>

                {/* Input for Custom Tag */}
                <div className="border-t border-gray-200 p-2 mt-2">
                  <input
                    type="text"
                    value={customTargetAudience}
                    onChange={(e) => setCustomTargetAudience(e.target.value)}
                    placeholder="Add custom target audience"
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
              {data.target_audience?.map((target) => (
                <div
                  key={target}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {target}
                  <button
                    type="button"
                    onClick={() => handleRemoveTargetAudience(target)}
                    className="text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            {errors.target_audience && <p className="text-red-500 text-xs mt-2">{errors.target_audience}</p>}
          </div>

          {/* Registration URL */}
          <div>
              <label className="block text-gray-700 font-medium">
                Registration URL
              </label>
              <input
                  type="url"
                  value={data.registration_url}
                  onChange={(e) => setData("registration_url", e.target.value)}
                  className="w-full rounded-lg border-gray-200 p-4 text-sm"
                  placeholder="Enter registration URL"
              />
              {errors.registration_url && (
                  <p className="text-red-500 text-xs mt-1">{errors.registration_url}</p>
              )}
          </div>

          {/* Registration deadline*/}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">
                Registration deadline
              </label>
              <input
                type="date"
                value={data.registration_deadline}
                onChange={(e) => setData("registration_deadline", e.target.value)}
                className="w-full rounded-lg border-gray-200 p-4 text-sm"
              />
            </div>
          </div>

          {/* Fees */}
          <div>
            <label className="block text-gray-700 font-medium">Fees</label>
            <input
              type="number"
              value={data.fees}
              onChange={(e) => setData("fees", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter fees (e.g., 5000.00)"
            />
          </div>

          {/*Contact Email */}
          <div>
              <label className="block text-gray-700 font-medium">Contact Email</label>
              <input
                  type="email"
                  value={data.contact_email}
                  onChange={(e) => setData("contact_email", e.target.value)}
                  className="w-full rounded-lg border-gray-200 p-4 text-sm"
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

            {/* Agenda */}
            <div>
            <label className="block text-gray-700 font-medium">Agenda</label>
            <textarea
              value={data.agenda}
              onChange={(e) => setData("agenda", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter agenda"
            ></textarea>
            {errors.agenda && <p className="text-red-500 text-xs mt-1">{errors.agenda}</p>}
            </div>

            {/* Speakers */}
            <div>
            <label className="block text-gray-700 font-medium">Speakers</label>
            <textarea
              value={data.speakers}
              onChange={(e) => setData("speakers", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter speakers"
            ></textarea>
            {errors.speakers && <p className="text-red-500 text-xs mt-1">{errors.speakers}</p>}
            </div>

            {/* Sponsors */}
            <div>
            <label className="block text-gray-700 font-medium">Sponsors</label>
            <textarea
              value={data.sponsors}
              onChange={(e) => setData("sponsors", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
              placeholder="Enter sponsors"
            ></textarea>
            {errors.sponsors && <p className="text-red-500 text-xs mt-1">{errors.sponsors}</p>}
            </div>

            {/* Attachment Upload */}
            <div>
                <label className="block text-gray-700 font-medium">
                    Upload Attachment
                </label>
                <input
                    type="file"
                    onChange={(e) => setData("attachment", e.target.files[0])}
                    className="w-full rounded-lg border-gray-200 p-2 text-sm"
                />
                {postEvent.attachment && (
                  <p className="text-gray-600 text-sm mt-2">
                    Current Attachment:{" "}
                    <a
                      href={`/storage/${postEvent.attachment}`}
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
            </div>

          {/* Event Status */}
          <div>
            <label className="block text-gray-700 font-medium">Event Status</label>
            <select
              value={data.event_status}
              onChange={(e) => setData("event_status", e.target.value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Featured Event */}
          <div>
            <label className="block text-gray-700 font-medium">
              Featured Event
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
