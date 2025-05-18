import React from 'react';
import AcademicianForm from './AcademicianForm';
import PostgraduateForm from './PostgraduateForm';
import UndergraduateForm from './UndergraduateForm';
import useRoles from '@/Hooks/useRoles';
import { usePage } from '@inertiajs/react';

export default function UpdateProfileInformation_M({
    universities,
    faculties,
    className = '',
    researchOptions,
    skills
}) {
    const academician = usePage().props.academician; // Related academician data
    const postgraduate = usePage().props.postgraduate; // Related postgraduate data
    const undergraduate = usePage().props.undergraduate; // Related undergraduate data
    const { aiGenerationInProgress, aiGenerationMethod, generatedProfileData } = usePage().props; // Get AI generation parameters
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();

    return (
        <div className="p-4 bg-white shadow sm:rounded-lg">
            {isAcademician && (
                <AcademicianForm
                    academician={academician}
                    researchOptions={researchOptions}
                    aiGenerationInProgress={aiGenerationInProgress}
                    aiGenerationMethod={aiGenerationMethod}
                    generatedProfileData={generatedProfileData}
                />
            )}
            {isPostgraduate && (
                <PostgraduateForm
                    postgraduate={postgraduate}
                    universities={universities}
                    faculties={faculties}
                    researchOptions={researchOptions}
                    skills={skills}
                    aiGenerationInProgress={aiGenerationInProgress}
                    aiGenerationMethod={aiGenerationMethod}
                    generatedProfileData={generatedProfileData}
                />
            )}
            {isUndergraduate && (
                <UndergraduateForm
                    undergraduate={undergraduate}
                    universities={universities}
                    faculties={faculties}
                    researchOptions={researchOptions}
                    skills={skills}
                    aiGenerationInProgress={aiGenerationInProgress}
                    aiGenerationMethod={aiGenerationMethod}
                    generatedProfileData={generatedProfileData}
                />
            )}
        </div>
    );
}
