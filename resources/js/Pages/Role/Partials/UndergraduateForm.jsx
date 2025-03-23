import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import NationalityForm from "./NationalityForm";
import Select from 'react-select';

export default function UndergraduateForm({ universities, faculties, className = '', researchOptions, skills }) {
  const undergraduate = usePage().props.undergraduate;

  const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
    phone_number: undergraduate?.phone_number || '',
    full_name: undergraduate?.full_name || '',
    bio: undergraduate?.bio || '',
    bachelor: undergraduate?.bachelor || '',
    CGPA_bachelor: undergraduate?.CGPA_bachelor || '',
    nationality: undergraduate?.nationality || '',
    english_proficiency_level: undergraduate?.english_proficiency_level || '',
    current_undergraduate_status: undergraduate?.current_undergraduate_status || '',
    university: undergraduate?.university || '',
    faculty: undergraduate?.faculty || '',
    matric_no: undergraduate?.matric_no || '',
    // Use "skills" as a JSON array (storing skill IDs)
    skills: undergraduate?.skills || [],
    interested_do_research: undergraduate?.interested_do_research || false,
    expected_graduate: undergraduate?.expected_graduate || '',
    research_preference: typeof undergraduate?.research_preference === 'string'
      ? JSON.parse(undergraduate?.research_preference)
      : undergraduate?.research_preference,
    CV_file: undergraduate?.CV_file || '',
    profile_picture: undergraduate?.profile_picture || '',
    background_image: undergraduate?.background_image || '',
    website: undergraduate?.website || '',
    linkedin: undergraduate?.linkedin || '',
    google_scholar: undergraduate?.google_scholar || '',
    researchgate: undergraduate?.researchgate || '',
  });

  // Handler for current undergraduate status change
  const handleStatusChange = (e) => {
    const status = e.target.value;
    if (status !== "Registered") {
      // Clear university, faculty and matric no. if not Registered
      setData(prevData => ({
        ...prevData,
        current_undergraduate_status: status,
        matric_no: "",
        university: "",
        faculty: "",
      }));
      setSelectedUniversity("");
    } else {
      setData(prevData => ({
        ...prevData,
        current_undergraduate_status: status,
      }));
    }
  };

  // Local state for selected university (for filtering faculties)
  const [selectedUniversity, setSelectedUniversity] = useState(data.university);
  const filteredFaculties = faculties.filter(
    faculty => faculty.university_id === parseInt(selectedUniversity)
  );

  // Create options for skills from the skills prop (each skill has id and name)
  const skillsOptions = skills.map(skill => ({
    value: skill.id,
    label: skill.name,
  }));

  // Handler for research preference change (if interested in research)
  const handleResearchPreferenceChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map(option => option.value);
    setData('research_preference', selectedValues);
  };

  // Submit form
  const submit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      // Exclude profile_picture if handled separately
      if (key !== "profile_picture") {
        if (Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else if (key === "interested_do_research") {
          formData.append(key, data[key] === true ? 1 : 0);
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
    post(route("role.update"), {
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      onSuccess: () => {
        alert("Profile updated successfully.");
      },
      onError: (errors) => {
        console.error("Error updating profile:", errors);
        alert("Failed to update the profile. Please try again.");
      },
    });
  };

  // Local state for modals (profile picture and background image)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleProfilePictureClick = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);

  return (
    // Responsive container
    <div className="max-w-8xl mx-auto px-4 pb-8">
      {/* Header Section with Background and Profile Picture */}
      <div className="w-full bg-white pb-12 shadow-md relative mb-4">
        {/* Background Image */}
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={`/storage/${data.background_image || "default-background.jpg"}`}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setIsBackgroundModalOpen(true)}
            className="absolute top-4 right-4 bg-blue-500 p-2 rounded-full shadow-lg text-white hover:bg-blue-600"
            aria-label="Edit Background Image"
          >
            ✏️
          </button>
        </div>
        {/* Profile Image Container */}
        <div className="relative flex flex-col items-center -mt-16 z-10">
          <div className="relative">
            <img
              src={`/storage/${data.profile_picture || "default-profile.jpg"}`}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <button
              onClick={handleProfilePictureClick}
              className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-lg text-white hover:bg-blue-600"
              aria-label="Edit Profile Picture"
            >
              ✏️
            </button>
          </div>
          <div className="text-center mt-4">
            <h1 className="text-2xl font-semibold text-gray-800">{data.full_name}</h1>
          </div>
        </div>
      </div>

      {/* Background Image Modal */}
      {isBackgroundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Background Image</h2>
            <form onSubmit={e => { e.preventDefault(); /* Implement submitBackgroundImage as needed */ }}>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                onChange={(e) => setData("background_image", e.target.files[0])}
              />
              <div className="mt-4 flex justify-end">
                <PrimaryButton>Save</PrimaryButton>
                <button
                  type="button"
                  onClick={() => setIsBackgroundModalOpen(false)}
                  className="ml-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Profile Picture */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Profile Picture</h2>
            <form onSubmit={e => { e.preventDefault(); /* Implement submitImage as needed */ }}>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                onChange={(e) => setData("profile_picture", e.target.files[0])}
              />
              <div className="mt-4 flex justify-end">
                <PrimaryButton>Save</PrimaryButton>
                <button
                  type="button"
                  onClick={closeModal}
                  className="ml-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Form Section */}
      <section className={className}>
        <header>
          <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm text-gray-600">Update your personal information.</p>
        </header>
        <form onSubmit={submit} className="mt-6 space-y-6">
          {/* Full Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div className="w-full">
              <InputLabel htmlFor="full_name" value="Full Name" required />
              <TextInput
                id="full_name"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                value={data.full_name}
                onChange={e => setData('full_name', e.target.value)}
                required
                autoComplete="full_name"
              />
              <InputError className="mt-2" message={errors.full_name} />
            </div>
          </div>

          {/* Bio */}
          <div className="grid grid-cols-1 gap-6 w-full">
            <div className="w-full">
              <InputLabel htmlFor="bio" value="Short Bio" />
              <textarea
                id="bio"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-4"
                value={data.bio}
                onChange={e => setData('bio', e.target.value)}
                rows={4}
              />
              <InputError className="mt-2" message={errors.bio} />
            </div>
          </div>

          {/* Degree Details: Bachelor and CGPA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div>
              <InputLabel htmlFor="bachelor" value="Name of Bachelor Degree" />
              <TextInput
                id="bachelor"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                value={data.bachelor}
                onChange={e => setData('bachelor', e.target.value)}
              />
              <InputError className="mt-2" message={errors.bachelor} />
            </div>
            <div>
              <InputLabel htmlFor="CGPA_bachelor" value="CGPA Bachelor" />
              <TextInput
                id="CGPA_bachelor"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                value={data.CGPA_bachelor}
                onChange={e => setData('CGPA_bachelor', e.target.value)}
              />
              <InputError className="mt-2" message={errors.CGPA_bachelor} />
            </div>
          </div>

          {/* Contact Details: Phone and Nationality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div>
              <InputLabel htmlFor="phone_number" value="Phone Number" required />
              <TextInput
                id="phone_number"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                value={data.phone_number}
                onChange={e => setData('phone_number', e.target.value)}
                autoComplete="tel"
              />
              <InputError className="mt-2" message={errors.phone_number} />
            </div>
            <div>
              <NationalityForm title="Nationality" value={data.nationality} onChange={value => setData('nationality', value)} />
            </div>
          </div>

          {/* English Proficiency & Current Undergraduate Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div>
              <InputLabel htmlFor="english_proficiency_level" value="English Proficiency Level" />
              <select
                id="english_proficiency_level"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                value={data.english_proficiency_level}
                onChange={e => setData('english_proficiency_level', e.target.value)}
              >
                <option value="" hidden>Select English Proficiency Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Elementary">Elementary</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Upper Intermediate">Upper Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <InputError className="mt-2" message={errors.english_proficiency_level} />
            </div>
            <div>
              <InputLabel htmlFor="current_undergraduate_status" value="Current Undergraduate Status" />
              <select
                id="current_undergraduate_status"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                value={data.current_undergraduate_status}
                onChange={handleStatusChange}
              >
                <option value="" hidden>Select your status</option>
                <option value="Not registered yet">Not registered yet</option>
                <option value="Registered">Registered</option>
              </select>
            </div>
          </div>

          {/* University and Matric No (if Registered) */}
          {data.current_undergraduate_status === "Registered" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div>
                <InputLabel htmlFor="university" value="University" required />
                <select
                  id="university"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  value={selectedUniversity || ''}
                  onChange={e => {
                    const uniId = parseInt(e.target.value);
                    setSelectedUniversity(uniId);
                    setData('university', uniId);
                  }}
                >
                  <option value="" hidden>Select your University</option>
                  {universities.map(uni => (
                    <option key={uni.id} value={uni.id}>{uni.full_name}</option>
                  ))}
                </select>
                <InputError className="mt-2" message={errors.university} />
              </div>

              <div className="w-full">
                <InputLabel htmlFor="faculty" value="Faculty" required />
                <select
                  id="faculty"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  value={data.faculty}
                  onChange={e => setData('faculty', e.target.value)}
                >
                  <option value="" hidden>Select your Faculty</option>
                  {filteredFaculties.map(fac => (
                    <option key={fac.id} value={fac.id}>{fac.name}</option>
                  ))}
                </select>
                <InputError className="mt-2" message={errors.faculty} />
              </div>
            </div>
          )}

          {/* Skills (Multiselect) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {data.current_undergraduate_status === "Registered" && (
              <div>
                <InputLabel htmlFor="matric_no" value="Matric No." required />
                <TextInput
                  id="matric_no"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  value={data.matric_no}
                  onChange={e => setData('matric_no', e.target.value)}
                  required
                  autoComplete="matric_no"
                />
                <InputError className="mt-2" message={errors.matric_no} />
              </div>
            )}
            <div className="w-full">
              <InputLabel htmlFor="skills" value="Skills" />
              <Select
                id="skills"
                isMulti
                options={skillsOptions}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                classNamePrefix="select"
                value={data.skills?.map(selectedId => {
                  const found = skillsOptions.find(option => option.value === selectedId);
                  return found || { value: selectedId, label: selectedId };
                })}
                onChange={selectedOptions => {
                  const values = selectedOptions.map(opt => opt.value);
                  setData('skills', values);
                }}
                placeholder="Select your skills..."
              />
            </div>
          </div>

          {/* Interested to do research and Expected Graduate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div>
              <InputLabel htmlFor="interested_do_research" value="Interested to do research after bachelor degree?" />
              <select
                id="interested_do_research"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                value={data.interested_do_research ? "true" : "false"}
                onChange={e => setData('interested_do_research', e.target.value === "true")}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <InputLabel htmlFor="expected_graduate" value="Expected Graduate (Month/Year)" required />
              <TextInput
                id="expected_graduate"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                value={data.expected_graduate}
                onChange={e => setData('expected_graduate', e.target.value)}
                required
                autoComplete="expected_graduate"
              />
              <InputError className="mt-2" message={errors.expected_graduate} />
            </div>
          </div>

          {/* If interested in research, show Research Preference Multiselect */}
          {data.interested_do_research === true && (
            <div className="w-full">
              <InputLabel htmlFor="research_preference" value="Preferred Field of Research" />
              <Select
                id="research_preference"
                isMulti
                options={researchOptions.map(option => ({
                  value: `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}`,
                  label: `${option.field_of_research_name} - ${option.research_area_name} - ${option.niche_domain_name}`,
                }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                classNamePrefix="select"
                value={data.research_preference?.map(selectedValue => {
                  const matchedOption = researchOptions.find(option =>
                    `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === selectedValue
                  );
                  return {
                    value: selectedValue,
                    label: matchedOption
                      ? `${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`
                      : selectedValue,
                  };
                })}
                styles={{
                  valueContainer: (provided) => ({
                    ...provided,
                    maxWidth: '100%', // ensure the container stays within its parent width
                  }),
                  multiValueLabel: (provided) => ({
                    ...provided,
                    maxWidth: 250, // set a fixed max width for each selected label (adjust as needed)
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }),
                  menuPortal: (provided) => ({
                    ...provided,
                    zIndex: 9999,
                  }),
                }}
                onChange={handleResearchPreferenceChange}
                placeholder="Select preferred field of research..."
              />
            </div>
          )}

          {/* CV File */}
          <div className="w-full">
            <InputLabel htmlFor="CV_file" value="Upload CV (Max 5MB)" />
            <input
              type="file"
              id="CV_file"
              accept=".pdf,.doc,.docx"
              className="mt-1 block w-full border-gray-300 rounded-md py-2"
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size <= 5 * 1024 * 1024) {
                    setData('CV_file', file);
                  } else {
                    alert("File size exceeds 5MB. Please upload a smaller file.");
                  }
                }
              }}
            />
            {data.CV_file && (
              <div className="mt-2">
                {typeof data.CV_file === 'string' ? (
                  <a
                    href={`/storage/${data.CV_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    View Current File: {data.CV_file.split('/').pop()}
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">File Selected: {data.CV_file.name}</p>
                )}
              </div>
            )}
            <InputError className="mt-2" message={errors.CV_file} />
          </div>

          {/* Website */}
          <div className="w-full">
            <InputLabel htmlFor="website" value="Website" />
            <TextInput
              id="website"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              value={data.website}
              onChange={e => setData('website', e.target.value)}
              autoComplete="url"
            />
            <InputError className="mt-2" message={errors.website} />
          </div>

          {/* LinkedIn */}
          <div className="w-full">
            <InputLabel htmlFor="linkedin" value="LinkedIn" />
            <TextInput
              id="linkedin"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              value={data.linkedin}
              onChange={e => setData('linkedin', e.target.value)}
              autoComplete="url"
            />
            <InputError className="mt-2" message={errors.linkedin} />
          </div>

          {/* Google Scholar */}
          <div className="w-full">
            <InputLabel htmlFor="google_scholar" value="Google Scholar" />
            <TextInput
              id="google_scholar"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              value={data.google_scholar}
              onChange={e => setData('google_scholar', e.target.value)}
              autoComplete="url"
            />
            <InputError className="mt-2" message={errors.google_scholar} />
          </div>

          {/* ResearchGate */}
          <div className="w-full">
            <InputLabel htmlFor="researchgate" value="ResearchGate" />
            <TextInput
              id="researchgate"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              value={data.researchgate}
              onChange={e => setData('researchgate', e.target.value)}
              autoComplete="url"
            />
            <InputError className="mt-2" message={errors.researchgate} />
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <PrimaryButton disabled={processing}>Save</PrimaryButton>
            <Transition
              show={recentlySuccessful}
              enter="transition ease-in-out"
              enterFrom="opacity-0"
              leave="transition ease-in-out"
              leaveTo="opacity-0"
            >
              <p className="text-sm text-gray-600">Saved.</p>
            </Transition>
          </div>
        </form>
      </section>
    </div>
  );
}
