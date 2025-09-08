import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import axios from 'axios';
import CVPreviewModal from './CVPreviewModal';
import React from 'react';

export default function AcademicianForm({ className = '', researchOptions, aiGenerationInProgress, aiGenerationMethod, generatedProfileData }) {
  const academician = usePage().props.academician; // Related academician data
  const allPrograms = usePage().props.allPrograms || [];
  const currentProgramIds = usePage().props.currentProgramIds || [];

  const { data, setData, post, errors, processing, recentlySuccessful } =
    useForm({
      // data common for all
      phone_number: academician?.phone_number || '',
      full_name: academician?.full_name || '',
      profile_picture: academician?.profile_picture || '',
      research_expertise:
        typeof academician?.research_expertise === 'string'
          ? JSON.parse(academician?.research_expertise)
          : academician?.research_expertise,
      field_of_study: academician?.field_of_study || '',
      highest_degree: academician?.highest_degree || '',
      personal_website: academician?.personal_website || academician?.website || '', // Fallback to website for backward compatibility
      institution_website: academician?.institution_website || '',
      linkedin: academician?.linkedin || '',
      google_scholar: academician?.google_scholar || '',
      researchgate: academician?.researchgate || '',
      bio: academician?.bio || '',
      // data specific to academician
      current_position: academician?.current_position || '',
      department: academician?.department || '',
      availability_as_supervisor: academician?.availability_as_supervisor || false,
      style_of_supervision: academician?.style_of_supervision || '',
      background_image: academician?.background_image || '',
      CV_file: academician?.CV_file || '',
      postgraduate_program_ids: currentProgramIds,
    });

  // State for modals and generation
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [genMode, setGenMode] = useState('auto'); // 'auto' or 'url'
  const [providedUrls, setProvidedUrls] = useState(['']); // For URL mode
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false); // For CV preview
  const [isDownloading, setIsDownloading] = useState(false);
  const [showRequirementModal, setShowRequirementModal] = useState(false); // For reminding users

  // Add new state for Google Scholar scraping
  const [isScrapingScholar, setIsScrapingScholar] = useState(false);
  const [scholarStatus, setScholarStatus] = useState(null);
  const [scholarLastUpdated, setScholarLastUpdated] = useState(null);
  const [canUpdateScholar, setCanUpdateScholar] = useState(false);

  // Create a ref to track if generation has been triggered
  const generationTriggeredRef = useRef(false);
  
  // Effect to apply generated profile data if available
  useEffect(() => {
    if (generatedProfileData && !generationTriggeredRef.current) {
      console.log("Applying generated profile data:", generatedProfileData);
      
      // Update the form data with the generated profile
      setData((prevData) => ({
        ...prevData,
        full_name: data.full_name, // Keep existing name
        phone_number: generatedProfileData.phone_number || prevData.phone_number,
        bio: generatedProfileData.bio || prevData.bio,
        current_position: generatedProfileData.current_position || prevData.current_position,
        department: generatedProfileData.department || prevData.department,
        highest_degree: generatedProfileData.highest_degree || prevData.highest_degree,
        field_of_study: generatedProfileData.field_of_study || prevData.field_of_study,
        research_expertise: generatedProfileData.research_expertise || prevData.research_expertise,
      }));
      
      // Mark as triggered to prevent double processing
      generationTriggeredRef.current = true;
      
      // Show success message to the user - only when the data comes directly from the server (not from status check)
      if (!window._profileSuccessShown) {
        window._profileSuccessShown = true;
        alert("Profile successfully generated! Please review and save the changes.");
      }
    }
  }, [generatedProfileData]);

  // Effect to trigger automatic generation if URL params are present
  useEffect(() => {
    // Check for generation_initiated parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const generationInitiated = urlParams.get('generation_initiated') === 'true';
    
    console.log("Checking if automatic generation should be triggered:", {
      aiGenerationInProgress,
      aiGenerationMethod,
      generationTriggeredRef: generationTriggeredRef.current,
      isGenerating,
      generatedProfileData: !!generatedProfileData,
      generationInitiated,
      location: window.location.href
    });
    
    // If we already have generated data, no need to trigger generation
    if (generatedProfileData) {
      console.log("Generated profile data already available, skipping generation");
      return;
    }
    
    // If generation was initiated from CV upload page or is in progress
    if ((generationInitiated || aiGenerationInProgress) && !generationTriggeredRef.current && !isGenerating) {
      console.log("Generation in progress or initiated, checking status");
      checkGenerationStatus();
      return;
    }
  }, [aiGenerationInProgress, aiGenerationMethod, isGenerating, generatedProfileData]);

  // Function to check the generation status
  const checkGenerationStatus = () => {
    if (generationTriggeredRef.current) {
      return; // Don't check if already triggered
    }
    
    setIsGenerating(true);
    console.log("Checking generation status");
    
    // Get CSRF token from the meta tag
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    axios.get(route('ai.status'), {
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(response => {
        console.log("Status check response:", response.data);
        
        if (response.data.status === 'in_progress') {
          // Still in progress, check again after delay
          setTimeout(checkGenerationStatus, 3000);
        } else if (response.data.status === 'error') {
          // Error occurred
          setIsGenerating(false);
          alert("Profile generation failed: " + response.data.message);
        } else if (response.data.status === 'completed' || response.data.data || 
                 (typeof response.data === 'object' && response.data.full_name)) {
          // Generation completed - handle different response formats
          setIsGenerating(false);
          let profileData = response.data;
          
          // Handle nested response structure if present
          if (response.data.data) {
            profileData = response.data.data;
          } else if (response.data.response) {
            profileData = response.data.response;
          }
          
          if (profileData) {
            // Apply the generated profile data
            updateFormWithGeneratedData(profileData);
            
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
          // Fallback to checking directly from cache in case status API doesn't return expected format
          console.log("Unexpected status format, checking cache directly");
          setIsGenerating(false);
        }
      })
      .catch(error => {
        console.error("Error checking generation status:", error);
        console.log('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        setIsGenerating(false);
      });
  };

  // Load Google Scholar status on component mount
  useEffect(() => {
    if (data.google_scholar) {
      fetchScholarStatus();
    }
  }, [data.google_scholar]);

  // Function to fetch Google Scholar scraping status
  const fetchScholarStatus = () => {
    axios.get('/api/scholar/status')
      .then(response => {
        if (response.data.success) {
          setScholarStatus(response.data);
          setCanUpdateScholar(response.data.can_update);
          if (response.data.profile) {
            setScholarLastUpdated(response.data.profile.last_updated_human);
          }
        }
      })
      .catch(error => {
        console.error("Error fetching Google Scholar status:", error);
      });
  };

  // Function to trigger Google Scholar scraping
  const handleScholarScrape = () => {
    if (!data.google_scholar) {
      alert("Please add your Google Scholar URL first.");
      return;
    }

    setIsScrapingScholar(true);
    axios.post('/api/scholar/scrape')
      .then(response => {
        setIsScrapingScholar(false);
        if (response.data.success) {
          alert(response.data.message);
          fetchScholarStatus(); // Refresh status after successful scrape
        } else {
          alert(response.data.message || "Failed to update Google Scholar profile.");
        }
      })
      .catch(error => {
        setIsScrapingScholar(false);
        console.error("Error scraping Google Scholar:", error);
        alert(error.response?.data?.message || "An error occurred while updating your Google Scholar profile.");
      });
  };

  // Handle URL input changes
  const updateUrl = (index, value) => {
    const urls = [...providedUrls];
    urls[index] = value;
    setProvidedUrls(urls);
  };

  const addUrlField = () => {
    setProvidedUrls([...providedUrls, '']);
  };

  // Function to initiate profile generation (existing functionality)
  const handleGenerateProfile = async () => {
    setIsGenerating(true);
    setGenerationStatus('Generating...');
    
    try {
        const response = await axios.post(route('academician.generateProfile'), {
            mode: 'auto',
        });
        
        if (response.status === 200) {
            // Update form values with generated profile data
            const profileData = response.data;
            
            // Update form fields
            updateFormWithGeneratedData(profileData);
            
            setGenerationStatus('Profile generated successfully!');
            setTimeout(() => {
                setGenerationStatus('');
            }, 3000);
        }
    } catch (error) {
        console.error('Error generating profile:', error);
        setGenerationStatus('Error generating profile. Please try again.');
    } finally {
        setIsGenerating(false);
    }
  };

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
            
            console.log('Attempting CV generation with existing CV file');
            console.log('CSRF Token:', csrfToken);
            console.log('Using existing CV:', data.CV_file);
            
            // Standard headers
            const headers = {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
            };
            
            const response = await axios.post(route('ai.generate.cv'), formData, {
                headers: headers
            });
            
            console.log('CV generation successful:', response.data);
            
            if (response.data) {
                // Ensure the CV file path is updated in the form data
                if (response.data.CV_file) {
                    console.log('Updating CV file path from response:', response.data.CV_file);
                    setData(prevData => ({
                        ...prevData,
                        CV_file: response.data.CV_file
                    }));
                }
                
                // Update rest of the form data
                updateFormWithGeneratedData(response.data);
                setGenerationStatus('Profile generated successfully!');
                setIsGenerating(false);
            }
        } catch (error) {
            console.error('Error generating profile from CV:', error);
            console.log('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText,
                headers: error.response?.headers
            });
            setGenerationStatus(`Error (${error.response?.status || 'unknown'}): ${error.message}`);
            setIsGenerating(false);
        }
    } else {
        // No CV exists, prompt for upload
        setCVModalOpen(true);
    }
  };

  const [cvFile, setCVFile] = useState(null);
  const [cvModalOpen, setCVModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setCVFile(e.target.files[0]);
  };

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
        
        // Log CV file details for debugging
        console.log('CV File details:', {
            name: cvFile.name,
            size: cvFile.size,
            type: cvFile.type,
            lastModified: new Date(cvFile.lastModified).toISOString()
        });
        
        // Ensure the file size isn't too large
        if (cvFile.size > 5 * 1024 * 1024) {
            throw new Error('File size exceeds 5MB. Please upload a smaller file.');
        }
        
        const response = await axios.post(route('ai.generate.cv'), formData, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            // Add explicit timeout and make sure we're handling binary data properly
            responseType: 'json',
            timeout: 60000, // 60 seconds
        });
        
        console.log('CV generation successful:', response.data);
        
        // Update profile data
        if (response.data) {
            setCVModalOpen(false);
            setCVFile(null);
            
            // Update CV_file path in the form data FIRST
            // This ensures the CV file path is correctly set in the form
            if (response.data.CV_file) {
                console.log('Updating CV file path:', response.data.CV_file);
                setData(prevData => ({
                    ...prevData,
                    CV_file: response.data.CV_file // Update with string path from server
                }));
            }
            
            // Then update the rest of the profile data
            updateFormWithGeneratedData(response.data);
            setGenerationStatus('Profile generated successfully!');
            setIsUploading(false);
        }
    } catch (error) {
        console.error('Error uploading CV:', error);
        console.log('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            statusText: error.response?.statusText,
            headers: error.response?.headers
        });
        
        setGenerationStatus(`Error (${error.response?.status || 'unknown'}): ${error.message}`);
        setIsUploading(false);
    }
  };

  // Function to download the profile picture (existing)
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

  // Function to update the background image (existing)
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

  // Function to submit the updated profile (existing)
  const submit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key !== "profile_picture" && key !== "background_image" && key !== "CV_file") {
        if (key === "research_expertise") {
          formData.append(key, JSON.stringify(data[key]));
        } else if (key === "availability_as_supervisor") {
          formData.append(key, data[key] === true ? 1 : 0);
        } else if (Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    // Handle CV file separately
    if (data.CV_file && typeof data.CV_file !== 'string') {
      formData.append('CV_file', data.CV_file);
    } else if (data.CV_file === '') {
      // If cv is empty string, it means the user has removed the CV
      formData.append('CV_file', '');
    }

    // Use Inertia's post method with proper callbacks to ensure UI state is updated correctly
    post(route("role.update"), {
      data: formData,
      onStart: () => {
        // This ensures the processing state is properly set at the start
        console.log('Form submission started');
      },
      onSuccess: () => {
        // This will be called when the server responds with a successful response
        console.log('Form submission successful');
        // Show success alert to the user
        alert('Profile updated successfully!');
        // The recentlySuccessful state will be automatically set to true here
        // and will be automatically set back to false after 2 seconds
      },
      onError: (errors) => {
        // Handle errors if needed
        console.error('Form submission errors:', errors);
      },
      onFinish: () => {
        // This will be called regardless of success or error
        console.log('Form submission completed');
        // Ensure any custom loading states are reset
      }
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleProfilePictureClick = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profiles');

  // New function to handle CV download with user-customized text
  const handleDownloadCV = (customizedCVText) => {
    setIsDownloading(true);
    axios
      .post(
        route('role.generateCV'),
        { customized_cv: customizedCVText },
        { responseType: 'blob' }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'cv.docx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        setIsDownloading(false);
        setShowCVModal(false);
      })
      .catch((error) => {
        console.error("CV generation failed:", error);
        alert("Failed to generate CV. Please try again.");
        setIsDownloading(false);
      });
  };

  // New: Handle "Preview & Generate CV" button click
  const handleCVButtonClick = () => {
    // Show a requirement modal reminding users to fill in website and Google Scholar.
    setShowRequirementModal(true);
  };

  // When user confirms, close the requirement modal and open the CV preview modal.
  const proceedToCVPreview = () => {
    setShowRequirementModal(false);
    setShowCVModal(true);
  };

  // Reset generation flag to allow re-generation
  const resetGenerationFlag = () => {
    generationTriggeredRef.current = false;
  };

  // Handle showing the method selection modal
  const showAIGenerationModal = () => {
    resetGenerationFlag();
    setShowMethodModal(true);
  };

  const [generationStatus, setGenerationStatus] = useState('');

  const updateFormWithGeneratedData = (profileData) => {
    setData((prevData) => ({
      ...prevData,
      full_name: profileData.full_name || prevData.full_name,
      phone_number: profileData.phone_number || prevData.phone_number,
      bio: profileData.bio || prevData.bio,
      current_position: profileData.current_position || prevData.current_position,
      department: profileData.department || prevData.department,
      highest_degree: profileData.highest_degree || prevData.highest_degree,
      field_of_study: profileData.field_of_study || prevData.field_of_study,
      // Preserve existing research_expertise if AI returns empty array or undefined
      research_expertise: (profileData.research_expertise && profileData.research_expertise.length > 0) 
        ? profileData.research_expertise 
        : prevData.research_expertise,
      personal_website: profileData.personal_website || prevData.personal_website,
      institution_website: profileData.institution_website || prevData.institution_website,
      linkedin: profileData.linkedin || prevData.linkedin,
      google_scholar: profileData.google_scholar || prevData.google_scholar,
      researchgate: profileData.researchgate || prevData.researchgate,
      // Preserve CV_file if it was already set in the handleCVUpload function
      CV_file: prevData.CV_file || profileData.CV_file,
    }));
  };

  return (
    <div className="pb-8 border border-gray-200 rounded">
      <div className="w-full bg-white pb-12 shadow-md relative mb-4">
        {/* Background Image */}
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={`/storage/${data.background_image || "default-background.jpg"}`}
            alt="Background"
            className="w-full h-full object-cover"
          />
          {/* Edit Button for Background */}
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
          {/* Profile Image */}
          <div className="relative">
            <img
              src={`/storage/${data.profile_picture || "default-profile.jpg"}`}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            {/* Edit Button for Profile */}
            <button
              onClick={handleProfilePictureClick}
              className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-lg text-white hover:bg-blue-600"
              aria-label="Edit Profile Picture"
            >
              ✏️
            </button>
          </div>

          {/* Profile Details */}
          <div className="text-center mt-4">
            <h1 className="text-2xl font-semibold text-gray-800">{data.full_name}</h1>
            {data.highest_degree && (
              <p className="text-gray-500">
                {data.highest_degree} in {data.field_of_study} 
              </p>
            )}
            <p className="text-gray-500">{data.current_position}</p>
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
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsBackgroundModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
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
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-8xl mx-auto flex md:space-x-12 space-x-4 px-4 sm:px-8">
          {/* {['Profiles', 'Projects', 'Works', 'Teams', 'Network', 'Activity', 'More'].map((tab) => ( */}
          {['Profiles', 'Publications'].map((tab) => (
            <button
              key={tab}
              className={`py-4 px-3 md:text-lg text-base font-semibold ${
                activeTab.toLowerCase() === tab.toLowerCase()
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                if (tab.toLowerCase() === 'publications') {
                  window.location.href = route('role.publications');
                } else {
                  setActiveTab(tab.toLowerCase());
                }
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Modal */}
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
              <p className="text-lg font-medium">{generationStatus}</p>
              <svg className="animate-spin h-8 w-8 mt-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            </div>
          </div>
        </Transition>
      )}

      {/* Method Selection Modal */}
      <Transition
        show={showMethodModal}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowMethodModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Select Generation Method</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Choose method:
              </label>
              <select
                className="block w-full border-gray-300 rounded-md shadow-sm"
                value={genMode}
                onChange={(e) => setGenMode(e.target.value)}
              >
                <option value="auto">Auto search from Internet</option>
                <option value="url">Use my provided URL(s)</option>
                <option value="cv">Generate from CV</option>
              </select>
            </div>
            {genMode === 'url' && (
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2">
                  The system will use the Website, LinkedIn, Google Scholar, and ResearchGate fields from your profile.
                  You can also add extra URL(s) below if you wish.
                </p>
                {providedUrls.map((url, index) => (
                  <input
                    key={index}
                    type="text"
                    className="block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    placeholder="https://example.com/extra-info"
                  />
                ))}
                <button
                  type="button"
                  onClick={addUrlField}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-800"
                >
                  Add URL
                </button>
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowMethodModal(false);
                  if (genMode === 'cv') {
                    handleGenerateProfileFromCV();
                  } else {
                    handleGenerateProfile();
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-800"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </Transition>

      {/* Tab Content Section */}
      <div className="w-full px-4 py-8">
        {activeTab === 'profiles' && (
          <section className={`${className} px-4`}>
            <div className="relative mb-6">
              <header>
                <h2 className="text-lg font-medium text-gray-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Update your personal information.
                </p>
              </header>
              
              {/* Desktop view: button in the top right */}
              <div className="hidden sm:flex space-x-2 absolute top-0 right-0 mt-2 mr-2">
                <button 
                  type="button" 
                  onClick={showAIGenerationModal}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-800"
                >
                  AI Generated Profile
                </button>
                {/* <button 
                              type="button" 
                              onClick={handleCVButtonClick}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
                            >
                              Preview & Generate CV
                            </button> */}
              </div>
              
              {/* Mobile view: button below header */}
              <div className="sm:hidden mt-4">
                <button 
                  type="button" 
                  onClick={showAIGenerationModal}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-800"
                >
                  AI Generated Profile
                </button>
                {/* <button 
                              type="button" 
                              onClick={handleCVButtonClick}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
                            >
                              Preview & Generate CV
                            </button> */}
              </div>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-6">
              {/* Full Name and Phone Number */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                <div className="w-full">
                  <InputLabel htmlFor="full_name" value={<>Full Name (Without Salutation) <span className="text-red-600">*</span></>} required />
                  <TextInput
                    id="full_name"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={data.full_name}
                    onChange={(e) => setData('full_name', e.target.value)}
                    required
                    isFocused
                    autoComplete="full_name"
                  />
                  <InputError className="mt-2" message={errors.full_name} />
                </div>
                <div className="w-full">
                  <InputLabel htmlFor="phone_number" value="Phone Number" />
                  <TextInput
                    id="phone_number"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={data.phone_number}
                    onChange={(e) => setData('phone_number', e.target.value)}
                    autoComplete="tel"
                  />
                  <InputError className="mt-2" message={errors.phone_number} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                <div className="w-full">
                  <InputLabel htmlFor="highest_degree" value={<>Highest Degree <span className="text-red-600">*</span></>} required />
                  <select
                    id="highest_degree"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={data.highest_degree || ''}
                    onChange={(e) => setData('highest_degree', e.target.value)}
                  >
                    <option value="" hidden>Select your Highest Degree</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Ph.D.">Ph.D.</option>
                    <option value="Postdoctoral">Postdoctoral</option>
                  </select>
                  <InputError className="mt-2" message={errors.highest_degree} />
                </div>
                <div className="w-full">
                  <InputLabel htmlFor="field_of_study" value={<>Field of Study <span className="text-red-600">*</span></>} required />
                  <TextInput
                    id="field_of_study"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={data.field_of_study}
                    onChange={(e) => setData('field_of_study', e.target.value)}
                  />
                  <InputError className="mt-2" message={errors.field_of_study} />
                </div>
              </div>

              {/* CV Upload Section */}
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
                      <button
                        type="button"
                      onClick={() => setData('CV_file', '')}
                      className="ml-3 text-xs text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                <p className="mt-1 text-sm text-gray-500">
                  Upload your CV to enable CV-based profile generation and enhance your academic profile.
                </p>
                <InputError className="mt-2" message={errors.CV_file} />
              </div>

              <div className="grid grid-cols-1 gap-6 w-full">
                <div className="w-full">
                  <InputLabel htmlFor="bio" value={<>Short Bio <span className="text-red-600">*</span></>} required/>
                  <textarea
                    id="bio"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={data.bio}
                    onChange={(e) => setData('bio', e.target.value)}
                    rows={4}
                  />
                  <InputError className="mt-2" message={errors.bio} />
                </div>
              </div>

              {/* Research Expertise Searchable Dropdown */}
              <div className="w-full">
                <label htmlFor="research_expertise" className="block text-sm font-medium text-gray-700">
                  Field of Research (Multiple Selection) Structure : Field of Research - Research Area - Niche Domain <span className="text-red-600">*</span>
                </label>
                <Select
                  id="research_expertise"
                  isMulti
                  options={researchOptions.map((option) => ({
                    value: `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}`,
                    label: `${option.field_of_research_name} - ${option.research_area_name} - ${option.niche_domain_name}`,
                  }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  classNamePrefix="select"
                  menuPortalTarget={document.body}
                  hideSelectedOptions={false} // Keep selected options visible in the dropdown
                  closeMenuOnSelect={false} // Keep the menu open after selection
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
                    // Style for options in dropdown to highlight already selected items
                    option: (provided, { data, isSelected, isFocused, isDisabled }) => {
                      return {
                        ...provided,
                        backgroundColor: isSelected
                          ? '#2563EB' // Primary blue for active selection
                          : isFocused
                          ? '#F3F4F6' // Light gray on hover
                          : 'white',
                        color: isSelected 
                          ? 'white' 
                          : '#374151', // Default text color
                        // Add checkmark for selected items
                        paddingLeft: isSelected ? '25px' : provided.paddingLeft,
                        position: 'relative',
                        ':before': isSelected
                          ? {
                              content: '"✓"',
                              position: 'absolute',
                              left: '10px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: 'white',
                            }
                          : undefined,
                      };
                    },
                  }}
                  
                  value={data.research_expertise?.map((selectedValue) => {
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
                    setData('research_expertise', selectedValues);
                  }}
                  placeholder="Select field of research..."
                  
                  // Using proper react-select props for sorting and grouping
                  // This custom filter function controls the order of options
                  filterOption={(option, inputValue) => {
                    // Filter options based on input text
                    return inputValue ? option.label.toLowerCase().includes(inputValue.toLowerCase()) : true;
                  }}
                  // This custom sort function ensures selected options appear at the top
                  // In react-select v5 the order of options is determined by this parameter
                  components={{
                    MenuList: props => {
                      // Clone the children (options) for sorting
                      const children = React.Children.toArray(props.children);
                      
                      // Extract the currently selected values
                      const selectedValues = data.research_expertise || [];
                      
                      // Sort children: first selected options, then unselected
                      const sortedChildren = children.sort((a, b) => {
                        if (!a || !b || !a.props || !b.props) return 0;
                        
                        // Get option values - respect react-select internal structure
                        const aValue = a.props.data?.value;
                        const bValue = b.props.data?.value;
                        
                        // Check if options are selected
                        const aSelected = selectedValues.includes(aValue);
                        const bSelected = selectedValues.includes(bValue);
                        
                        // Sort selected items first
                        if (aSelected && !bSelected) return -1;
                        if (!aSelected && bSelected) return 1;
                        
                        // If both have same selection status, sort alphabetically by label
                        return a.props.data?.label?.localeCompare(b.props.data?.label) || 0;
                      });
                      
                      // Return the MenuList with sorted children and fixed height with scrolling
                      return (
                        <div 
                          className="react-select__menu-list" 
                          {...props.innerProps}
                          style={{
                            maxHeight: '215px', // Height to show approximately 5-7 items
                            overflowY: 'auto',  // Enable vertical scrolling
                            padding: '5px 0'    // Maintain padding from original component
                          }}
                        >
                          {sortedChildren}
                        </div>
                      );
                    }
                  }}
                />
              </div>

              {/* Associated Postgraduate Programs */}
              <div className="w-full">
                <label htmlFor="postgraduate_program_ids" className="block text-sm font-medium text-gray-700">
                  Associated Postgraduate Programs
                </label>
                <Select
                  id="postgraduate_program_ids"
                  isMulti
                  options={allPrograms.map(p => ({ value: p.id, label: p.name }))}
                  className="mt-1 block w-full"
                  classNamePrefix="select"
                  value={allPrograms
                    .map(p => ({ value: p.id, label: p.name }))
                    .filter(opt => data.postgraduate_program_ids?.includes(opt.value))}
                  onChange={(selected) => {
                    const ids = (selected || []).map(opt => opt.value);
                    setData('postgraduate_program_ids', ids);
                  }}
                  placeholder="Select associated programs..."
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (provided) => ({ ...provided, zIndex: 9999 })
                  }}
                />
              </div>

              {/* Additional Fields for Academician */}
              {academician && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    <div className="w-full">
                      <InputLabel htmlFor="current_position" value={<>Current Position <span className="text-red-600">*</span></>} required />
                      <select
                        id="current_position"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        value={data.current_position}
                        onChange={(e) => setData('current_position', e.target.value)}
                      >
                        <option value="" hidden>Select Position</option>
                        <option value="Lecturer">Lecturer</option>
                        <option value="Senior Lecturer">Senior Lecturer</option>
                        <option value="Assoc. Prof.">Associate Professor</option>
                        <option value="Professor">Professor</option>
                        <option value="Postdoctoral Researcher">Postdoctoral Researcher</option>
                        <option value="Researcher">Researcher</option>
                      </select>
                      <InputError className="mt-2" message={errors.current_position} />
                    </div>
                    <div className="w-full">
                      <InputLabel htmlFor="department" value={<>Department <span className="text-red-600">*</span></>} required />
                      <TextInput
                        id="department"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        value={data.department}
                        onChange={(e) => setData('department', e.target.value)}
                      />
                      <InputError className="mt-2" message={errors.department} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    <div className="w-full">
                      <InputLabel htmlFor="availability_as_supervisor" value={<>Availability as Supervisor <span className="text-red-600">*</span></>} required />
                      <select
                        id="availability_as_supervisor"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        value={data.availability_as_supervisor ? 'true' : 'false'}
                        onChange={(e) => setData('availability_as_supervisor', e.target.value === 'true')}
                      >
                        <option value="true">Available</option>
                        <option value="false">Not Available</option>
                      </select>
                      <InputError className="mt-2" message={errors.availability_as_supervisor} />
                    </div>
                    <div className="w-full">
                      <div className="flex items-center gap-2">
                        <InputLabel htmlFor="style_of_supervision" value={<>Style of Supervision <span className="text-red-600">*</span></>} required />
                        <div className="group relative">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-help">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                          </svg>
                          <div className="absolute left-0 w-80 p-4 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 -translate-x-1/2 translate-y-2">
                            <div className="space-y-2">
                              <p><span className="font-semibold">Directive:</span> Structured approach with active guidance and regular monitoring</p>
                              <p><span className="font-semibold">Facilitative:</span> Supportive approach encouraging student independence</p>
                              <p><span className="font-semibold">Coaching:</span> Focuses on personal development and academic growth</p>
                              <p><span className="font-semibold">Adaptive:</span> Flexible support based on student's changing needs</p>
                              <p><span className="font-semibold">Participatory:</span> Collaborative approach with shared decision-making</p>
                            </div>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                              <div className="border-8 border-transparent border-b-gray-800"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Select
                        id="style_of_supervision"
                        isMulti
                        options={[
                          { value: 'Directive Supervision', label: 'Directive Supervision' },
                          { value: 'Facilitative Supervision', label: 'Facilitative Supervision' },
                          { value: 'Coaching Supervision', label: 'Coaching Supervision' },
                          { value: 'Adaptive Supervision', label: 'Adaptive Supervision' },
                          { value: 'Participatory Supervision', label: 'Participatory Supervision' },
                        ]}
                        className="mt-1 block w-full"
                        classNamePrefix="select"
                        value={
                          Array.isArray(data.style_of_supervision)
                            ? data.style_of_supervision.map(style => ({
                                value: style,
                                label: style
                              }))
                            : []
                        }
                        onChange={(selectedOptions) => {
                          const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                          setData('style_of_supervision', selectedValues);
                        }}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (provided) => ({
                            ...provided,
                            zIndex: 9999
                          })
                        }}
                      />
                      <InputError className="mt-2" message={errors.style_of_supervision} />
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                <div>
                  <InputLabel htmlFor="personal_website" value="Personal Website" />
                  <TextInput
                    id="personal_website"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={data.personal_website}
                    onChange={(e) => setData('personal_website', e.target.value)}
                    autoComplete="url"
                  />
                  <InputError className="mt-2" message={errors.personal_website} />
                </div>
                <div>
                  <InputLabel htmlFor="institution_website" value="Institutional Website" />
                  <TextInput
                    id="institution_website"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={data.institution_website}
                    onChange={(e) => setData('institution_website', e.target.value)}
                    autoComplete="url"
                  />
                  <InputError className="mt-2" message={errors.institution_website} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                <div>
                  <InputLabel htmlFor="linkedin" value="LinkedIn" />
                  <TextInput
                    id="linkedin"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={data.linkedin}
                    onChange={(e) => setData('linkedin', e.target.value)}
                    autoComplete="url"
                  />
                  <InputError className="mt-2" message={errors.linkedin} />
                </div>
                <div>
                  <InputLabel htmlFor="google_scholar" value="Google Scholar" />
                  <div className="flex flex-col space-y-2">
                    <TextInput
                      id="google_scholar"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      value={data.google_scholar}
                      onChange={(e) => setData('google_scholar', e.target.value)}
                      autoComplete="url"
                    />
                    <InputError className="mt-2" message={errors.google_scholar} />
                  </div>
                </div>
                <div>
                  <InputLabel htmlFor="researchgate" value="ResearchGate" />
                  <TextInput
                    id="researchgate"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={data.researchgate}
                    onChange={(e) => setData('researchgate', e.target.value)}
                    autoComplete="url"
                  />
                  <InputError className="mt-2" message={errors.researchgate} />
                </div>
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
        )}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Additional tab content */}
          </div>
        )}
      </div>

      {/* Render the CV Preview Modal */}
      {showCVModal && (
        <CVPreviewModal
          onClose={() => setShowCVModal(false)}
          onDownload={handleDownloadCV}
        />
      )}

      {isDownloading && (
      <Transition
        show={isDownloading}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-medium">Downloading CV, please wait...</p>
            <svg className="animate-spin h-8 w-8 mt-4 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>
        </div>
      </Transition>
    )}

    {/* Requirement Modal */}
    {showRequirementModal && (
        <Transition
          show={showRequirementModal}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">
                Reminder
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                The "Generate CV" feature requires that your Website and Google Scholar fields are filled so that the system can extract data from those URLs.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowRequirementModal(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={proceedToCVPreview}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                >
                  Proceed
                </button>
              </div>
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

