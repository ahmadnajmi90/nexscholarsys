import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import NationalityForm from "./NationalityForm";
import Select from 'react-select';

export default function UndergraduateForm({
    universities,
    faculties,
    className = '',
    researchOptions
}) {
    const undergraduate = usePage().props.undergraduate; // Related postgraduate data
    
    console.log(undergraduate);

    // const variable =
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            //data both have
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
            skill: undergraduate?.skill || '',
            interested_do_research: undergraduate?.interested_do_research || false,
            expected_graduate: undergraduate?.expected_graduate || '',
            research_preference:
                typeof undergraduate?.research_preference === 'string'
                    ? JSON.parse(undergraduate?.research_preference)
                    : undergraduate?.research_preference,
            CV_file: undergraduate?.CV_file || '',
            profile_picture: undergraduate?.profile_picture || '',
            background_image: undergraduate?.background_image || '',
            website: undergraduate?.website || '',
            linkedin: undergraduate?.linkedin || '',
            google_scholar: undergraduate?.google_scholar || '',
            researchgate: undergraduate?.researchgate || '',

            //data only postgraduate have
            // grantAvailability: postgraduate?.grantAvailability || false,
        });

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
                // Refresh the page after alert
                window.location.reload();
            },
            onError: (errors) => {
                console.error("Error updating profile picture:", errors);
                alert("Failed to update the profile picture. Please try again.");
            },
        });
    };

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
                // Refresh the page after alert
                window.location.reload();
            },
            onError: (errors) => {
                console.error("Error updating background image:", errors);
                alert("Failed to update the background image. Please try again.");
            },
        });
    };    

    const handleStatusChange = (e) => {
        const status = e.target.value;
        setData((prevData) => ({
            ...prevData,
            current_undergraduate_status: status,
            matric_no: status === "Registered" ? prevData.matric_no : "", // Clear matric_no if "Not registered yet"
            university: status === "Registered" ? prevData.university : "", // Clear university if "Not registered yet"
            faculty: status === "Registered" ? prevData.faculty : "", // Clear faculty if "Not registered yet"
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            // Exclude profile_picture from this form submission
            if (key !== "profile_picture") {
                if (Array.isArray(data[key])) {
                    formData.append(key, JSON.stringify(data[key])); // Convert arrays to JSON strings
                }else if (key === "interested_do_research") {
                    formData.append(key, data[key] === true ? 1 : 0);
                } else {
                    formData.append(key, data[key]); // Add other fields
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

    const [selectedUniversity, setSelectedUniversity] = useState(data.university);
    const filteredFaculties = faculties.filter(
        (faculty) => faculty.university_id === parseInt(selectedUniversity)
    );

    const [bachelorSelected, setBachelorSelected] = useState(false);
    const [masterSelected, setMasterSelected] = useState(false);


    const [showResearchForm, setShowResearchForm] = useState(false); // New state variable to control form appearance

    // Automatically set the dropdown to "Yes" if suggested_research_title and suggested_research_description are not null
    useEffect(() => {
        if (data.suggested_research_title || data.suggested_research_description) {
            setShowResearchForm(true);
        }
    }, [data.suggested_research_title, data.suggested_research_description]);

    // Event handler for dropdown
    const handleResearchTitleChange = (e) => {
        if (e.target.value === "yes") {
            setShowResearchForm(true);
        } else {
            setShowResearchForm(false);
        }
        const isYes = e.target.value === "yes";
        if (!isYes) {
            // Clear the data if "No" is selected
            setData((prevData) => ({
                ...prevData,
                suggested_research_title: "",
                suggested_research_description: "",
            }));
        }
    };

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


            {/* Modal */}
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
                    {['Profiles', 'Projects', 'Works', 'Teams', 'Network', 'Activity', 'More'].map((tab) => (
                        <button
                            key={tab}
                            className={`py-4 px-3 font-medium text-sm ${activeTab.toLowerCase() === tab.toLowerCase()
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                        >
                            {tab}
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
                            {/* Full Name and Phone Number */}
                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 w-full">
                                {/* Full Name */}
                                <div className="w-full">
                                    <InputLabel htmlFor="full_name" value="Full Name" required />
                                    <TextInput
                                        id="full_name"
                                        className="mt-1 block w-full p-4"
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
                                {/* Full Name */}
                                <div className="w-full">
                                    <InputLabel htmlFor="bio" value="Short Bio" />
                                    <textarea
                                        id="bio"
                                        className="mt-1 block w-full p-4"
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        rows={4}
                                    />
                                    <InputError className="mt-2" message={errors.bio} />
                                </div>
                            </div>

                            {/* Bachelor Degree Form */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                <div>
                                    <InputLabel htmlFor="bachelor" value="Name of Bachelor Degree" />
                                    <TextInput
                                        id="bachelor"
                                        className="mt-1 block w-full p-4"
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

                                {/* CGPA Bachelor */}
                                <div>
                                    <InputLabel htmlFor="CGPA_bachelor" value="CGPA Bachelor" />
                                    <TextInput
                                        id="CGPA_bachelor"
                                        className="mt-1 block w-full p-4"
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


                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                {/* Phone Number */}
                                <div className="w-full">
                                    <InputLabel htmlFor="phone_number" value="Phone Number" required />
                                    <TextInput
                                        id="phone_number"
                                        className="mt-1 block w-full p-4"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        autoComplete="tel"
                                    />
                                    <InputError className="mt-2" message={errors.phone_number} />
                                </div>

                                <div>
                                     {/* Nationality Form */}
                                     <NationalityForm title={"Nationality"} value={data.nationality} onChange={(value) => setData('nationality', value)} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                 {/* Current Undergraduate Status */}
                                <div className="">
                                    <label
                                        htmlFor="current_undergraduate_status"
                                        className="mt-1 block text-sm font-medium text-gray-700"
                                    >
                                        Current Undergraduate Status
                                    </label>
                                    <select
                                        id="current_undergraduate_status"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-4"
                                        value={data.current_undergraduate_status}
                                        onChange={handleStatusChange}
                                    >
                                        <option value="" hidden>
                                            Select your current undergraduate status
                                        </option>
                                        <option value="Not registered yet">Not registered yet</option>
                                        <option value="Registered">Registered</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                <div>
                                    <InputLabel htmlFor="english_proficiency_level" value="English Proficiency Level" />
                                    <select
                                        id="english_proficiency_level"
                                        className="mt-1 block w-full border rounded-md p-4"
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

                                {data.current_undergraduate_status === "Registered" && (
                                    <div>
                                        <InputLabel htmlFor="university" value="University" required />
                                        <select
                                            id="university"
                                            className="mt-1 block w-full border rounded-md p-2 p-4"
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
                                        <InputError className="mt-2" message={errors.university} />
                                    </div>
                                )}
                            </div>

                            {data.current_undergraduate_status === "Registered" && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                    {selectedUniversity && (
                                        <div>
                                            <InputLabel htmlFor="faculty" value="Faculty" required />
                                            <select
                                                id="faculty"
                                                className="mt-1 block w-full border rounded-md p-4"
                                                value={data.faculty || ''}
                                                onChange={(e) => setData('faculty', e.target.value)}
                                            >
                                                <option value="" hidden>Select your Faculty</option>
                                                {filteredFaculties.map((faculty) => (
                                                    <option key={faculty.id} value={faculty.id}>
                                                        {faculty.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError className="mt-2" message={errors.faculty} />
                                        </div>
                                    )}

                                    <div className="w-full">
                                        <InputLabel htmlFor="matric_no" value="Matric No." required />
                                        <TextInput
                                            id="matric_no"
                                            className="mt-1 block w-full p-4"
                                            value={data.matric_no}
                                            onChange={(e) => setData('matric_no', e.target.value)}
                                            required
                                            isFocused
                                            autoComplete="matric_no"
                                        />
                                        <InputError className="mt-2" message={errors.matric_no} />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 w-full">
                                {/* Skill */}
                                <div className="w-full">
                                    <InputLabel htmlFor="skill" value="Skills" />
                                    <textarea
                                        id="skill"
                                        className="mt-1 block w-full p-4"
                                        value={data.skill}
                                        onChange={(e) => setData('skill', e.target.value)}
                                        rows={4}
                                    />
                                    <InputError className="mt-2" message={errors.skill} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                <div className="">
                                    <label
                                        htmlFor="interested_do_research"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Are you interested to do research after bachelor degree?
                                    </label>
                                    <select
                                        id="interested_do_research"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-4"
                                        value={data.interested_do_research} // Automatically set value based on conditions
                                        onChange={(e) => setData('interested_do_research', e.target.value)}
                                    >
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select>
                                </div>

                                <div className="w-full">
                                    <InputLabel htmlFor="expected_graduate" value="Expected Graduate (Month/Year)" required />
                                    <TextInput
                                        id="expected_graduate"
                                        className="mt-1 block w-full p-4"
                                        value={data.expected_graduate}
                                        onChange={(e) => setData('expected_graduate', e.target.value)}
                                        required
                                        isFocused
                                        autoComplete="expected_graduate"
                                    />
                                    <InputError className="mt-2" message={errors.expected_graduate} />
                                </div>
                            </div>

                            {data.interested_do_research === "true" && (
                                <div className="w-full">
                                    <label htmlFor="research_preference" className="block text-sm font-medium text-gray-700">
                                        Preferred Field of research (Multiple Selection) Structure : Field of Research - Research Area - Niche Domain
                                    </label>
                                    <Select
                                        id="research_preference"
                                        isMulti
                                        options={researchOptions.map((option) => ({
                                            value: `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}`,
                                            label: `${option.field_of_research_name} - ${option.research_area_name} - ${option.niche_domain_name}`,
                                        }))}
                                        className="mt-1"
                                        classNamePrefix="select"
                                        value={data.research_preference?.map((selectedValue) => {
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
                                            setData('research_preference', selectedValues); // Update with selected values
                                        }}
                                        placeholder="Select Preferred Field of research..."
                                    />
                                </div>
                            )}
                            
                            {/* Profile Picture */}
                            {/* <div>
                       <InputLabel htmlFor="profile_picture" value="Profile Picture" /> */}

                            {/* Display the current profile picture */}
                            {/* {data.profile_picture && typeof data.profile_picture === "string" && (
                           <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg my-2">
                               <img
                                   src={`/storage/${data.profile_picture}`}
                                   alt="Current Profile Picture"
                                   className="w-full h-full object-cover"
                               />
                               <p className="text-gray-600">Current Picture</p>
                           </div>
                       )} */}

                            {/* File input for uploading a new picture */}
                            {/* <input
                           type="file"
                           id="profile_picture"
                           name="profile_picture"
                           className="mt-1 block w-full"
                           onChange={(e) => {
                               if (e.target.files[0]) {
                                   setData('profile_picture', e.target.files[0]); // Set new file
                               } else {
                                   setData('profile_picture', academician?.profile_picture || postgraduate?.profile_picture); // Keep existing path
                               }
                           }}
                       />
                       <InputError message={errors.profile_picture} />
                   </div> */}

                    <div className="space-y-4">
                        <label htmlFor="CV_file" className="block text-sm font-medium text-gray-700">
                            Upload CV (Max 5MB)
                        </label>
                        <input
                            type="file"
                            id="CV_file"
                            name="CV_file"
                            className="block w-full border-gray-300 "
                            accept=".pdf,.doc,.docx" // Restrict file types
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    // Ensure file size is within 5MB
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
                                    // If it's a stored file, render as a link
                                    <a
                                        href={`/storage/${data.CV_file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-500 hover:underline"
                                    >
                                        View Current File: {data.CV_file.split('/').pop()}
                                    </a>
                                ) : (
                                    // If it's a newly selected file
                                    <p className="text-sm text-gray-500">
                                        File Selected: {data.CV_file.name}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>


                            {/* Website */}
                            <div>
                                <InputLabel htmlFor="website" value="Website" />
                                <TextInput
                                    id="website"
                                    className="mt-1 block w-full p-4"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    autoComplete="url"
                                />
                                <InputError className="mt-2" message={errors.website} />
                            </div>

                            {/* LinkedIn */}
                            <div>
                                <InputLabel htmlFor="linkedin" value="LinkedIn" />
                                <TextInput
                                    id="linkedin"
                                    className="mt-1 block w-full p-4"
                                    value={data.linkedin}
                                    onChange={(e) => setData('linkedin', e.target.value)}
                                    autoComplete="url"
                                />
                                <InputError className="mt-2" message={errors.linkedin} />
                            </div>

                            {/* Google Scholar */}
                            <div>
                                <InputLabel htmlFor="google_scholar" value="Google Scholar" />
                                <TextInput
                                    id="google_scholar"
                                    className="mt-1 block w-full p-4"
                                    value={data.google_scholar}
                                    onChange={(e) => setData('google_scholar', e.target.value)}
                                    autoComplete="url"
                                />
                                <InputError className="mt-2" message={errors.google_scholar} />
                            </div>

                            {/* ResearchGate */}
                            <div>
                                <InputLabel htmlFor="researchgate" value="ResearchGate" />
                                <TextInput
                                    id="researchgate"
                                    className="mt-1 block w-full p-4"
                                    value={data.researchgate}
                                    onChange={(e) => setData('researchgate', e.target.value)}
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
                )}
                {activeTab === 'projects' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    </div>
                )}
            </div>


        </div>
    );
}
