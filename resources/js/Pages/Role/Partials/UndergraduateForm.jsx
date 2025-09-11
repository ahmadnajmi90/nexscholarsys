import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import NationalityForm from "./NationalityForm";
import Select from 'react-select';
import axios from 'axios';
import React from 'react';
import SkillsSelector from '@/Components/SkillsSelector';
import ResearchAreaSelector from '@/Components/ResearchAreaSelector';

export default function UndergraduateForm({ universities, faculties, className = '', researchOptions, skills, aiGenerationInProgress, aiGenerationMethod, generatedProfileData }) {
  // Add useRef for tracking generation
  const generationTriggeredRef = useRef(false);

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

  // Add state for CV generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [cvFile, setCVFile] = useState(null);
  const [cvModalOpen, setCVModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Effect to trigger automatic generation if URL params are present
  useEffect(() => {
    // Check for generation_initiated parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const generationInitiated = urlParams.get('generation_initiated') === 'true';
    
    // If we already have generated data, apply it immediately
    if (generatedProfileData && !generationTriggeredRef.current) {
      updateFormWithGeneratedData(generatedProfileData);
      generationTriggeredRef.current = true;
      
      // Show success message
      if (!window._profileSuccessShown) {
        window._profileSuccessShown = true;
        alert("Profile successfully generated! Please review and save the changes.");
      }
    }
    // If generation was initiated but we don't have data yet, check status
    else if ((aiGenerationInProgress || generationInitiated) && !generationTriggeredRef.current && !isGenerating) {
      checkGenerationStatus();
    }
  }, [aiGenerationInProgress, isGenerating, generatedProfileData]);

  // Function to check the generation status
  const checkGenerationStatus = () => {
    if (generationTriggeredRef.current) {
      return; // Don't check if already triggered
    }
    
    setIsGenerating(true);
    setGenerationStatus('Checking generation status...');
    
    axios.get(route('ai.status'), {
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      }
    })
      .then(response => {
        
        if (response.data.status === 'in_progress') {
          // Still in progress, check again after delay
          setGenerationStatus('Generation in progress, please wait...');
          setTimeout(checkGenerationStatus, 3000);
        } else if (response.data.status === 'error') {
          // Error occurred
          setIsGenerating(false);
          setGenerationStatus('');
          alert("Profile generation failed: " + (response.data.message || 'Unknown error'));
        } else if (response.data.status === 'completed') {
          // Generation completed
          setIsGenerating(false);
          setGenerationStatus('Profile generated successfully!');
          
          if (response.data.data) {
            // Extract the profile data from the nested 'data' property
            updateFormWithGeneratedData(response.data.data);
            // Mark as triggered to prevent double processing
            generationTriggeredRef.current = true;
            
            // Track that we've shown a success message to avoid duplicate alerts
            if (!window._profileSuccessShown) {
              window._profileSuccessShown = true;
              // Show success message to the user
              alert("Profile successfully generated! Please review and save the changes.");
            }
          }
        } else {
          setIsGenerating(false);
          setGenerationStatus('');
        }
      })
      .catch(error => {
        console.error("Error checking generation status:", error);
        setIsGenerating(false);
        setGenerationStatus('');
      });
  };

  // Function to update form with generated data
  const updateFormWithGeneratedData = (profileData) => {
    
    setData((prevData) => ({
      ...prevData,
      full_name: profileData.full_name || prevData.full_name,
      phone_number: profileData.phone_number || prevData.phone_number,
      bio: profileData.bio || prevData.bio,
      nationality: profileData.nationality || prevData.nationality,
      english_proficiency_level: profileData.english_proficiency_level || prevData.english_proficiency_level,
      bachelor: profileData.bachelor || prevData.bachelor,
      CGPA_bachelor: profileData.CGPA_bachelor || prevData.CGPA_bachelor,
      skills: profileData.skills || prevData.skills,
      expected_graduate: profileData.expected_graduate || prevData.expected_graduate,
      // Preserve existing research_preference if AI returns empty array or undefined
      research_preference: (profileData.research_preference && profileData.research_preference.length > 0)
        ? profileData.research_preference
        : prevData.research_preference,
      current_undergraduate_status: profileData.current_undergraduate_status || prevData.current_undergraduate_status,
      interested_do_research: profileData.interested_do_research || prevData.interested_do_research
    }));
  };

  // Function to handle generating profile from CV
  const handleGenerateProfileFromCV = async () => {
    // First check if CV exists
    if (data.CV_file && typeof data.CV_file === 'string') {
      // CV already exists, use it
      setIsGenerating(true);
      setGenerationStatus('Generating profile from existing CV...');
      try {
        // Get CSRF token from the meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        // Create simple form data with token only
        const formData = new FormData();
        
        // Standard headers
        const headers = {
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
        };
        
        const response = await axios.post(route('ai.generate.cv'), formData, {
          headers: headers
        });
        
        
        if (response.data) {
          updateFormWithGeneratedData(response.data);
          setGenerationStatus('Profile generated successfully!');
          setIsGenerating(false);
        }
      } catch (error) {
        console.error('Error generating profile from CV:', error);
        setGenerationStatus(`Error (${error.response?.status || 'unknown'}): ${error.message}`);
        setIsGenerating(false);
      }
    } else {
      // No CV exists, prompt for upload
      setCVModalOpen(true);
    }
  };

  // Handle file selection for CV upload
  const handleFileChange = (e) => {
    setCVFile(e.target.files[0]);
  };

  // Handle CV upload and profile generation
  const handleCVUpload = async () => {
    if (!cvFile) {
      return;
    }
    
    setIsUploading(true);
    setGenerationStatus('Uploading CV and generating profile...');
    
    try {
      // Get CSRF token from the meta tag
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      // Create form data with CV file - use proper file name and type info
      const formData = new FormData();
      formData.append('CV_file', cvFile, cvFile.name);
      
      // Ensure the file size isn't too large
      if (cvFile.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB. Please upload a smaller file.');
      }
      
      const response = await axios.post(route('ai.generate.cv'), formData, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
        },
        // Add explicit timeout and make sure we're handling binary data properly
        responseType: 'json',
        timeout: 60000, // 60 seconds
      });
      
      // Update profile data
      if (response.data) {
        setCVModalOpen(false);
        setCVFile(null);
        updateFormWithGeneratedData(response.data);
        setGenerationStatus('Profile generated successfully!');
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      
      setGenerationStatus(`Error (${error.response?.status || 'unknown'}): ${error.message}`);
      setIsUploading(false);
    }
  };

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

  // Function to update the profile picture
  const submitImage = (e) => {
    e.preventDefault();
    if (!data.profile_picture) {
      alert("Please select a profile picture.");
      return;
    }
    const formData = new FormData();
    formData.append("profile_picture", data.profile_picture);
    post(route("role.updateProfilePicture"), {
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      onSuccess: () => {
        alert("Profile picture updated successfully.");
        closeModal();
        window.location.reload();
      },
      onError: (errors) => {
        console.error("Error updating profile picture:", errors);
        alert("Failed to update the profile picture. Please try again.");
      },
    });
  };

  // Function to update the background image
  const submitBackgroundImage = (e) => {
    e.preventDefault();
    if (!data.background_image) {
      alert("Please select a background image.");
      return;
    }
    const formData = new FormData();
    formData.append("background_image", data.background_image);
    post(route("role.updateBackgroundImage"), {
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      onSuccess: () => {
        alert("Background image updated successfully.");
        setIsBackgroundModalOpen(false);
        window.location.reload();
      },
      onError: (errors) => {
        console.error("Error updating background image:", errors);
        alert("Failed to update the background image. Please try again.");
      },
    });
  };

  return (
    // Responsive container
    <div className="max-w-8xl mx-auto px-4 pb-8 border border-gray-200 rounded">
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
            <form onSubmit={submitBackgroundImage}>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                onChange={(e) => setData("background_image", e.target.files[0])}
              />
              <div className="mt-4 flex justify-end">
                <PrimaryButton type="submit">Save</PrimaryButton>
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
            <form onSubmit={submitImage}>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                onChange={(e) => setData("profile_picture", e.target.files[0])}
              />
              <div className="mt-4 flex justify-end">
                <PrimaryButton type="submit">Save</PrimaryButton>
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
      <section className={`${className} px-4`}>
        <div className="relative mb-6">
        <header>
          <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm text-gray-600">Update your personal information.</p>
        </header>
          
          {/* Desktop view: button in the top right */}
          <div className="hidden sm:flex space-x-2 absolute top-0 right-0 mt-2 mr-2">
            <button 
              type="button" 
              onClick={handleGenerateProfileFromCV}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-800"
            >
              AI Generate Profile From CV
            </button>
          </div>
          
          {/* Mobile view: button below header */}
          <div className="sm:hidden mt-4">
            <button 
              type="button" 
              onClick={handleGenerateProfileFromCV}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-800"
            >
              AI Generate Profile From CV
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-6">
          {/* Full Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div className="w-full">
              <InputLabel htmlFor="full_name" value={<>Full Name <span className="text-red-600">*</span></>} required/>
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
              <InputLabel htmlFor="bio" value={<>Short Bio <span className="text-red-600">*</span></>} required/>
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

          
          {/* English Proficiency & Current Undergraduate Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div>
              <InputLabel htmlFor="english_proficiency_level" value={<>English Proficiency Level <span className="text-red-600">*</span></>} required/>
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
              <InputLabel htmlFor="current_undergraduate_status" value={<>Current Undergraduate Status <span className="text-red-600">*</span></>} required/>
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

          {/* Degree Details: Bachelor and CGPA */}
          {data.current_undergraduate_status === "Registered" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div>
                <InputLabel htmlFor="bachelor" value={<>Name of Bachelor Degree <span className="text-red-600">*</span></>} required/>
                <TextInput
                  id="bachelor"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  value={data.bachelor}
                  onChange={e => setData('bachelor', e.target.value)}
                />
                <InputError className="mt-2" message={errors.bachelor} />
              </div>
              <div>
                <InputLabel htmlFor="CGPA_bachelor" value={<>CGPA Bachelor <span className="text-red-600">*</span></>} required/>
                <TextInput
                  id="CGPA_bachelor"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  value={data.CGPA_bachelor}
                  onChange={e => setData('CGPA_bachelor', e.target.value)}
                />
                <InputError className="mt-2" message={errors.CGPA_bachelor} />
              </div>
            </div>
          )}

          {/* Contact Details: Phone and Nationality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div>
              <InputLabel htmlFor="phone_number" value={<>Phone Number <span className="text-red-600">*</span></>} required/>
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
              <NationalityForm title="Nationality" value={data.nationality} onChange={value => setData('nationality', value)} errors={errors}/>
            </div>
          </div>

          {/* University and Matric No (if Registered) */}
          {data.current_undergraduate_status === "Registered" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div>
                <InputLabel htmlFor="university" value={<>University <span className="text-red-600">*</span></>} required />
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
                <InputLabel htmlFor="faculty" value={<>Faculty <span className="text-red-600">*</span></>} required />
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
                <InputLabel htmlFor="matric_no" value={<>Matric No. <span className="text-red-600">*</span></>} required />
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
          </div>
          
          <div className="w-full">
            <SkillsSelector
              value={data.skills}
              onChange={(skillIds) => setData('skills', skillIds)}
              error={errors.skills}
              required={true}
              label="Skills"
              placeholder="Select your skills..."
            />
          </div>

          {/* Interested to do research and Expected Graduate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div>
              <InputLabel htmlFor="interested_do_research" value={<>Interested to do research after bachelor degree? <span className="text-red-600">*</span></>} required/>
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
            {data.current_undergraduate_status === "Registered" && (
              <div>
                <InputLabel htmlFor="expected_graduate" value={<>Expected Graduate (Month/Year) <span className="text-red-600">*</span></>} required/>
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
            )}
          </div>

          {/* If interested in research, show Research Preference */}
          {data.interested_do_research === true && (
            <div className="w-full">
              <ResearchAreaSelector
                value={data.research_preference}
                onChange={(selectedAreas) => setData('research_preference', selectedAreas)}
                error={errors.research_preference}
                required={false}
                label="Research Preference"
                placeholder="Select your preferred research areas..."
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

      {/* Generation Status Modal */}
      {isGenerating && (
        <Transition
          show={isGenerating}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg font-medium">{generationStatus || "Generating profile..."}</p>
              <svg className="animate-spin h-8 w-8 mt-4 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            </div>
          </div>
        </Transition>
      )}

      {/* CV Upload Modal */}
      {cvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative w-auto my-6 mx-auto max-w-3xl z-50">
            <div className="relative bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-lg font-medium mb-4">Upload CV for Profile Generation</h3>
              <p className="mb-4 text-sm text-gray-600">
                Upload your CV to generate your profile. We support PDF, DOCX, DOC, and image formats.
              </p>
              <input
                type="file"
                className="mb-4 p-2 border rounded w-full"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff"
              />
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => {
                    setCVModalOpen(false);
                    setCVFile(null);
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleCVUpload}
                  disabled={!cvFile || isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload & Generate Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
