import React, { useState, useEffect, useRef } from "react";
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import NationalityForm from "./NationalityForm";
import Select from 'react-select';
import axios from 'axios';

export default function PostgraduateForm({ universities, faculties, className = '', researchOptions, skills, aiGenerationInProgress, aiGenerationMethod, generatedProfileData }) {
    // Add useRef for tracking generation
    const generationTriggeredRef = useRef(false);
    
    const postgraduate = usePage().props.postgraduate; // Related postgraduate data

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        // common fields
        phone_number: postgraduate?.phone_number || '',
        full_name: postgraduate?.full_name || '',
        previous_degree:
            typeof postgraduate?.previous_degree === 'string'
                ? JSON.parse(postgraduate?.previous_degree)
                : postgraduate?.previous_degree || [],
        bachelor: postgraduate?.bachelor || '',
        CGPA_bachelor: postgraduate?.CGPA_bachelor || '',
        master: postgraduate?.master || '',
        master_type: postgraduate?.master_type || '',
        nationality: postgraduate?.nationality || '',
        english_proficiency_level: postgraduate?.english_proficiency_level || '',
        funding_requirement: postgraduate?.funding_requirement || '',
        current_postgraduate_status: postgraduate?.current_postgraduate_status || '',
        matric_no: postgraduate?.matric_no || '',
        suggested_research_title: postgraduate?.suggested_research_title || '',
        suggested_research_description: postgraduate?.suggested_research_description || '',
        CV_file: postgraduate?.CV_file || '',
        profile_picture: postgraduate?.profile_picture || '',
        field_of_research:
            typeof postgraduate?.field_of_research === 'string'
                ? JSON.parse(postgraduate?.field_of_research)
                : postgraduate?.field_of_research || [],
        website: postgraduate?.website || '',
        linkedin: postgraduate?.linkedin || '',
        google_scholar: postgraduate?.google_scholar || '',
        researchgate: postgraduate?.researchgate || '',
        bio: postgraduate?.bio || '',
        // postgraduate-only fields
        faculty: postgraduate?.faculty || '',
        university: postgraduate?.university || '',
        background_image: postgraduate?.background_image || '',
        // NEW: skills field as a JSON attribute (storing skill IDs)
        skills: postgraduate?.skills || [],
        // NEW: supervisorAvailability field as boolean - ensure it's a boolean value
        supervisorAvailability: postgraduate?.supervisorAvailability === true || postgraduate?.supervisorAvailability === 1 || postgraduate?.supervisorAvailability === "true",
        // NEW: grantAvailability field as boolean - ensure it's a boolean value
        grantAvailability: postgraduate?.grantAvailability === true || postgraduate?.grantAvailability === 1 || postgraduate?.grantAvailability === "true",
    });

    // Add state for CV generation
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStatus, setGenerationStatus] = useState('');
    const [cvFile, setCVFile] = useState(null);
    const [cvModalOpen, setCVModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Initialize checkbox states based on previous_degree array
    const [bachelorSelected, setBachelorSelected] = useState(false);
    const [masterSelected, setMasterSelected] = useState(false);

    useEffect(() => {
        if (Array.isArray(data.previous_degree)) {
            setBachelorSelected(data.previous_degree.includes("Bachelor Degree"));
            setMasterSelected(data.previous_degree.includes("Master"));
        }
    }, [data.previous_degree]);

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
        
        // If we already have generated data, apply it immediately
        if (generatedProfileData && !generationTriggeredRef.current) {
            console.log("Applying directly available generated profile data:", generatedProfileData);
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
            console.log("Generation in progress or initiated, checking status");
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
        console.log("Checking generation status");
        
        axios.get(route('ai.status'), {
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            }
        })
            .then(response => {
                console.log("Status check response:", response.data);
                
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
                    console.log('Unexpected status:', response.data.status);
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
        console.log('Updating form with data:', profileData); // Debug log
        
        setData((prevData) => ({
            ...prevData,
            full_name: profileData.full_name || prevData.full_name,
            phone_number: profileData.phone_number || prevData.phone_number,
            bio: profileData.bio || prevData.bio,
            nationality: profileData.nationality || prevData.nationality,
            english_proficiency_level: profileData.english_proficiency_level || prevData.english_proficiency_level,
            previous_degree: profileData.previous_degree || prevData.previous_degree,
            bachelor: profileData.bachelor || prevData.bachelor,
            CGPA_bachelor: profileData.CGPA_bachelor || prevData.CGPA_bachelor,
            master: profileData.master || prevData.master,
            master_type: profileData.master_type || prevData.master_type,
            // Preserve existing field_of_research if AI returns empty array or undefined
            field_of_research: (profileData.field_of_research && profileData.field_of_research.length > 0)
                ? profileData.field_of_research
                : prevData.field_of_research,
            suggested_research_title: profileData.suggested_research_title || prevData.suggested_research_title,
            suggested_research_description: profileData.suggested_research_description || prevData.suggested_research_description,
            skills: profileData.skills || prevData.skills,
            funding_requirement: profileData.funding_requirement || prevData.funding_requirement,
            current_postgraduate_status: profileData.current_postgraduate_status || prevData.current_postgraduate_status,
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

    const handleStatusChange = (e) => {
        const status = e.target.value;
        if (status !== "Registered") {
            // Clear university, faculty and matric no. if not Registered
            setData(prevData => ({
                ...prevData,
                current_postgraduate_status: status,
                matric_no: "",
                university: "",
                faculty: "",
            }));
            setSelectedUniversity("");
        } else {
            setData(prevData => ({
                ...prevData,
                current_postgraduate_status: status,
            }));
        }
    };

    // Local state for university selection and filtering faculties
    const [selectedUniversity, setSelectedUniversity] = useState(data.university);
    const filteredFaculties = faculties.filter(
        (faculty) => faculty.university_id === parseInt(selectedUniversity)
    );

    // Research form visibility
    const [showResearchForm, setShowResearchForm] = useState(false);
    useEffect(() => {
        if (data.suggested_research_title || data.suggested_research_description) {
            setShowResearchForm(true);
        }
    }, [data.suggested_research_title, data.suggested_research_description]);

    const handleResearchTitleChange = (e) => {
        if (e.target.value === "yes") {
            setShowResearchForm(true);
        } else {
            setShowResearchForm(false);
            setData((prevData) => ({
                ...prevData,
                suggested_research_title: "",
                suggested_research_description: "",
            }));
        }
    };

    // Define skills options (using backend-provided skills)
    const skillsOptions = skills.map(skill => ({
        value: skill.id,
        label: skill.name,
    }));

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            // Exclude profile_picture from this submission if handled separately
            if (key !== "profile_picture") {
                if (Array.isArray(data[key])) {
                    formData.append(key, JSON.stringify(data[key]));
                } else if (key === "supervisorAvailability" || key === "grantAvailability") {
                    // Send the actual boolean value without converting to string
                    formData.append(key, data[key]);
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

    // Local state for modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleProfilePictureClick = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profiles');

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
        // Responsive outer container
        <div className="max-w-8xl mx-auto px-4 pb-8">
            {/* Header Section */}
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
                        {data.previous_degree && (
                            <p className="text-gray-500">
                                {data.previous_degree?.includes("Master") ? "Master" : "Bachelor Degree"} in {data.master ? data.master : data.bachelor}
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
                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
            <section className={className}>
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
                            <InputLabel htmlFor="bio" value={<>Short Bio <span className="text-red-600">*</span></>} />
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

                    {/* Previous Degree Checkboxes */}
                    <h3 className="font-medium text-gray-900">Your Previous Degree</h3>
                    <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="form-checkbox"
                                checked={bachelorSelected}
                                onChange={() => {
                                    const newBachelorSelected = !bachelorSelected;
                                    setBachelorSelected(newBachelorSelected);
                                    setData((prevData) => ({
                                        ...prevData,
                                        previous_degree: JSON.stringify([
                                            ...(newBachelorSelected ? ["Bachelor Degree"] : []),
                                            ...(masterSelected ? ["Master"] : []),
                                        ]),
                                        bachelor: newBachelorSelected ? prevData.bachelor : "",
                                        CGPA_bachelor: newBachelorSelected ? prevData.CGPA_bachelor : "",
                                    }));
                                }}
                            />
                            <span>Bachelor Degree</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="form-checkbox"
                                checked={masterSelected}
                                onChange={() => {
                                    const newMasterSelected = !masterSelected;
                                    setMasterSelected(newMasterSelected);
                                    setData((prevData) => ({
                                        ...prevData,
                                        previous_degree: JSON.stringify([
                                            ...(bachelorSelected ? ["Bachelor Degree"] : []),
                                            ...(newMasterSelected ? ["Master"] : []),
                                        ]),
                                        master: newMasterSelected ? prevData.master : "",
                                        master_type: newMasterSelected ? prevData.master_type : "",
                                    }));
                                }}
                            />
                            <span>Master</span>
                        </label>
                    </div>

                    {/* Degree Details */}
                    {bachelorSelected && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                            <div>
                                <InputLabel htmlFor="bachelor" value="Name of Bachelor Degree" />
                                <TextInput
                                    id="bachelor"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.bachelor || ''}
                                    onChange={(e) =>
                                        setData((prevData) => ({
                                            ...prevData,
                                            bachelor: e.target.value,
                                        }))
                                    }
                                />
                                <InputError className="mt-2" message={errors.bachelor} />
                            </div>
                            <div>
                                <InputLabel htmlFor="CGPA_bachelor" value="CGPA Bachelor" />
                                <TextInput
                                    id="CGPA_bachelor"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.CGPA_bachelor || ''}
                                    onChange={(e) =>
                                        setData((prevData) => ({
                                            ...prevData,
                                            CGPA_bachelor: e.target.value,
                                        }))
                                    }
                                />
                                <InputError className="mt-2" message={errors.CGPA_bachelor} />
                            </div>
                        </div>
                    )}

                    {masterSelected && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                            <div>
                                <InputLabel htmlFor="master" value="Name of Master Degree" />
                                <TextInput
                                    id="master"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.master || ''}
                                    onChange={(e) =>
                                        setData((prevData) => ({
                                            ...prevData,
                                            master: e.target.value,
                                        }))
                                    }
                                />
                                <InputError className="mt-2" message={errors.master} />
                            </div>
                            <div>
                                <InputLabel htmlFor="master_type" value="Master Type" />
                                <select
                                    id="master_type"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.master_type || ''}
                                    onChange={(e) =>
                                        setData((prevData) => ({
                                            ...prevData,
                                            master_type: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="" hidden>Select Master Type</option>
                                    <option value="Full Research">Full Research</option>
                                    <option value="Coursework">Coursework</option>
                                    <option value="Research + Coursework">Research + Coursework</option>
                                </select>
                                <InputError className="mt-2" message={errors.master_type} />
                            </div>
                        </div>
                    )}

                    {/* Contact Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
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
                        <div>
                            <NationalityForm title="Nationality" value={data.nationality} onChange={(value) => setData('nationality', value)} errors={errors} />
                        </div>
                    </div>

                    {/* English Proficiency & Funding Requirement */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                        <div>
                            <InputLabel htmlFor="english_proficiency_level" value={<>English Proficiency Level <span className="text-red-600">*</span></>} required/>
                            <select
                                id="english_proficiency_level"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                value={data.english_proficiency_level || ''}
                                onChange={(e) => setData('english_proficiency_level', e.target.value)}
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
                            <InputLabel htmlFor="funding_requirement" value={<>Funding Requirement <span className="text-red-600">*</span></>} required/>
                            <select
                                id="funding_requirement"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                value={data.funding_requirement || ''}
                                onChange={(e) => setData('funding_requirement', e.target.value)}
                            >
                                <option value="" hidden>Select Funding Requirement</option>
                                <option value="I need a scholarship">I need a scholarship</option>
                                <option value="I need a grant">I need a grant</option>
                                <option value="I am self-funded">I am self-funded</option>
                            </select>
                            <InputError className="mt-2" message={errors.funding_requirement} />
                        </div>
                    </div>

                    {/* Current Postgraduate Status and Skills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                        <div>
                            <InputLabel htmlFor="current_postgraduate_status">
                                Current Postgraduate Status <span className="text-red-600">*</span>
                            </InputLabel>
                            <select
                                id="current_postgraduate_status"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                value={data.current_postgraduate_status}
                                onChange={handleStatusChange}
                            >
                                <option value="" hidden>Select your current postgraduate status</option>
                                <option value="Not registered yet">Not registered yet</option>
                                <option value="Registered">Registered</option>
                            </select>
                        </div>
                        <div className="w-full">
                            <InputLabel htmlFor="skills" value={<>Skills <span className="text-red-600">*</span></>} required/>
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
                            <InputError className="mt-2" message={errors.skills} />
                        </div>
                    </div>

                    {data.current_postgraduate_status === "Registered" && (
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
                                    onChange={(e) => setData('faculty', e.target.value)}
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

                    {data.current_postgraduate_status === "Registered" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                            <div>
                                <InputLabel htmlFor="matric_no" value={<>Matric No. <span className="text-red-600">*</span></>} required />
                                <TextInput
                                    id="matric_no"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.matric_no}
                                    onChange={(e) => setData('matric_no', e.target.value)}
                                    required
                                    autoComplete="matric_no"
                                />
                                <InputError className="mt-2" message={errors.matric_no} />
                            </div>
                            <div>
                                <InputLabel htmlFor="supervisorAvailability" value={<>Looking for a Supervisor? <span className="text-red-600">*</span></>} required/>
                                <select
                                    id="supervisorAvailability"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.supervisorAvailability === true ? "true" : "false"}
                                    onChange={(e) => setData('supervisorAvailability', e.target.value === "true")}
                                >
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                                <InputError className="mt-2" message={errors.supervisorAvailability} />
                            </div>
                        </div>
                    )}

                    {data.current_postgraduate_status === "Registered" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                            <div>
                                <InputLabel htmlFor="grantAvailability" value="Looking for a Grant?" />
                                <select
                                    id="grantAvailability"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.grantAvailability === true ? "true" : "false"}
                                    onChange={(e) => setData('grantAvailability', e.target.value === "true")}
                                >
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                                <InputError className="mt-2" message={errors.grantAvailability} />
                            </div>
                            <div>
                                <InputLabel htmlFor="has_suggested_research_title">
                                    Have own suggested research title?
                                </InputLabel>
                                <select
                                    id="has_suggested_research_title"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={showResearchForm ? "yes" : "no"}
                                    onChange={handleResearchTitleChange}
                                >
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Only show if not inside the grid from above */}
                    {data.current_postgraduate_status !== "Registered" && (
                        <div className="w-full">
                            <InputLabel htmlFor="has_suggested_research_title">
                                Have own suggested research title?
                            </InputLabel>
                            <select
                                id="has_suggested_research_title"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                value={showResearchForm ? "yes" : "no"}
                                onChange={handleResearchTitleChange}
                            >
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                    )}

                    {showResearchForm && (
                        <div className="w-full space-y-4">
                            <div>
                                <InputLabel htmlFor="suggested_research_title" value="Suggested Research Title" />
                                <TextInput
                                    id="suggested_research_title"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.suggested_research_title}
                                    onChange={(e) => setData('suggested_research_title', e.target.value)}
                                    required
                                    autoComplete="suggested_research_title"
                                />
                                <InputError className="mt-2" message={errors.suggested_research_title} />
                            </div>
                            <div>
                                <InputLabel htmlFor="suggested_research_description" value="Suggested Research Description" />
                                <textarea
                                    id="suggested_research_description"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.suggested_research_description}
                                    onChange={(e) => setData('suggested_research_description', e.target.value)}
                                    rows={4}
                                />
                                <InputError className="mt-2" message={errors.suggested_research_description} />
                            </div>
                        </div>
                    )}

                    {/* Research Expertise Searchable Dropdown */}
                    <div className="w-full">
                        <InputLabel htmlFor="field_of_research">
                            Field of Research (Multiple Selection) Structure : Field of Research - Research Area - Niche Domain <span className="text-red-600">*</span>
                        </InputLabel>
                        <Select
                            id="field_of_research"
                            isMulti
                            options={researchOptions.map((option) => ({
                                value: `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}`,
                                label: `${option.field_of_research_name} - ${option.research_area_name} - ${option.niche_domain_name}`,
                            }))}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            classNamePrefix="select"
                            hideSelectedOptions={false}
                            closeMenuOnSelect={false}
                            value={data.field_of_research?.map((selectedValue) => {
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
                            })}
                            styles={{
                                valueContainer: (provided) => ({
                                  ...provided,
                                  maxWidth: '100%',
                                }),
                                multiValueLabel: (provided) => ({
                                  ...provided,
                                  maxWidth: 250,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }),
                                menuPortal: (provided) => ({
                                  ...provided,
                                  zIndex: 9999,
                                }),
                                option: (provided, { data, isSelected, isFocused, isDisabled }) => {
                                  return {
                                    ...provided,
                                    backgroundColor: isSelected
                                      ? '#2563EB'
                                      : isFocused
                                      ? '#F3F4F6'
                                      : 'white',
                                    color: isSelected 
                                      ? 'white' 
                                      : '#374151',
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
                            onChange={(selectedOptions) => {
                                const selectedValues = selectedOptions.map((option) => option.value);
                                setData('field_of_research', selectedValues);
                            }}
                            placeholder="Select field of research..."
                            
                            filterOption={(option, inputValue) => {
                              return inputValue ? option.label.toLowerCase().includes(inputValue.toLowerCase()) : true;
                            }}
                            components={{
                              MenuList: props => {
                                const children = React.Children.toArray(props.children);
                                
                                const selectedValues = data.field_of_research || [];
                                
                                const sortedChildren = children.sort((a, b) => {
                                  if (!a || !b || !a.props || !b.props) return 0;
                                  
                                  const aValue = a.props.data?.value;
                                  const bValue = b.props.data?.value;
                                  
                                  const aSelected = selectedValues.includes(aValue);
                                  const bSelected = selectedValues.includes(bValue);
                                  
                                  if (aSelected && !bSelected) return -1;
                                  if (!aSelected && bSelected) return 1;
                                  
                                  return a.props.data?.label?.localeCompare(b.props.data?.label) || 0;
                                });
                                
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

                    {/* Additional Contact Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                        <div>
                            <InputLabel htmlFor="website" value="Website" />
                            <TextInput
                                id="website"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                value={data.website}
                                onChange={(e) => setData('website', e.target.value)}
                                autoComplete="url"
                            />
                            <InputError className="mt-2" message={errors.website} />
                        </div>
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
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                        <div>
                            <InputLabel htmlFor="google_scholar" value="Google Scholar" />
                            <TextInput
                                id="google_scholar"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                value={data.google_scholar}
                                onChange={(e) => setData('google_scholar', e.target.value)}
                                autoComplete="url"
                            />
                            <InputError className="mt-2" message={errors.google_scholar} />
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

                    {/* CV Upload */}
                    <div className="w-full">
                        <InputLabel htmlFor="CV_file" value="Upload CV (Max 5MB)" />
                        <input
                            type="file"
                            id="CV_file"
                            name="CV_file"
                            className="block w-full border-gray-300 rounded-md py-2"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    if (file.size <= 5 * 1024 * 1024) {
                                        setData((prevData) => ({
                                            ...prevData,
                                            CV_file: file,
                                        }));
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
