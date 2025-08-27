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

export default function Edit({ postProject, auth, researchOptions, universities }) {
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
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
    student_level: postProject.student_level || [],
    student_mode_study: postProject.student_mode_study || [],
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
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const purposeOptions = [
    { value: 'Seek for Postgraduate', label: 'Seek for Postgraduate' },
    { value: 'Seek for Undergraduate', label: 'Seek for Undergraduate' },
    { value: 'Seek for Academician Collaboration', label: 'Seek for Academician Collaboration' },
    { value: 'Seek for Industrial Collaboration', label: 'Seek for Industrial Collaboration' },
    { value: 'For Showcase', label: 'For Showcase' }
  ];

  const handlePurposeChange = (selectedOptions) => {
    if (!selectedOptions) {
      setData('purpose', []);
      return;
    }

    const selectedValues = selectedOptions.map(option => option.value);
    
    // If "For Showcase" is selected
    if (selectedValues.includes('For Showcase')) {
      setData('purpose', ['For Showcase']);
      return;
    }

    // If any other option is selected, remove "For Showcase"
    const filteredValues = selectedValues.filter(value => value !== 'For Showcase');
    setData('purpose', filteredValues);
  };

  // Function to determine if an option should be disabled
  const isOptionDisabled = (option) => {
    if (option.value === 'For Showcase') {
      return data.purpose.some(item =>
        item === 'Seek for Postgraduate' ||
        item === 'Seek for Undergraduate' ||
        item === 'Seek for Academician Collaboration' ||
        item === 'Seek for Industrial Collaboration'
      );
    }
    return data.purpose.includes('For Showcase');
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

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === 'image' || key === 'attachment') {
        if (data[key] instanceof File) {
          formData.append(key, data[key]);
        } else if (typeof data[key] === 'string') {
          formData.append(key, data[key]);
        }
      } else if (Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });

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
    <MainLayout title="">
      <Head title="Edit Project" />
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

        <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <h1 className="text-xl font-bold text-gray-700 text-center">Add New Project</h1>

          {/* Project Name */}
          <div>
            <InputLabel>
              Project Name <span className="text-red-600">*</span>
            </InputLabel>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Enter Project Name"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Project Description */}
          <div>
            <InputLabel>
              Project Description <span className="text-red-600">*</span>
            </InputLabel>
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
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div>
              <InputLabel>
                Project Theme <span className="text-red-600">*</span>
              </InputLabel>
              <select
                value={data.project_theme}
                onChange={(e) => setData("project_theme", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="" disabled hidden>
                  Select a Project Theme
                </option>
                <option value="Science & Technology">Science & Technology</option>
                <option value="Social Science">Social Science</option>
              </select>
              {errors.project_theme && <p className="text-red-500 text-xs mt-1">{errors.project_theme}</p>}
            </div>

            {/* Purpose (Multiselect) */}
            <div ref={dropdownRef}>
              <InputLabel>
                Purpose (Multiselect) <span className="text-red-600">*</span>
              </InputLabel>
              <Select
                isMulti
                options={purposeOptions}
                value={purposeOptions.filter(option => data.purpose.includes(option.value))}
                onChange={handlePurposeChange}
                isOptionDisabled={isOptionDisabled}
                className="mt-1 block w-full"
                classNamePrefix="select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (provided) => ({
                    ...provided,
                    zIndex: 9999
                  })
                }}
              />
              {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>}
            </div>
          </div>

          {!data.purpose.includes("For Showcase") && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div>
                  <InputLabel>
                    Start Date <span className="text-red-600">*</span>
                  </InputLabel>
                  <input
                    type="date"
                    value={data.start_date}
                    onChange={(e) => setData("start_date", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                  {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
                </div>
                <div>
                  <InputLabel>
                    End Date <span className="text-red-600">*</span>
                  </InputLabel>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div>
                  <InputLabel>
                    Application Deadline <span className="text-red-600">*</span>
                  </InputLabel>
                  <input
                    type="date"
                    value={data.application_deadline}
                    onChange={(e) => setData("application_deadline", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                  {errors.application_deadline && <p className="text-red-500 text-xs mt-1">{errors.application_deadline}</p>}
                </div>

                <div>
                  <InputLabel>
                    Duration (in months) <span className="text-red-600">*</span>
                  </InputLabel>
                  <input
                    type="number"
                    value={data.duration}
                    onChange={(e) => setData("duration", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    placeholder="Enter grant duration"
                  />
                  {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div>
              <InputLabel>
                Sponsored By <span className="text-red-600">*</span>
              </InputLabel>
              <input
                type="text"
                value={data.sponsored_by}
                onChange={(e) => setData("sponsored_by", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Enter sponsor"
              />
              {errors.sponsored_by && <p className="text-red-500 text-xs mt-1">{errors.sponsored_by}</p>}
            </div>
            <div>
              <InputLabel>
                Category <span className="text-red-600">*</span>
              </InputLabel>
              <select
                id="category"
                name="category"
                value={data.category}
                onChange={(e) => setData("category", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            {(data.category === "Fundamental Research" ||
              data.category === "Applied Research" ||
              data.category === "Fundamental + Applied") && (
              <div className="w-full">
                <InputLabel>
                  Field of Research Structure : Field of Research - Research Area - Niche Domain <span className="text-red-600">*</span>
                </InputLabel>
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
                    setData('field_of_research', selectedValues);
                  }}
                  placeholder="Search and select fields of research..."
                />
                {errors.field_of_research && <p className="text-red-500 text-xs mt-1">{errors.field_of_research}</p>}
              </div>
            )}

            <div>
              <InputLabel>
                Project Supervisor / Project Leader <span className="text-red-600">*</span>
              </InputLabel>
              <select
                value={data.supervisor_category}
                onChange={(e) => setData("supervisor_category", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="Own Name">Own Name</option>
                <option value="On Behalf">On Behalf</option>
              </select>
              {errors.supervisor_category && <p className="text-red-500 text-xs mt-1">{errors.supervisor_category}</p>}
            </div>
          </div>

          {data.supervisor_category === "On Behalf" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              <div>
                <InputLabel>
                  Supervisor / Project Leader Name <span className="text-red-600">*</span>
                </InputLabel>
                <input
                  type="text"
                  value={data.supervisor_name}
                  onChange={(e) => setData("supervisor_name", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
                {errors.supervisor_name && <p className="text-red-500 text-xs mt-1">{errors.supervisor_name}</p>}
              </div>

              <div>
                <InputLabel>
                  University <span className="text-red-600">*</span>
                </InputLabel>
                <select
                  id="university"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  value={selectedUniversity || ""}
                  onChange={(e) => {
                    const universityId = e.target.value;
                    setSelectedUniversity(universityId);
                    setData("university", universityId);
                  }}
                >
                  <option value="" hidden>
                    Select your University
                  </option>
                  {universities.map((university) => (
                    <option key={university.id} value={university.id}>
                      {university.full_name}
                    </option>
                  ))}
                </select>
                {errors.university && <p className="text-red-500 text-xs mt-1">{errors.university}</p>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div>
              <InputLabel>
                Email <span className="text-red-600">*</span>
              </InputLabel>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Enter email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                <InputLabel htmlFor="usePersonalEmail" className="ml-2">
                  Use personal email ({auth.email})
                </InputLabel>
              </div>
            </div>

            <div>
              <NationalityForm title={<>Project Origin Country</>} value={data.origin_country} onChange={(value) => setData("origin_country", value)} errors={errors}/>
              {errors.origin_country && <p className="text-red-500 text-xs mt-1">{errors.origin_country}</p>}
            </div>
          </div>

          {(data.purpose.includes("Seek for Postgraduate") || data.purpose.includes("Seek for Undergraduate")) && (
            <>
              <div className="text-lg font-semibold text-gray-700 mb-4">
                Please select the criteria for student
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div>
                  <NationalityForm
                    title={"Student Nationality"}
                    value={data.student_nationality}
                    isNotSpecify={true}
                    onChange={(value) => setData("student_nationality", value)}
                    errors={errors}
                  />
                  {errors.student_nationality && <p className="text-red-500 text-xs mt-1">{errors.student_nationality}</p>}
                </div>

                <div>
                  <InputLabel>
                    This project is for? <span className="text-red-600">*</span>
                  </InputLabel>
                  <Select
                    isMulti
                    options={[
                      ...(data.purpose.includes("Seek for Undergraduate") ? [{ value: 'Undergraduate', label: 'Undergraduate' }] : []),
                      ...(data.purpose.includes("Seek for Postgraduate") ? [
                        { value: 'Master', label: 'Master' },
                        { value: 'Ph.D.', label: 'Ph.D.' }
                      ] : [])
                    ]}
                    value={data.student_level?.map(level => ({ value: level, label: level })) || []}
                    onChange={(selectedOptions) => {
                      setData('student_level', selectedOptions.map(option => option.value));
                    }}
                    className="mt-1 block w-full"
                    classNamePrefix="select"
                  />
                  {errors.student_level && <p className="text-red-500 text-xs mt-1">{errors.student_level}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div>
                  <InputLabel>
                    Mode of Study <span className="text-red-600">*</span>
                  </InputLabel>
                  <Select
                    isMulti
                    options={[
                      ...(data.purpose.includes("Seek for Undergraduate") ? [
                        { value: 'No Mode of Study (For Undergraduate)', label: 'No Mode of Study (For Undergraduate)' }
                      ] : []),
                      ...(data.purpose.includes("Seek for Postgraduate") ? [
                        { value: 'Master - Full Research', label: 'Master - Full Research' },
                        { value: 'Master - Coursework', label: 'Master - Coursework' },
                        { value: 'Master - Mixed Mode', label: 'Master - Mixed Mode' },
                        { value: 'Master - Full Research - ODL', label: 'Master - Full Research - ODL' },
                        { value: 'Master - Coursework - ODL', label: 'Master - Coursework - ODL' },
                        { value: 'Master - Mixed Mode - ODL', label: 'Master - Mixed Mode - ODL' },
                        { value: 'PhD - Full Research', label: 'PhD - Full Research' },
                        { value: 'PhD - Industry', label: 'PhD - Industry' },
                        { value: 'Doctor of Business Administration', label: 'Doctor of Business Administration' }
                      ] : [])
                    ]}
                    value={data.student_mode_study?.map(mode => ({ value: mode, label: mode })) || []}
                    onChange={(selectedOptions) => {
                      setData('student_mode_study', selectedOptions.map(option => option.value));
                    }}
                    className="mt-1 block w-full"
                    classNamePrefix="select"
                  />
                  {errors.student_mode_study && <p className="text-red-500 text-xs mt-1">{errors.student_mode_study}</p>}
                </div>

                {data.purpose.includes("Seek for Postgraduate") && (
              <div>
                <InputLabel>
                  Appointment Type <span className="text-red-600">*</span>
                </InputLabel>
                <select
                  value={data.appointment_type}
                  onChange={(e) => setData("appointment_type", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="" disabled hidden>
                    Select Appointment Type
                  </option>
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
                {errors.appointment_type && <p className="text-red-500 text-xs mt-1">{errors.appointment_type}</p>}
                  </div>
                )}
              </div>
            </>
          )}

          {(data.purpose.includes("Seek for Academician Collaboration") || data.purpose.includes("Seek for Industrial Collaboration")) && (
            <div>
              <InputLabel>
                Purpose of Collaboration <span className="text-red-600">*</span>
              </InputLabel>
              <textarea
                value={data.purpose_of_collaboration}
                onChange={(e) => setData("purpose_of_collaboration", e.target.value || "")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Enter Purpose of Collaboration"
              ></textarea>
              {errors.purpose_of_collaboration && <p className="text-red-500 text-xs mt-1">{errors.purpose_of_collaboration}</p>}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div>
              <InputLabel>
                Upload Image
              </InputLabel>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setData("image", e.target.files[0])}
                className="w-full rounded-lg border-gray-200 py-2 text-sm"
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
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            </div>
            <div>
              <InputLabel>
                Upload Attachment
              </InputLabel>
              <input
                type="file"
                onChange={(e) => setData("attachment", e.target.files[0])}
                className="w-full rounded-lg border-gray-200 py-2 text-sm"
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
              {errors.attachment && <p className="text-red-500 text-xs mt-1">{errors.attachment}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            {data.purpose !== "Seek for Postgraduate" && (
              <div>
                <InputLabel>
                  Approved Project Amount <span className="text-red-600">*</span>
                </InputLabel>
                <input
                  type="number"
                  value={data.amount}
                  onChange={(e) => setData("amount", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter amount (e.g., 5000.00)"
                />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
              </div>
            )}

            {!data.purpose.includes("For Showcase") && (
            <div>
              <InputLabel className="block text-gray-700 font-medium">
                Application URL
              </InputLabel>
              <input
                type="url"
                value={data.application_url}
                onChange={(e) => setData("application_url", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Enter application URL"
              />
              {errors.application_url && <p className="text-red-500 text-xs mt-1">{errors.application_url}</p>}
            </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handleSubmit()}
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
