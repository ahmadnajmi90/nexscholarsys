import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Select from 'react-select';

export default function AcademicianForm({
    className = '',
    researchOptions
}) {
    const academician = usePage().props.academician; // Related academician data

    // const variable =
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            //data both have
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
            // orcid: academician?.orcid || '',
            bio: academician?.bio || '',

            //data only academician have
            current_position: academician?.current_position || '',
            department: academician?.department || '',
            availability_as_supervisor: academician?.availability_as_supervisor || false,
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


    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (key !== "profile_picture") {
                if (key === "research_expertise") {
                    // Transform array into JSON string
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

    const [activeTab, setActiveTab] = useState('profiles');

    return (
        <div className="pb-8">
            <div className="w-full bg-white py-12 shadow-md">
    {/* Profile Image and Info */}
    <div className="flex flex-col items-center relative">
        {/* Profile Image */}
        <div className="relative">
            <img
                src={`/storage/${data.profile_picture || "default-profile.jpg"}`}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-green-500 shadow-lg object-cover"
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
        <div className="text-center mt-4">
            <h1 className="text-2xl font-semibold text-gray-800">{data.full_name}</h1>
            <p className="text-gray-500">{data.highest_degree} in {data.field_of_study}</p>
            <p className="text-gray-500">{data.current_position}</p>
        </div>

        {/* Additional Info */}
        {/* <div className="flex justify-center space-x-4 mt-4 text-gray-500">
            <p>
                <span className="material-icons text-gray-400 align-middle">business</span> {data.company || 'KeenThemes'}
            </p>
            <p>
                <span className="material-icons text-gray-400 align-middle">place</span> {data.location || 'SF, Bay Area'}
            </p>
            <p>
                <span className="material-icons text-gray-400 align-middle">email</span> {data.email || 'jenny@kteam.com'}
            </p>
        </div> */}
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
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
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
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                {/* Full Name */}
                                <div className="w-full">
                                <InputLabel htmlFor="highest_degree" value="Highest Degree" required />
                                <select
                                    id="highest_degree"
                                    className="mt-1 block w-full border rounded-md p-2"
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

                            <div>
                                    <InputLabel htmlFor="field_of_study" value="Field of Study" required />
                                    <TextInput
                                        id="field_of_study"
                                        className="mt-1 block w-full"
                                        value={data.field_of_study}
                                        onChange={(e) => setData('field_of_study', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.field_of_study} />
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

{/* Research Expertise Searchable Dropdown */}
<div className="w-full">
    <label htmlFor="research_expertise" className="block text-sm font-medium text-gray-700">
        Field of Research (Multiple Selection)
    </label>
    <Select
        id="research_expertise"
        isMulti
        options={researchOptions.map((option) => ({
            value: `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}`,
            label: `${option.field_of_research_name} - ${option.research_area_name} - ${option.niche_domain_name}`,
        }))}
        className="mt-1"
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
            setData('research_expertise', selectedValues); // Update with selected values
        }}
        placeholder="Select field of research..."
    />
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

                            {/* Additional Fields for Academician */}
                            {academician && (
                                <>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                {/* Full Name */}
                                <div className="w-full">
                                        <InputLabel htmlFor="current_position" value="Current Position" required />
                                        <select
                                            id="current_position"
                                            className="mt-1 block w-full border rounded-md p-2"
                                            value={data.current_position}
                                            onChange={(e) => setData('current_position', e.target.value)}
                                        >
                                            <option value="">Select Position</option> {/* Placeholder */}
                                            <option value="Lecturer">Lecturer</option>
                                            <option value="Senior Lecturer">Senior Lecturer</option>
                                            <option value="Assoc. Prof.">Associate Professor</option>
                                            <option value="Professor">Professor</option>
                                            <option value="Postdoctoral Researcher">Postdoctoral Researcher</option>
                                            <option value="Researcher">Researcher</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.current_position} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="department" value="Department" required />
                                        <TextInput
                                            id="department"
                                            className="mt-1 block w-full"
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
                                            className="mt-1 block w-full border rounded-md p-2"
                                            value={data.availability_as_supervisor}
                                            onChange={(e) => setData('availability_as_supervisor', e.target.value === 'true')}
                                        >
                                            <option value="true">Available</option>
                                            <option value="false">Not Available</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.availability_as_supervisor} />
                                    </div>

                                    {/* <div>
                                        <InputLabel htmlFor="availability_for_collaboration" value="Availability for Collaboration" required />
                                        <select
                                            id="availability_for_collaboration"
                                            className="mt-1 block w-full border rounded-md p-2"
                                            value={data.availability_for_collaboration}
                                            onChange={(e) => setData('availability_for_collaboration', e.target.value === 'true')}
                                        >
                                            <option value="true">Available</option>
                                            <option value="false">Not Available</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.availability_for_collaboration} />
                                    </div> */}
                                </>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                {/* Website */}
                                <div>
                                    <InputLabel htmlFor="website" value="Website (Personal or Work)" />
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
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
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
                            </div>

                            {/* ORCID */}
                            {/* <div>
                                <InputLabel htmlFor="orcid" value="ORCID" />
                                <TextInput
                                    id="orcid"
                                    className="mt-1 block w-full"
                                    value={data.orcid}
                                    onChange={(e) => setData('orcid', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.orcid} />
                            </div> */}



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
