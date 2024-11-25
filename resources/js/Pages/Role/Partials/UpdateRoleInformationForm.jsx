import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function UpdateProfileInformation({
    isPostgraduate,
    isAcademician,
    universities,
    faculties,
    className = '',
}) {
    const academician = usePage().props.academician; // Related academician data
    const postgraduate = usePage().props.postgraduate; // Related postgraduate data

    // const variable =
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            //data both have 
            phone_number: academician?.phone_number || postgraduate?.phone_number || '',
            full_name: academician?.full_name || postgraduate?.full_name || '',
            profile_picture: academician?.profile_picture || postgraduate?.profile_picture || '',
            field_of_study:
            typeof academician?.field_of_study === 'string'
                ? JSON.parse(academician?.field_of_study)
                : academician?.field_of_study || 
                (typeof postgraduate?.field_of_study === 'string'
                    ? JSON.parse(postgraduate?.field_of_study)
                    : postgraduate?.field_of_study || []),

            highest_degree: academician?.highest_degree || postgraduate?.highest_degree || '',
            
            research_interests:
            typeof academician?.research_interests === 'string'
                ? JSON.parse(academician?.research_interests)
                : academician?.research_interests || 
                (typeof postgraduate?.research_interests === 'string'
                    ? JSON.parse(postgraduate?.research_interests)
                    : postgraduate?.research_interests || []),

            ongoing_research:
            typeof academician?.ongoing_research === 'string'
                ? JSON.parse(academician?.ongoing_research)
                : academician?.ongoing_research || 
                (typeof postgraduate?.ongoing_research === 'string'
                    ? JSON.parse(postgraduate?.ongoing_research)
                    : postgraduate?.ongoing_research || []),

            website: academician?.website || postgraduate?.website || '',
            linkedin: academician?.linkedin || postgraduate?.linkedin || '',
            google_scholar: academician?.google_scholar || postgraduate?.google_scholar || '',
            researchgate: academician?.researchgate || postgraduate?.researchgate || '',
            orcid: academician?.orcid || postgraduate?.orcid || '',
            bio: academician?.bio || postgraduate?.bio || '',

            //data only academician have
            current_position: academician?.current_position || '',
            department: academician?.department || '',
            availability_as_supervisor: academician?.availability_as_supervisor || false,
            availability_for_collaboration: academician?.availability_for_collaboration || false,


            //data only postgraduate have
            faculty: postgraduate?.faculty || '',
            supervisorAvailability: postgraduate?.supervisorAvailability || false,
            university: postgraduate?.university || '',
            grantAvailability: postgraduate?.grantAvailability || false,
        });
        const submit = (e) => {
            e.preventDefault();
        
            const formData = new FormData();
        
            // Add all form fields to FormData
            Object.keys(data).forEach((key) => {
                if (key === 'profile_picture') {
                    if (data.profile_picture instanceof File) {
                        formData.append('profile_picture', data.profile_picture); // Append file if new one is uploaded
                    } else if (typeof data.profile_picture === 'string') {
                        formData.append('profile_picture', data.profile_picture); // Append existing path if no new file is uploaded
                    }
                } else if (Array.isArray(data[key])) {
                    formData.append(key, JSON.stringify(data[key])); // Convert arrays to JSON strings
                } else {
                    formData.append(key, data[key]); // Add other fields
                }
            });
            console.log(formData);
            
            patch(route('role.update'), {
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                onError: (errors) => {
                    console.error('Error updating profile:', errors);
                    alert("Failed to update the profile. Please try again.");
                },
            });
        };

        const [selectedUniversity, setSelectedUniversity] = useState(data.university);
        const filteredFaculties = faculties.filter(
            (faculty) => faculty.university_id === parseInt(selectedUniversity)
        );

        return (
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
                <div>
                    <InputLabel htmlFor="full_name" value="Full Name" required/>
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
                <div>
                    <InputLabel htmlFor="phone_number" value="Phone Number" required/>
                    <TextInput
                        id="phone_number"
                        className="mt-1 block w-full"
                        value={data.phone_number}
                        onChange={(e) => setData('phone_number', e.target.value)}
                        autoComplete="tel"
                    />
                    <InputError className="mt-2" message={errors.phone_number} />
                </div>

                {/* Profile Picture */}
                <div>
                    <InputLabel htmlFor="profile_picture" value="Profile Picture" />
                    
                    {/* Display the current profile picture */}
                    {data.profile_picture && typeof data.profile_picture === "string" && (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg my-2">
                            <img
                                src={`/storage/${data.profile_picture}`}
                                alt="Current Profile Picture"
                                className="w-full h-full object-cover"
                            />
                            <p className="text-gray-600">Current Picture</p>
                        </div>
                    )}

                    {/* File input for uploading a new picture */}
                    <input
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
                </div>
 

                {/* Highest Degree */}
                <div>
                    <InputLabel htmlFor="highest_degree" value="Highest Degree" required/>
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


                {/* Field of Study */}
                <div>
                    <InputLabel htmlFor="field_of_study" value="Field of Study" />
                    <select
                        id="field_of_study"
                        className="mt-1 block w-full border rounded-md p-2"
                        value={data.field_of_study}
                        onChange={(e) =>
                            setData('field_of_study', Array.from(e.target.selectedOptions, (option) => option.value))
                        }
                        multiple
                    >
                        {/* Example Field of Study Options */}
                        <option value="Generative AI">Artificial Intelligence (Generative AI)</option>
                        <option value="Quantum Computing">Quantum Computing</option>
                        <option value="Clean Energy Technologies">Clean Energy Technologies</option>
                        <option value="Synthetic Biology">Synthetic Biology</option>
                        <option value="Climate Change Mitigation">Climate Change Mitigation</option>
                        <option value="Advanced Robotics">Advanced Robotics</option>
                        <option value="Natural Language Processing">Natural Language Processing</option>
                        <option value="Autonomous Vehicles">Autonomous Vehicles</option>
                        <option value="Space Exploration Technologies">Space Exploration Technologies</option>
                    </select>
                    <InputError className="mt-2" message={errors.field_of_study} />
                </div>

                {/* Research Interests */}
                <div>
                    <InputLabel htmlFor="research_interests" value="Research Interests" />
                    <select
                        id="research_interests"
                        className="mt-1 block w-full border rounded-md p-2"
                        value={data.research_interests}
                        onChange={(e) =>
                            setData('research_interests', Array.from(e.target.selectedOptions, (option) => option.value))
                        }
                        multiple
                    >
                        {/* Example Research Interests Options */}
                        <option value="Generative AI">Artificial Intelligence (Generative AI)</option>
                        <option value="Quantum Computing">Quantum Computing</option>
                        <option value="Clean Energy Technologies">Clean Energy Technologies</option>
                        <option value="Synthetic Biology">Synthetic Biology</option>
                        <option value="Climate Change Mitigation">Climate Change Mitigation</option>
                        <option value="Advanced Robotics">Advanced Robotics</option>
                        <option value="Natural Language Processing">Natural Language Processing</option>
                        <option value="Autonomous Vehicles">Autonomous Vehicles</option>
                        <option value="Space Exploration Technologies">Space Exploration Technologies</option>
                    </select>
                    <InputError className="mt-2" message={errors.research_interests} />
                </div>

                {/* Ongoing Research */}
                <div>
                    <InputLabel htmlFor="ongoing_research" value="Ongoing Research" />
                    <select
                        id="ongoing_research"
                        className="mt-1 block w-full border rounded-md p-2"
                        value={data.ongoing_research}
                        onChange={(e) =>
                            setData('ongoing_research', Array.from(e.target.selectedOptions, (option) => option.value))
                        }
                        multiple
                    >
                        {/* Example Ongoing Research Options */}
                        <option value="Generative AI">Artificial Intelligence (Generative AI)</option>
                        <option value="Quantum Computing">Quantum Computing</option>
                        <option value="Clean Energy Technologies">Clean Energy Technologies</option>
                        <option value="Synthetic Biology">Synthetic Biology</option>
                        <option value="Climate Change Mitigation">Climate Change Mitigation</option>
                        <option value="Advanced Robotics">Advanced Robotics</option>
                        <option value="Natural Language Processing">Natural Language Processing</option>
                        <option value="Autonomous Vehicles">Autonomous Vehicles</option>
                        <option value="Space Exploration Technologies">Space Exploration Technologies</option>
                    </select>
                    <InputError className="mt-2" message={errors.ongoing_research} />
                </div>

                {/* Additional Fields for Academician */}
                {academician && (
                    <>
                        <div>
                            <InputLabel htmlFor="current_position" value="Current Position" required/>
                            <TextInput
                                id="current_position"
                                className="mt-1 block w-full"
                                value={data.current_position}
                                onChange={(e) => setData('current_position', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.current_position} />
                        </div>

                        <div>
                            <InputLabel htmlFor="department" value="Department" required/>
                            <TextInput
                                id="department"
                                className="mt-1 block w-full"
                                value={data.department}
                                onChange={(e) => setData('department', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.department} />
                        </div>

                        <div>
                            <InputLabel htmlFor="availability_as_supervisor" value="Availability as Supervisor" required/>
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

                        <div>
                            <InputLabel htmlFor="availability_for_collaboration" value="Availability for Collaboration" required/>
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
                        </div>
                    </>
                )}

                {/* Additional Fields for Postgraduate */}
                {postgraduate && (
                    <>
                        {/* University */}
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

                        {/* Faculty */}
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

                        <div>
                            <InputLabel htmlFor="supervisorAvailability" value="Supervisor Availability" required/>
                            <select
                                id="supervisorAvailability"
                                className="mt-1 block w-full border rounded-md p-2"
                                value={data.supervisorAvailability}
                                onChange={(e) => setData('supervisorAvailability', e.target.value === 'true')}
                            >
                                <option value="true">Available</option>
                                <option value="false">Not Available</option>
                            </select>
                            <InputError className="mt-2" message={errors.supervisorAvailability} />
                        </div>
                        
                        <div>
                            <InputLabel htmlFor="grantAvailability" value="Grant Availability" required/>
                            <select
                                id="grantAvailability"
                                className="mt-1 block w-full border rounded-md p-2"
                                value={data.grantAvailability}
                                onChange={(e) => setData('grantAvailability', e.target.value === 'true')}
                            >
                                <option value="true">Available</option>
                                <option value="false">Not Available</option>
                            </select>
                            <InputError className="mt-2" message={errors.grantAvailability} />
                        </div>
                    </>
                )}

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

                {/* ORCID */}
                <div>
                    <InputLabel htmlFor="orcid" value="ORCID" />
                    <TextInput
                        id="orcid"
                        className="mt-1 block w-full"
                        value={data.orcid}
                        onChange={(e) => setData('orcid', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.orcid} />
                </div>

                {/* Bio */}
                <div>
                    <InputLabel htmlFor="bio" value="Bio" />
                    <textarea
                        id="bio"
                        className="mt-1 block w-full"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        rows={4}
                    />
                    <InputError className="mt-2" message={errors.bio} />
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
    );
}
