import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import NationalityForm from "./NationalityForm";

export default function PostgraduateForm({
    universities,
    faculties,
    className = '',
    researchOptions
}) {
    const postgraduate = usePage().props.postgraduate; // Related postgraduate data

    // const variable =
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            //data both have
            phone_number: postgraduate?.phone_number || '',
            full_name: postgraduate?.full_name || '',
            previous_degree: 
            typeof postgraduate?.previous_degree === 'string'
            ? JSON.parse(postgraduate?.previous_degree)
            : postgraduate?.previous_degree,

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
                    : postgraduate?.field_of_research,

            website: postgraduate?.website || '',
            linkedin: postgraduate?.linkedin || '',
            google_scholar: postgraduate?.google_scholar || '',
            researchgate: postgraduate?.researchgate || '',
            bio: postgraduate?.bio || '',

            //data only postgraduate have
            faculty: postgraduate?.faculty || '',
            // supervisorAvailability: postgraduate?.supervisorAvailability || false,
            university: postgraduate?.university || '',
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
            },
            onError: (errors) => {
                console.error("Error updating profile picture:", errors);
                alert("Failed to update the profile picture. Please try again.");
            },
        });
    };

    const handleStatusChange = (e) => {
        const status = e.target.value;
        setData((prevData) => ({
            ...prevData,
            current_postgraduate_status: status,
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


            <div className="w-full h-66 bg-cover bg-center mt-4"
                style={{
                    backgroundImage: `url('https://picsum.photos/seed/${postgraduate?.id}/500/150')`,
                }}>
                {/* Background Image */}
                <div
                ></div>

                {/* Profile Image and Info */}
                <div className="flex flex-col items-center -mt-16 relative">
                    {/* Profile Image */}
                    <div className="relative">
                        <img
                            src={`/storage/${data.profile_picture || "default-profile.jpg"}`}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                        />
                        {/* Pencil Icon */}
                        <button
                            onClick={handleProfilePictureClick}
                            className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-lg text-white hover:bg-blue-600"
                            aria-label="Edit Profile Picture"
                        >
                            ✏️
                        </button>
                    </div>

                    {/* Profile Details */}
                    <div className="text-center mt-8">
                        <h1 className="text-2xl font-semibold text-gray-800 uppercase">{data.full_name}</h1>
                        <p className="text-gray-500">{data.highest_degree}</p>
                        <p className="text-gray-500">{data.current_position}</p>
                    </div>
                </div>
            </div>

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
                                        className="mt-1 block w-full"
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
                                        className="mt-1 block w-full"
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        rows={4}
                                    />
                                    <InputError className="mt-2" message={errors.bio} />
                                </div>
                            </div>

                            <h3 className="font-medium text-gray-900">Your Previous Degree</h3>
                            <div className="flex items-center space-x-4">
                                {/* Bachelor Degree Checkbox */}
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
                                            }));
                                        }}
                                    />
                                    <span>Bachelor Degree</span>
                                </label>

                                {/* Master Degree Checkbox */}
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
                                            }));
                                        }}
                                    />
                                    <span>Master</span>
                                </label>
                            </div>

                            {/* Bachelor Degree Form */}
                            {bachelorSelected && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                    <div>
                                        <InputLabel htmlFor="bachelor" value="Bachelor Degree In" />
                                        <TextInput
                                            id="bachelor"
                                            className="mt-1 block w-full"
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
                                            className="mt-1 block w-full"
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

                            {/* Master Degree Form */}
                            {masterSelected && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                    <div>
                                        <InputLabel htmlFor="master" value="Master Degree In" />
                                        <TextInput
                                            id="master"
                                            className="mt-1 block w-full"
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
                                            className="mt-1 block w-full border rounded-md p-2"
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


                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                {/* Phone Number */}
                                <div className="w-full">
                                    <InputLabel htmlFor="phone_number" value="Phone Number" required />
                                    <TextInput
                                        id="phone_number"
                                        className="mt-1 block w-full"
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
                                <div>
                                    <InputLabel htmlFor="english_proficiency_level" value="English Proficiency Level" />
                                    <select
                                        id="english_proficiency_level"
                                        className="mt-1 block w-full border rounded-md p-2"
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
                                        className="mt-1 block w-full border rounded-md p-2"
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

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                 {/* Current Postgraduate Status */}
                                <div className="">
                                    <label
                                        htmlFor="current_postgraduate_status"
                                        className="mt-1 block text-sm font-medium text-gray-700"
                                    >
                                        Current Postgraduate Status
                                    </label>
                                    <select
                                        id="current_postgraduate_status"
                                        className="block w-full border-gray-300 rounded-md shadow-sm"
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

                                {data.current_postgraduate_status === "Registered" && (
                                <div>
                                    <InputLabel htmlFor="university" value="University" required />
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
                                    <InputError className="mt-2" message={errors.university} />
                                </div>
                                )}
                            </div>
                            
                            {data.current_postgraduate_status === "Registered" && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                    {selectedUniversity && (
                                        <div>
                                            <InputLabel htmlFor="faculty" value="Faculty" required />
                                            <select
                                                id="faculty"
                                                className="mt-1 block w-full border rounded-md p-2"
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
                                            className="mt-1 block w-full"
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

                             {/* Dropdown to select yes/no */}
                            <div className="">
                                <label
                                    htmlFor="has_suggested_research_title"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Have own suggested research title?
                                </label>
                                <select
                                    id="has_suggested_research_title"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    value={showResearchForm ? "yes" : "no"} // Automatically set value based on conditions
                                    onChange={handleResearchTitleChange}
                                >
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>

                            {/* Form for suggested research title and description (visible only if "Yes" is selected) */}
                            {showResearchForm && (
                                <div className="">
                                    <div>
                                        <InputLabel htmlFor="suggested_research_title" value="Suggested Research Title" required />
                                        <TextInput
                                            id="suggested_research_title"
                                            className="mt-1 block w-full"
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
                                            className="mt-1 block w-full"
                                            value={data.suggested_research_description}
                                            onChange={(e) => setData('suggested_research_description', e.target.value)}
                                            rows={4}
                                        />
                                        <InputError className="mt-2" message={errors.suggested_research_description} />
                                    </div>
                                </div>
                            )}

                            {/* Research Expertise Dropdown */}
                            <div className="w-full">
                                <label htmlFor="field_of_research" className="block text-sm font-medium text-gray-700">
                                Preferred Field of research (Multiple Selection)
                                </label>
                                <select
                                    id="field_of_research"
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={data.field_of_research || []} // Handle multiple selections
                                    onChange={(e) => {
                                        const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
                                        setData('field_of_research', selectedOptions); // Update with selected options
                                    }}
                                    multiple
                                >
                                    {researchOptions.map((option) => (
                                        <option
                                            key={`${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}`}
                                            value={`${option.field_of_research_name}-${option.research_area_name}-${option.niche_domain_name}`}
                                        >
                                            {`${option.field_of_research_name} - ${option.research_area_name} - ${option.niche_domain_name}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
                            className="block w-full border-gray-300 rounded-md shadow-sm"
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
                                    className="mt-1 block w-full"
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
                                    className="mt-1 block w-full"
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
                                    className="mt-1 block w-full"
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
                                    className="mt-1 block w-full"
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
