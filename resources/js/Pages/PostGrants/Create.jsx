import React from "react";
import { useForm, usePage } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";
import { useState } from "react";
import NationalityForm from "../Role/Partials/NationalityForm";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Create() {
  const { auth, isPostgraduate, researchOptions, universities } = usePage().props;

  const { data, setData, post, processing, errors } = useForm({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    application_deadline: "",
    duration: "",
    sponsored_by: "",
    category: "",
    field_of_research: [],
    supervisor_category: "",
    supervisor_name: "",
    university: "",
    email: "",
    origin_country: "",
    purpose: "",
    student_nationality: "",
    student_level: "",
    appointment_type: "",
    purpose_of_collaboration: "",
    image: null,
    attachment: null,
    amount: "",
    application_url: "",
    status: "published",
  });

  const [selectedUniversity, setSelectedUniversity] = useState(data.university);

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
    <MainLayout title="" isPostgraduate={isPostgraduate}>
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
          {/* Research Expertise Dropdown */}
  {/* Research Expertise Searchable Dropdown */}
{(data.category === "Fundamental Research" ||
  data.category === "Applied Research" ||
  data.category === "Fundamental + Applied") && (
    <div className="w-full">
      <label htmlFor="field_of_research" className="block text-sm font-medium text-gray-700">
        Field of Research (Multiple Selection) Structure : Field of Research - Research Area - Niche Domain
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



        {/*Application Deadline*/}
        {/*Duration - Can it being calculated from the startd date and end date*/}



        {/* Field of Research apploed when fundamental, applied, fundamental + applied is applied */}
        {/* need to add in table SV name and university, will pull from another table */}
        {/* if on behalf,  need to fill in manually for SV name, university and faculty*/}
        {/* Allow to select multiple purpose */}
        {/* if purpose for student, show master or phd, student nationality, should have a section that dedicated for student.  */}
        {/* if purpose for collaboration, put the purpose of collaboration, this is where researcher need to write the purpose */}
        {/* Add level Master or PhD */}
        {/* Student Nationality */}
        {/* Add appointment for RA, GRA */}

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

         {/*Monthly allowance*/}
         {/*Extra info on monthly allowance?*/}


        {/* Budget need to hide for postgraduate student, and need to change the name */}
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
