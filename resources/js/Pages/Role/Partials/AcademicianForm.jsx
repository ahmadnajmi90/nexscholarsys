import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

export default function AcademicianForm({ className = '', researchOptions }) {
    const academician = usePage().props.academician; // Related academician data

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
            website: academician?.website || '',
            linkedin: academician?.linkedin || '',
            google_scholar: academician?.google_scholar || '',
            researchgate: academician?.researchgate || '',
            bio: academician?.bio || '',
            // data specific to academician
            current_position: academician?.current_position || '',
            department: academician?.department || '',
            availability_as_supervisor: academician?.availability_as_supervisor || false,
            background_image: academician?.background_image || '',
        });

    // State for modal and generation
    const [showMethodModal, setShowMethodModal] = useState(false);
    const [genMode, setGenMode] = useState('auto'); // 'auto' or 'url'
    // For URL mode: allow users to optionally add additional URLs.
    const [providedUrls, setProvidedUrls] = useState(['']);
    const [isGenerating, setIsGenerating] = useState(false);

    // Handle URL input changes
    const updateUrl = (index, value) => {
        const urls = [...providedUrls];
        urls[index] = value;
        setProvidedUrls(urls);
    };

    const addUrlField = () => {
        setProvidedUrls([...providedUrls, '']);
    };

    // Function to initiate generation
    const handleGenerateProfile = () => {
        // Close the method selection modal and start generation
        setShowMethodModal(false);
        setIsGenerating(true);
        axios
            .post(route('academician.generateProfile'), {
                mode: genMode,
                urls: genMode === 'url' ? providedUrls : [],
            })
            .then((response) => {
                const generatedData = response.data;
                setData((prevData) => ({
                    ...prevData,
                    full_name: data.full_name,
                    bio: generatedData.bio || prevData.bio,
                    current_position: generatedData.current_position || prevData.current_position,
                    department: generatedData.department || prevData.department,
                    highest_degree: generatedData.highest_degree || prevData.highest_degree,
                    field_of_study: generatedData.field_of_study || prevData.field_of_study,
                    research_expertise: generatedData.research_expertise || prevData.research_expertise,
                    // The 4 URL fields are already provided by users in their profile.
                    website: data.website,
                    linkedin: data.linkedin,
                    google_scholar: data.google_scholar,
                    researchgate: data.researchgate,
                }));
                setIsGenerating(false);
            })
            .catch((error) => {
                console.error("Profile generation failed:", error);
                alert("Profile generation failed, please try again.");
                setIsGenerating(false);
            });
    };

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

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (key !== "profile_picture") {
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

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
            console.log(`${key}: ${typeof value}`);
        }

        post(route("role.update"), {
            data: formData,
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
                        <p className="text-gray-500">
                            {data.highest_degree} in{" "}
                            {data.research_expertise?.map((field) => {
                                const [fieldId, researchId, nicheId] = field.split("-");
                                const matchedOption = researchOptions.find(
                                    (option) =>
                                        option.field_of_research_id === parseInt(fieldId) &&
                                        option.research_area_id === parseInt(researchId) &&
                                        option.niche_domain_id === parseInt(nicheId)
                                );
                                return matchedOption
                                    ? `${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`
                                    : "Unknown Field";
                            })?.join(", ") || "No Field of Study"}
                        </p>
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
                            <p className="text-lg font-medium">Generating profile, please wait...</p>
                            {/* Optionally add a spinner icon here */}
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
                                onClick={handleGenerateProfile}
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
                    <section className={className}>
                          <div className="relative mb-6">
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Personal Information
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Update your personal information.
                                </p>
                            </header>
                            <button 
                                type="button" 
                                onClick={() => setShowMethodModal(true)}
                                className="absolute top-0 right-0 mt-2 mr-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-800"
                            >
                                Generate my profile
                            </button>
                        </div>

                        <form onSubmit={submit} className="mt-6 space-y-6">
                            {/* Full Name and Phone Number */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                <div className="w-full">
                                    <InputLabel htmlFor="full_name" value="Full Name (Without Salutation)" required />
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
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                <div className="w-full">
                                    <InputLabel htmlFor="highest_degree" value="Highest Degree" required />
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
                                    <InputLabel htmlFor="field_of_study" value="Field of Study" required />
                                    <TextInput
                                        id="field_of_study"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        value={data.field_of_study}
                                        onChange={(e) => setData('field_of_study', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.field_of_study} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 w-full">
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

                            {/* Research Expertise Searchable Dropdown */}
                            <div className="w-full">
                                <label htmlFor="research_expertise" className="block text-sm font-medium text-gray-700">
                                    Field of Research (Multiple Selection) Structure : Field of Research - Research Area - Niche Domain
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
                                />
                            </div>

                            {/* Additional Fields for Academician */}
                            {academician && (
                                <>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                        <div className="w-full">
                                            <InputLabel htmlFor="current_position" value="Current Position" required />
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
                                            <InputLabel htmlFor="department" value="Department" required />
                                            <TextInput
                                                id="department"
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                value={data.department}
                                                onChange={(e) => setData('department', e.target.value)}
                                            />
                                            <InputError className="mt-2" message={errors.department} />
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="availability_as_supervisor" value="Availability as Supervisor" required />
                                        <select
                                            id="availability_as_supervisor"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            value={data.availability_as_supervisor}
                                            onChange={(e) => setData('availability_as_supervisor', e.target.value === 'true')}
                                        >
                                            <option value="true">Available</option>
                                            <option value="false">Not Available</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.availability_as_supervisor} />
                                    </div>
                                </>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                <div>
                                    <InputLabel htmlFor="website" value="Website (Personal or Work)" />
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

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
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
        </div>
    );
}
