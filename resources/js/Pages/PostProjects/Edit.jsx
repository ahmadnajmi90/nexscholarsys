import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";
import NationalityForm from "../Role/Partials/NationalityForm";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


export default function Edit({ postProject, auth, isPostgraduate, researchOptions, universities }) {
  const { data, setData, post, processing, errors } = useForm({
    title: postProject.title || "",
    description: postProject.description || "",
    project_type: postProject.project_type || "",
    project_theme: postProject.project_theme || "",
    purpose: postProject.purpose || [],
    start_date: postProject.start_date || "",
    end_date: postProject.end_date || "",
    application_deadline: postProject.application_deadline || "",
    duration: postProject.duration || "",
    sponsored_by: postProject.sponsored_by || "",
    category: postProject.category || "",
    field_of_research: postProject.field_of_research || [],
    supervisor_category: postProject.supervisor_category || "",
    supervisor_name: postProject.supervisor_name || "",
    university: postProject.university || "",
    email: postProject.email || "",
    origin_country: postProject.origin_country || "",
    student_nationality: postProject.student_nationality || "",
    student_level: postProject.student_level || "",
    appointment_type: postProject.appointment_type || "",
    purpose_of_collaboration: postProject.purpose_of_collaboration || "",
    image: postProject.image || "",
    attachment: postProject.attachment || "",
    amount: postProject.amount || "",
    application_url: postProject.application_url || "",
    project_status: postProject.project_status || "draft",
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

    post(route('post-projects.update', postProject.id), {
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      onSuccess: () => {
        alert("Project updated successfully!");
      },
      onError: (errors) => {
          console.error('Error updating Project:', errors);
          alert("Failed to update the Project. Please try again.");
      },
    });
};

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
        Add New Project
      </h1>

      {/* Grant Name */}
      <div>
        <label className="block text-gray-700 font-medium">
          Project Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData("title", e.target.value)}
          className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
          placeholder="Enter Project Name"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      <div>
    {/* Description */}
    <div>
      <label className="block text-gray-700 font-medium">
        Project Description <span className="text-red-500">*</span>
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

  <div className="grid grid-cols-2 gap-8">
      <div>
        <label className="block text-gray-700 font-medium">
          Project Type
        </label>
        <select
          id="project_type"
          name="project_type"
          value={data.project_type}
          onChange={(e) => setData("project_type", e.target.value)}
          className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
        >
          <option value="" disabled hidden>
            Select a Project Type
          </option>
          <option value="Fundamental Research">Fundamental Research</option>
          <option value="Applied Research">Applied Research</option>
          <option value="Fundamental + Applied">
            Fundamental + Applied
          </option>
          {/* <option value="Knowledge Transfer Program (KTP)">
            Knowledge Transfer Program (KTP)
          </option>
          <option value="CSR (Corporate Social Responsibility)">
            CSR (Corporate Social Responsibility)
          </option> */}
        </select>
        {errors.project_type && (
          <p className="text-red-500 text-xs mt-1">{errors.project_type}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Project Theme</label>
        <select
          value={data.project_theme}
          onChange={(e) => setData("project_theme", e.target.value)}
          className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
        >
          <option value="" disabled hidden> Select a Project Theme</option>
          <option value="Artificial Intelligence and Machine Learning">Artificial Intelligence and Machine Learning</option>
          <option value="Sustainable Development and Renewable Energy">Sustainable Development and Renewable Energy</option>
          <option value="Healthcare and Biotechnology">Healthcare and Biotechnology</option>
          <option value="Cybersecurity and Data Privacy">Cybersecurity and Data Privacy</option>
          <option value="Smart Cities and IoT (Internet of Things)">Smart Cities and IoT (Internet of Things)</option>
          <option value="Climate Change and Environmental Protection">Climate Change and Environmental Protection</option>
          <option value="Education Technology and E-Learning">Education Technology and E-Learning</option>
          <option value="Big Data Analytics and Data Science">Big Data Analytics and Data Science</option>
          <option value="Agricultural Innovation and Food Security">Agricultural Innovation and Food Security</option>
          <option value="Financial Technology (FinTech) and Blockchain">Financial Technology (FinTech) and Blockchain</option>
          <option value="Robotics and Automation">Robotics and Automation</option>
          <option value="E-Commerce and Digital Marketing">E-Commerce and Digital Marketing</option>
          <option value="Human-Computer Interaction (HCI)">Human-Computer Interaction (HCI)</option>
          <option value="Space Exploration and Satellite Technologies">Space Exploration and Satellite Technologies</option>
          <option value="Virtual Reality (VR) and Augmented Reality (AR)">Virtual Reality (VR) and Augmented Reality (AR)</option>
          <option value="Water Resource Management">Water Resource Management</option>
          <option value="Social Innovation and Community Development">Social Innovation and Community Development</option>
          <option value="Transportation and Autonomous Vehicles">Transportation and Autonomous Vehicles</option>
          <option value="Supply Chain Optimization and Logistics">Supply Chain Optimization and Logistics</option>
          <option value="Renewable Construction and Smart Infrastructure">Renewable Construction and Smart Infrastructure</option>
        </select>
      </div>
    </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
            <label className="block text-gray-700 font-medium">Purpose</label>
            <select
              multiple
              value={data.purpose}
              onChange={(e) => {
                const selectedValues = Array.from(e.target.selectedOptions).map(option => option.value);
                setData("purpose", selectedValues);
              }}
              className="mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"
            >
              <option value="" disabled hidden> Select a Purpose</option>
              <option value="Seek for Postgraduate">Seek for Postgraduate</option>
              <option value="Seek for Academician Collaboration">Seek for Academician Collaboration</option>
              <option value="Seek for Industrial Collaboration">Seek for Industrial Collaboration</option>
              <option value="For Showcase">For Showcase</option>
            </select>
          </div>
      </div>

      {!data.purpose.includes("For Showcase") && (
        <>
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
        </>
      )}

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
            {/* <option value="Knowledge Transfer Program (KTP)">
              Knowledge Transfer Program (KTP)
            </option>
            <option value="CSR (Corporate Social Responsibility)">
              CSR (Corporate Social Responsibility)
            </option> */}
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
          <label className="block text-gray-700 font-medium">Project Supervisor / Project Leader</label>
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
              <label className="mt-1 block text-gray-700 font-medium">Supervisor / Project Leader Name</label>
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
          <NationalityForm title={"Project Origin Country"} value={data.origin_country} onChange={(value) => setData('origin_country', value)} />
        </div>
      </div>

      {data.purpose === "Seek for Postgraduate" ? (
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
          {postProject.image && (
              <p className="text-gray-600 text-sm mt-2">
                Current Image:{" "}
                <a
                  href={`/storage/${postProject.image}`}
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
          {postProject.attachment && (
              <p className="text-gray-600 text-sm mt-2">
                Current Attachment:{" "}
                <a
                  href={`/storage/${postProject.attachment}`}
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

       {/*Monthly allowance*/}
       {/*Extra info on monthly allowance?*/}


      {/* Budget need to hide for postgraduate student, and need to change the name */}
      <div className="grid grid-cols-2 gap-8">
        {data.purpose !== "Seek for Postgraduate" && (
          <div>
            <label className="block text-gray-700 font-medium">Approved Project Amount</label>
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
