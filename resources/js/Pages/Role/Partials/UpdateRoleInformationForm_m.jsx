import React from 'react';
import AcademicianForm from './AcademicianForm';
import PostgraduateForm from './PostgraduateForm';
import UndergraduateForm from './UndergraduateForm';
import useRoles from '@/Hooks/useRoles';

export default function UpdateRoleInformationForm_m({
    universities,
    faculties,
    postgraduate,
    academician,
    undergraduate,
    researchOptions,
}) {
    const { isPostgraduate, isUndergraduate, isAcademician } = useRoles();

    return (
        <div className="p-4 bg-white shadow sm:rounded-lg">
            {isAcademician && (
                <AcademicianForm
                    academician={academician}
                    researchOptions={researchOptions}
                />
            )}
            {isPostgraduate && (
                <PostgraduateForm
                    postgraduate={postgraduate}
                    universities={universities}
                    faculties={faculties}
                    researchOptions={researchOptions}
                />
            )}
            {isUndergraduate && (
                <UndergraduateForm
                    undergraduate={undergraduate}
                    universities={universities}
                    faculties={faculties}
                    researchOptions={researchOptions}
                />
            )}
        </div>
    );
}
