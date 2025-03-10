import React, { useState, useEffect } from "react";
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import NationalityForm from "./NationalityForm";
import Select from 'react-select';

export default function PostgraduateForm({ universities, faculties, className = '', researchOptions }) {
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
        // NEW: skills field as a JSON attribute; default to existing value or empty array
        skills: postgraduate?.skills || [],
    });

    // Initialize checkbox states based on previous_degree array
    const [bachelorSelected, setBachelorSelected] = useState(false);
    const [masterSelected, setMasterSelected] = useState(false);

    useEffect(() => {
        if (Array.isArray(data.previous_degree)) {
            setBachelorSelected(data.previous_degree.includes("Bachelor Degree"));
            setMasterSelected(data.previous_degree.includes("Master"));
        }
    }, [data.previous_degree]);

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

    // Local state for university selection and research form visibility
    const [selectedUniversity, setSelectedUniversity] = useState(data.university);
    const filteredFaculties = faculties.filter(
        (faculty) => faculty.university_id === parseInt(selectedUniversity)
    );

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

    // Define skills options for the searchable multiselect
    const skillsOptions = [
        { value: 'programming', label: 'Programming Skills' },
        { value: 'data_analysis', label: 'Data Analysis' },
        { value: 'machine_learning', label: 'Machine Learning' },
        { value: 'statistical_analysis', label: 'Statistical Analysis' },
        { value: 'research_methodology', label: 'Research Methodology' },
        { value: 'project_management', label: 'Project Management' },
        { value: 'experimental_design', label: 'Experimental Design' },
        { value: 'quantitative_analysis', label: 'Quantitative Analysis' },
        { value: 'qualitative_analysis', label: 'Qualitative Analysis' },
        { value: 'technical_writing', label: 'Technical Writing' },
        { value: 'public_speaking', label: 'Public Speaking' },
        { value: 'grant_writing', label: 'Grant Writing' },
        { value: 'software_development', label: 'Software Development' },
        { value: 'data_visualization', label: 'Data Visualization' },
        { value: 'web_development', label: 'Web Development' },
        { value: 'database_management', label: 'Database Management' },
        { value: 'simulation', label: 'Simulation' },
        { value: 'modeling', label: 'Modeling' },
        { value: 'critical_thinking', label: 'Critical Thinking' },
        { value: 'problem_solving', label: 'Problem Solving' },
        { value: 'literature_review', label: 'Literature Review' },
        { value: 'data_mining', label: 'Data Mining' },
        { value: 'cloud_computing', label: 'Cloud Computing' },
        { value: 'statistical_software', label: 'Statistical Software Proficiency' },
        { value: 'survey_design', label: 'Survey Design' },
        { value: 'data_cleaning', label: 'Data Cleaning' },
        { value: 'communication', label: 'Communication Skills' },
        { value: 'interdisciplinary_collaboration', label: 'Interdisciplinary Collaboration' },
        { value: 'innovation', label: 'Innovation' },
        { value: 'academic_writing', label: 'Academic Writing' },
        { value: 'research_ethics', label: 'Research Ethics' },
        { value: 'strategic_planning', label: 'Strategic Planning' },
        { value: 'networking', label: 'Networking' },
    ];

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            // Exclude profile_picture from this submission if handled separately
            if (key !== "profile_picture") {
                if (Array.isArray(data[key])) {
                    formData.append(key, JSON.stringify(data[key]));
                } else {
                    formData.append(key, data[key]);
                }
            }
        });

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
            console.log(`${key}: ${typeof value}`);
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleProfilePictureClick = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profiles');

    return (
        <div className="pb-8">
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
                        <p className="text-gray-500">
                            {data.previous_degree?.includes("Master") ? "Master" : "Bachelor Degree"} in {data.master? data.master: data.bachelor}
                        </p>
                        <p className="text-gray-500">{data.current_position}</p>
                    </div>
                </div>
            </div>

            {/* Background Image Modal */}
            {isBackgroundModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Update Background Image
                        </h2>
                        <form onSubmit={submitBackgroundImage}>
                            <input
                                type="file"
                                accept="image/*"
                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                <div className="max-w-6xl mx-auto flex space-x-8 px-4 sm:px-6">
                    {['profiles', 'projects', 'works', 'teams', 'network', 'activity', 'more'].map((tab) => (
                        <button
                            key={tab}
                            className={`py-4 px-3 font-medium text-sm ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content Section */}
            <div className="w-full px-4 py-8">
                {activeTab === 'profiles' && (
                    <section className={className}>
                        <header>
                            <h2 className="text-lg font-medium text-gray-900">
                                Personal Information
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Update your personal information.
                            </p>
                        </header>
                        <form onSubmit={submit} className="mt-6 space-y-6">
                            {/* Full Name */}
                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 w-full">
                                <div className="w-full">
                                    <InputLabel htmlFor="full_name" value="Full Name" required />
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
                            </div>

                            {/* Bio */}
                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 w-full">
                                <div className="w-full">
                                    <InputLabel htmlFor="bio" value="Short Bio" />
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

                            <h3 className="font-medium text-gray-900">Your Previous Degree</h3>
                            <div className="flex items-center space-x-4">
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
                                            // Update the previous_degree field accordingly
                                            previous_degree: JSON.stringify([
                                            ...(newBachelorSelected ? ["Bachelor Degree"] : []),
                                            ...(masterSelected ? ["Master"] : []),
                                            ]),
                                            // Clear the Bachelor-specific fields if unchecked
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
                                            // Clear the Master-specific fields if unchecked
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
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
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
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
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
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                <div className="w-full">
                                    <InputLabel htmlFor="phone_number" value="Phone Number" required />
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
                                    <NationalityForm title={"Nationality"} value={data.nationality} onChange={(value) => setData('nationality', value)} />
                                </div>
                            </div>

                            {/* English Proficiency & Funding Requirement */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                <div>
                                    <InputLabel htmlFor="english_proficiency_level" value="English Proficiency Level" />
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
                                    <InputLabel htmlFor="funding_requirement" value="Funding Requirement" />
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

                            {/* Current Postgraduate Status and Skills (same row) */}
                            <div className="grid grid-cols-2 gap-6 w-full">
                                <div>
                                    <InputLabel htmlFor="current_postgraduate_status">
                                        Current Postgraduate Status
                                    </InputLabel>
                                    <select
                                        id="current_postgraduate_status"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        value={data.current_postgraduate_status}
                                        onChange={handleStatusChange}
                                    >
                                        <option value="" hidden>
                                            Select your current postgraduate status
                                        </option>
                                        <option value="Not registered yet">Not registered yet</option>
                                        <option value="Registered">Registered</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel htmlFor="skills" value="Skills" />
                                    <Select
                                        id="skills"
                                        isMulti
                                        options={skillsOptions}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        classNamePrefix="select"
                                        value={data.skills?.map((selectedValue) => {
                                            const matchedOption = skillsOptions.find(
                                                (option) => option.value === selectedValue
                                            );
                                            return {
                                                value: selectedValue,
                                                label: matchedOption ? matchedOption.label : selectedValue,
                                            };
                                        })}
                                        onChange={(selectedOptions) => {
                                            const selectedValues = selectedOptions.map((option) => option.value);
                                            setData('skills', selectedValues);
                                        }}
                                        placeholder="Select your skills..."
                                    />
                                </div>
                            </div>

                            {data.current_postgraduate_status === "Registered" && (
                                <div className="grid grid-cols-2 gap-6 w-full">
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

                            {data.current_postgraduate_status === "Registered" && (  
                            <div className="grid grid-cols-2 gap-6 w-full">
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
                            </div>
                            )}

                            {/* Dropdown for suggested research title */}
                            <div className="">
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

                            {showResearchForm && (
                                <div className="">
                                    <div>
                                        <InputLabel htmlFor="suggested_research_title" value="Suggested Research Title" required />
                                        <TextInput
                                            id="suggested_research_title"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            value={data.suggested_research_title}
                                            onChange={(e) => setData('suggested_research_title', e.target.value)}
                                            required
                                            isFocused
                                            autoComplete="suggested_research_title"
                                        />
                                        <InputError className="mt-2" message={errors.suggested_research_title} />
                                    </div>
                                    <div className='mt-4'>
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
                                    Field of Research (Multiple Selection) Structure : Field of Research - Research Area - Niche Domain
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
                                    placeholder="Select field of research..."
                                />
                            </div>

                            <div className="space-y-4">
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
                                            <p className="text-sm text-gray-500">
                                                File Selected: {data.CV_file.name}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

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

                            {/* Buttons: Save and display success message */}
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
        </div>
    );
}
