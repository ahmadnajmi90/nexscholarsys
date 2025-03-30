import React from 'react';
import { Link } from '@inertiajs/react';
import { FaEnvelope, FaGoogle, FaGlobe, FaLinkedin, FaResearchgate, FaDownload, FaArrowLeft } from 'react-icons/fa';

const ProfileContent = ({ 
    profile, 
    university, 
    faculty, 
    user,
    researchOptions,
    skillsOptions,
    type // 'academician', 'postgraduate', or 'undergraduate',
}) => {
    const getResearchText = () => {
        if (type === 'academician' && Array.isArray(profile.research_expertise) && profile.research_expertise.length > 0) {
            return profile.research_expertise.map((id, index) => {
                const matchedOption = researchOptions.find(
                    (option) =>
                        `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === id
                );
                return matchedOption
                    ? `${index + 1}. ${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`
                    : `${index + 1}. Unknown`;
            });
        } else if ((type === 'postgraduate') && 
                   Array.isArray(profile.research_preference) && 
                   profile.research_preference.length > 0) {
            return profile.research_preference.map((id, index) => {
                const matchedOption = researchOptions.find(
                    (option) =>
                        `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === id
                );
                return matchedOption
                    ? `${index + 1}. ${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`
                    : `${index + 1}. Unknown`;
            });
        }
        return null;
    };

    const renderAcademicianInfo = () => (
        <>
            {profile.department && (
                <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Department & Supervision</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Department</h3>
                            <p className="mt-1">{profile.department}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Availability as Supervisor</h3>
                            <p className="mt-1">{profile.availability_as_supervisor === 1 ? "Available" : "Not Available"}</p>
                        </div>
                        {profile.availability_as_supervisor === 1 && profile.supervision_areas && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Supervision Areas</h3>
                                <p className="mt-1">{profile.supervision_areas}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );

    const renderPostgraduateInfo = () => {
        const previousDegree = profile.previous_degree ? JSON.parse(profile.previous_degree) : null;
        
        return (
            <>
                {/* Academic Background Section */}
                <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Academic Background</h2>
                    
                    {/* Current Status */}
                    {profile.current_postgraduate_status && (
                        <div className="mb-6 border rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Current Postgraduate Status</h3>
                            <p className="text-gray-700">{profile.current_postgraduate_status}</p>
                        </div>
                    )}
                    
                    {/* English Proficiency */}
                    {profile.english_proficiency_level && (
                        <div className="mb-6 border rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">English Proficiency</h3>
                            <p className="text-gray-700">{profile.english_proficiency_level}</p>
                        </div>
                    )}

                    {/* Education History */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Bachelor's Degree Information */}
                        {profile.bachelor && (
                            <div className="border rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Bachelor's Degree</h3>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">University</h4>
                                        <p className="mt-1">{profile.bachelor}</p>
                                    </div>
                                    {profile.CGPA_bachelor && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">CGPA</h4>
                                            <p className="mt-1">{profile.CGPA_bachelor}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Master's Degree Information */}
                        {profile.master && (
                            <div className="border rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Master's Degree</h3>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">University</h4>
                                        <p className="mt-1">{profile.master}</p>
                                    </div>
                                    {profile.master_type && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Type</h4>
                                            <p className="mt-1">{profile.master_type}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Field of Research - if not already shown in Research Information section */}
                    {profile.field_of_research && Array.isArray(profile.field_of_research) && profile.field_of_research.length > 0 && (
                        <div className="border rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Field of Research</h3>
                            <div className="space-y-2">
                                {profile.field_of_research.map((id, index) => {
                                    const matchedOption = researchOptions.find(
                                        (option) =>
                                            `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === id
                                    );
                                    return (
                                        <p key={index} className="text-gray-700">
                                            {index + 1}. {matchedOption 
                                                ? `${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`
                                                : id}
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {profile.skills && Array.isArray(profile.skills) && profile.skills.length > 0 && (
                        <div className="border rounded-lg p-4 mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((skillId, index) => {
                                    const matchedSkill = skillsOptions.find(
                                        (option) => option.id === skillId
                                    );
                                    return matchedSkill ? (
                                        <span 
                                            key={index} 
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                                        >
                                            {matchedSkill.name}
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Research Proposal & Funding Section */}
                <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Research Proposal & Funding</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Research Proposal */}
                        {(profile.suggested_research_title || profile.suggested_research_description) && (
                            <div className="border rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Research Proposal</h3>
                                {profile.suggested_research_title && (
                                    <div className="mb-3">
                                        <h4 className="text-sm font-medium text-gray-500">Suggested Title</h4>
                                        <p className="mt-1 font-medium">{profile.suggested_research_title}</p>
                                    </div>
                                )}
                                {profile.suggested_research_description && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Description</h4>
                                        <p className="mt-1">{profile.suggested_research_description}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Funding & Supervision */}
                        <div className="border rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Funding & Supervision</h3>
                            <div className="space-y-3">
                                {profile.funding_requirement && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Funding Requirement</h4>
                                        <p className="mt-1">{profile.funding_requirement}</p>
                                    </div>
                                )}
                                {profile.supervisorAvailability && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Supervisor Status</h4>
                                        <p className="mt-1">{profile.supervisorAvailability}</p>
                                    </div>
                                )}
                                {profile.grantAvailability && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Grant Availability</h4>
                                        <p className="mt-1">{profile.grantAvailability}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* CV Download */}
                    {profile.CV_file && (
                        <div className="mt-4 flex justify-center">
                            <a 
                                href={`/storage/${profile.CV_file}`}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaDownload className="mr-2" />
                                View CV
                            </a>
                        </div>
                    )}
                </div>
            </>
        );
    };

    const renderUndergraduateInfo = () => {
        return (
            <>

                {/* Academic Background */}
                <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Academic Background</h2>
                    
                    {/* Current Status & Expected Graduation */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {profile.current_undergraduate_status && (
                            <div className="border rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Current Undergraduate Status</h3>
                                <p className="text-gray-700">{profile.current_undergraduate_status}</p>
                            </div>
                        )}
                        {profile.expected_graduate && (
                            <div className="border rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Expected Graduation</h3>
                                <p className="text-gray-700">{profile.expected_graduate}</p>
                            </div>
                        )}
                    </div>

                    {/* Bachelor's Degree Information */}
                    <div className="border rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Bachelor's Degree</h3>
                        <div className="space-y-3">
                            {profile.bachelor && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Major</h4>
                                    <p className="mt-1">{profile.bachelor}</p>
                                </div>
                            )}
                            {profile.CGPA_bachelor && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">CGPA</h4>
                                    <p className="mt-1">{profile.CGPA_bachelor}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* English Proficiency */}
                    {profile.english_proficiency_level && (
                        <div className="border rounded-lg p-4 mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">English Proficiency</h3>
                            <p className="text-gray-700">{profile.english_proficiency_level}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {profile.skills && Array.isArray(profile.skills) && profile.skills.length > 0 && (
                        <div className="border rounded-lg p-4 mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((skillId, index) => {
                                    const matchedSkill = skillsOptions.find(
                                        (option) => option.id === skillId
                                    );
                                    return matchedSkill ? (
                                        <span 
                                            key={index} 
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                                        >
                                            {matchedSkill.name}
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}

                    {/* CV File */}
                    {profile.CV_file && (
                        <div className="mt-4 flex justify-center">
                            <a 
                                href={`/storage/${profile.CV_file}`}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaDownload className="mr-2" />
                                View CV
                            </a>
                        </div>
                    )}
                </div>

                {/* Research Interest */}
                {profile.interested_do_research && (
                    <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Research Interest</h2>
                        {profile.research_preference && Array.isArray(profile.research_preference) && profile.research_preference.length > 0 && (
                            <div className="border rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Field of Research</h3>
                                <div className="space-y-2">
                                    {profile.research_preference.map((id, index) => {
                                        const matchedOption = researchOptions.find(
                                            (option) =>
                                                `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === id
                                        );
                                        return (
                                            <p key={index} className="text-gray-700">
                                                {index + 1}. {matchedOption 
                                                    ? `${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`
                                                    : id}
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="absolute top-[2rem] left-6 md:top-[3rem] md:left-[20.2rem] z-10">
                <Link 
                    onClick={() => window.history.back()}
                    className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                >
                    <FaArrowLeft className="text-xl" />
                </Link>
            </div>

            {/* Profile Header */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4 sm:mb-6">
                <div className="relative h-48 sm:h-64">
                    <img
                        src={profile.background_image 
                            ? `/storage/${profile.background_image}`
                            : '/images/default-background.jpg'}
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute -bottom-16 left-4 sm:left-8">
                        <img
                            src={profile.profile_picture 
                                ? `/storage/${profile.profile_picture}`
                                : '/images/default-avatar.jpg'}
                            alt={profile.full_name}
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                    </div>
                </div>
                
                <div className="px-4 sm:px-8 pt-20 pb-4 sm:pb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{profile.full_name}</h1>
                    {type === 'academician' && profile.current_position && (
                        <p className="text-base sm:text-lg text-gray-600 mt-1">{profile.current_position}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center text-gray-500">
                        <p className="text-sm sm:text-base">{university?.full_name} - {faculty?.name}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column - Basic Info */}
                <div className="col-span-1">
                    <div className="bg-white shadow sm:rounded-lg p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            {user?.email && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                    <p className="mt-1 break-words">{user.email}</p>
                                </div>
                            )}
                            {profile.phone_number && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                                    <p className="mt-1">{profile.phone_number}</p>
                                </div>
                            )}
                            {type === 'academician' && (
                                <>
                                    {profile.highest_degree && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Highest Degree</h3>
                                            <p className="mt-1">{profile.highest_degree}</p>
                                        </div>
                                    )}
                                    {profile.field_of_study && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Field of Study</h3>
                                            <p className="mt-1">{profile.field_of_study}</p>
                                        </div>
                                    )}
                                </>
                            )}
                            {(type === 'postgraduate' || type === 'undergraduate') && profile.matric_no && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Matric No</h3>
                                    <p className="mt-1">{profile.matric_no}</p>
                                </div>
                            )}
                            {(type === 'postgraduate' || type === 'undergraduate') && profile.nationality && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Nationality</h3>
                                    <p className="mt-1">{profile.nationality}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Middle Column - Role Specific Info & Research */}
                <div className="col-span-1 lg:col-span-2">
                    {/* Research Information */}
                    {getResearchText() && (
                        <div className="bg-white shadow sm:rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-semibold mb-4">Research Information</h2>
                            <div className="space-y-2">
                                {getResearchText().map((text, index) => (
                                    <p key={index} className="text-gray-700 text-sm sm:text-base">{text}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Role Specific Information */}
                    {type === 'academician' && renderAcademicianInfo()}
                    {type === 'postgraduate' && renderPostgraduateInfo()}
                    {type === 'undergraduate' && renderUndergraduateInfo()}

                    {/* Biography */}
                    {profile.bio && (
                        <div className="bg-white shadow sm:rounded-lg p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold mb-4">Biography</h2>
                            <div className="prose max-w-none text-sm sm:text-base" 
                                 dangerouslySetInnerHTML={{ __html: profile.bio }}>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Social Links */}
            {(profile.google_scholar || profile.website || profile.linkedin || profile.researchgate) && (
                <div className="bg-white shadow sm:rounded-lg p-4 sm:p-6 mt-4 sm:mt-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">Connect</h2>
                    <div className="flex flex-wrap gap-4 sm:gap-6">
                        <Link
                            href={route('email.compose', { to: user?.email })}
                            className="text-gray-600 hover:text-blue-600"
                            title="Send Email"
                        >
                            <FaEnvelope size={20} sm:size={24} />
                        </Link>
                        {profile.google_scholar && (
                            <a
                                href={profile.google_scholar}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-red-600"
                                title="Google Scholar"
                            >
                                <FaGoogle size={20} sm:size={24} />
                            </a>
                        )}
                        {profile.website && (
                            <a
                                href={profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-green-600"
                                title="Website"
                            >
                                <FaGlobe size={20} sm:size={24} />
                            </a>
                        )}
                        {profile.linkedin && (
                            <a
                                href={profile.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-blue-600"
                                title="LinkedIn"
                            >
                                <FaLinkedin size={20} sm:size={24} />
                            </a>
                        )}
                        {profile.researchgate && (
                            <a
                                href={profile.researchgate}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-blue-600"
                                title="ResearchGate"
                            >
                                <FaResearchgate size={20} sm:size={24} />
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileContent; 