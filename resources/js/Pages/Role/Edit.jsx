import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import UpdateRoleInformationForm from './Partials/UpdateRoleInformationForm';
import UpdateRoleInformationForm_M from './Partials/UpdateRoleInformationForm_M'; // Mobile version
import useRoles from '@/Hooks/useRoles';
import { Head, usePage } from '@inertiajs/react';

export default function Edit() {
    const { universities, postgraduate, academician, faculties, researchOptions, skills } = usePage().props;
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    const [isDesktop, setIsDesktop] = useState(false); // Detect screen size

    // Effect to determine whether it's mobile or desktop view
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024); // Check for lg breakpoint (1024px)
        };

        handleResize(); // Run on initial render
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <MainLayout
            TopMenuOpen={true}
        >
            <Head title="Personal Information" />

            <div className="py-0 md:py-2 lg:py-2">
                <div className="mx-auto max-w-8xl sm:px-6 md:px-0 lg:px-0">
                    {isDesktop ? (
                        <UpdateRoleInformationForm
                            universities={universities}
                            postgraduate={postgraduate}
                            academician={academician}
                            faculties={faculties}
                            researchOptions={researchOptions}
                            skills={skills}
                        />
                    ) : (
                        <UpdateRoleInformationForm_M
                            universities={universities}
                            postgraduate={postgraduate}
                            academician={academician}
                            faculties={faculties}
                            researchOptions={researchOptions}
                            skills={skills}
                        />
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
