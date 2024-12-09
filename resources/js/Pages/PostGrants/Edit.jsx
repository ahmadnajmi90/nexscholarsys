import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";
import NationalityForm from "../Role/Partials/NationalityForm";
import Select from "react-select";


export default function Edit({ postGrant, auth, isPostgraduate, researchOptions, universities }) {
  const { data, setData, post, processing, errors } = useForm({
    title: postGrant.title || "",
    description: postGrant.description || "",
    start_date: postGrant.start_date || "",
    end_date: postGrant.end_date || "",
    application_deadline: postGrant.application_deadline || "",
    duration: postGrant.duration || "",
    sponsored_by: postGrant.sponsored_by || "",
    category: postGrant.category || "",
    field_of_research: postGrant.field_of_research || [],
    supervisor_category: postGrant.supervisor_category || "",
    supervisor_name: postGrant.supervisor_name || "",
    university: postGrant.university || "",
    email: postGrant.email || "",
    origin_country: postGrant.origin_country || "",
    purpose: postGrant.purpose || "",
    student_nationality: postGrant.student_nationality || "",
    student_level: postGrant.student_level || "",
    appointment_type: postGrant.appointment_type || "",
    purpose_of_collaboration: postGrant.purpose_of_collaboration || "",
    image: postGrant.image || "",
    attachment: postGrant.attachment || "",
    amount: postGrant.amount || "",
    application_url: postGrant.application_url || "",
    status: postGrant.status || "draft",
  });

  const [selectedUniversity, setSelectedUniversity] = useState(data.university);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const formData = new FormData();

    // Add all data to FormData
    Object.keys(data).forEach((key) => {
        if (key === 'image' || key === 'attachment') {
          // Check if the field contains a file or existing path
          if (data[key] instanceof File) {
              formData.append(key, data[key]); // Append file
          } else if (typeof data[key] === 'string') {
              formData.append(key, data[key]); // Append existing path
          }
        } else if (Array.isArray(data[key])) {
            formData.append(key, JSON.stringify(data[key])); // Convert arrays to JSON
        } else if (Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key])); // Convert arrays to JSON strings
        }
          else {
              formData.append(key, data[key]);
          }
    });

    // Debug FormData
    console.log("Form Data Contents:");
    for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
    }

    post(route('post-grants.update', postGrant.id), {
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      onSuccess: () => {
        alert("Grant updated successfully!");
      },
      onError: (errors) => {
          console.error('Error updating grant:', errors);
          alert("Failed to update the grant. Please try again.");
      },
    });
};

  return (
    <MainLayout title="" isPostgraduate={isPostgraduate}>
    <div className="p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg max-w-7xl mx-auto space-y-6"
      >
        <h1 className="text-xl font-bold text-gray-700 text-center">
          Edit Grant
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

        {/* Grant Description */}
        <div>
          <label className="block text-gray-700 font-medium">
            Grant Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            placeholder="Enter description"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Start and End Date */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-gray-700 font-medium">Start Date</label>
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
            <label className="block text-gray-700 font-medium">End Date</label>
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
              min={data.start_date || ""} // Set the minimum date to start_date
              max={data.end_date || ""} // Set the maximum date to end_date
              onChange={(e) => setData("application_deadline", e.target.value)}
              className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            />
          </div>

          <div>
            <label className="mt-1 block text-gray-700 font-medium">Duration (in months)</label>
            <input
            type="number"
            value={data.duration}
            onChange={(e) => setData("duration", e.target.value)}
            className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            placeholder="Enter grant duration"
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
              className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
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
              className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
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

        {/* Field of Research and Grant Supervisor */}
        <div className="grid grid-cols-2 gap-8">
{/* Research Expertise Searchable Dropdown */}
{(data.category === "Fundamental Research" ||
  data.category === "Applied Research" ||
  data.category === "Fundamental + Applied") && (
    <div className="w-full">
      <label htmlFor="field_of_research" className="block text-sm font-medium text-gray-700">
        Field of Research (Multiple Selection)
      </label>
      <Select
        id="field_of_research"
        isMulti
        options={researchOptions.map((option) => ({
          value: `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}`,
          label: `${option.field_of_research_name} - ${option.research_area_name} - ${option.niche_domain_name}`,
        }))}
        className="mt-1"
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
          setData('field_of_research', selectedValues); // Update with selected values
        }}
        placeholder="Search and select fields of research..."
      />
    </div>
)}


          <div>
            <label className="block text-gray-700 font-medium">Grant Supervisor / Project Learder</label>
            <select
              value={data.supervisor_category}
              onChange={(e) => setData("supervisor_category", e.target.value)}
              className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            >
              <option value="Own Name">Own Name</option>
              <option value="On Behalf">On Behalf</option>
            </select>
          </div>
        </div>

        {data.supervisor_category === "On Behalf" && (
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="mt-1 block text-gray-700 font-medium">Grant Supervisor / Project Leader Name</label>
                <input
                  type="text"
                  value={data.supervisor_name}
                  onChange={(e) => setData("supervisor_name", e.target.value)}
                  className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
                />
              </div>

              <div>
                <label className="mt-1 block text-gray-700 font-medium">University</label>
                <select
                    id="university"
                    className="mt-1 block w-full border rounded-md p-2"
                    value={selectedUniversity || ''}
                    onChange={(e) => {
                        const universityId = e.target.value;
                        setSelectedUniversity(universityId);
                        setData('university', universityId);
                    }}
                >
                    <option value="" hidden>Select your University</option>
                    {universities.map((university) => (
                        <option key={university.id} value={university.id}>
                            {university.full_name}
                        </option>
                    ))}
                </select>
            </div>
          </div>
        )}

        {/* Email and Contact Number */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
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
            <NationalityForm title={"Grant Origin Country"} value={data.origin_country} onChange={(value) => setData('origin_country', value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-gray-700 font-medium">Grant Purpose</label>
            <select
              value={data.purpose}
              onChange={(e) => setData("purpose", e.target.value)}
              className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            >
              <option value="" disabled hidden>Select Grant Purpose</option>
              <option value="find_pgstudent">Find Postgraduate Student</option>
              <option value="find_academic_collaboration">Find Academic Collaboration</option>
              <option value="find_industry_collaboration">Find Industry Collaboration - Matching Grant</option>
            </select>
          </div>
        </div>

        {data.purpose === "find_pgstudent" ? (
          <>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <NationalityForm title={"Student Nationality"} value={data.student_nationality} onChange={(value) => setData('student_nationality', value)} />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Level of Study</label>
                <select
                  value={data.student_level}
                  onChange={(e) => setData("student_level", e.target.value)}
                  className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
                >
                  <option value= "" disabled hidden>Select Level of Study</option>
                  <option value="Master">Master</option>
                  <option value="Ph.D.">Ph.D.</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Appointment Type</label>
              <select
                value={data.appointment_type}
                onChange={(e) => setData("appointment_type", e.target.value)}
                className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
              >
                <option value="" disabled hidden>Select Appointment Type</option>
                <option value="Research Assistant (RA)">Research Assistant (RA)</option>
                <option value="Graduate Assistant (GA)">Graduate Assistant (GA)</option>
                <option value="Teaching Assistant (TA)">Teaching Assistant (TA)</option>
                <option value="Research Fellow (RF)">Research Fellow (RF)</option>
                <option value="Project Assistant (PA)">Project Assistant (PA)</option>
                <option value="Technical Assistant (TA)">Technical Assistant (TA)</option>
                <option value="Graduate Research Assistant (GRA)">Graduate Research Assistant (GRA)</option>
                <option value="Scholarship Recipient">Scholarship Recipient</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
            </>
          ):
          (
            <div>
              <label className="block text-gray-700 font-medium">
                Purpose of Collaboration
              </label>
              <textarea
                value={data.purpose_of_collaboration}
                onChange={(e) => setData("purpose_of_collaboration", e.target.value || "")}
                className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
                placeholder="Enter Purpose of Collaboration"
              ></textarea>
              {errors.purpose_of_collaboration && (
                <p className="text-red-500 text-xs mt-1">{errors.purpose_of_collaboration}</p>
              )}
            </div>
          )}

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

            {postGrant.image && (
              <p className="text-gray-600 text-sm mt-2">
                Current Image:{" "}
                <a
                  href={`/storage/${postGrant.image}`}
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
            <label className="block text-gray-700 font-medium">
              Upload Attachment
            </label>
            <input
              type="file"
              onChange={(e) => setData("attachment", e.target.files[0])}
              className="w-full rounded-lg border-gray-200 p-2 text-sm"
            />
            {postGrant.attachment && (
              <p className="text-gray-600 text-sm mt-2">
                Current Attachment:{" "}
                <a
                  href={`/storage/${postGrant.attachment}`}
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

        {/* Budget */}
        <div className="grid grid-cols-2 gap-8">
          {data.purpose !== "find_pgstudent" && (
            <div>
              <label className="block text-gray-700 font-medium">Approved Grant Amount</label>
              <input
                type="number"
                value={data.amount}
                onChange={(e) => setData("amount", e.target.value)}
                className="w-full rounded-lg border-gray-200 p-4 text-sm"
                placeholder="Enter amount (e.g., 5000.00)"
              />
            </div>
          )}

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
      </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          {/* Save as Draft Button */}
          {/* <button
            type="button"
            onClick={(e) => {
              setData("status", "draft"); // Set status as draft
              handleSubmit(); // Submit the form
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
              handleSubmit(); // Submit the form
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
