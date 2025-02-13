import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import UpdateRoleInformationForm from './Partials/UpdateRoleInformationForm';
import UpdateRoleInformationForm_M from './Partials/UpdateRoleInformationForm_M'; // Mobile version
import useRoles from '@/Hooks/useRoles';
import { Head, usePage } from '@inertiajs/react';

export default function Edit() {
    const { universities, postgraduate, academician, faculties, researchOptions } = usePage().props;
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
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Role Profile
                </h2>
            }
            TopMenuOpen={true}
        >
            <Head title="Profile" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        {isDesktop ? (
                            <UpdateRoleInformationForm
                                universities={universities}
                                postgraduate={postgraduate}
                                academician={academician}
                                faculties={faculties}
                                researchOptions={researchOptions}
                                className="max-w-xl"
                            />
                        ) : (
                            <UpdateRoleInformationForm_M
                                universities={universities}
                                postgraduate={postgraduate}
                                academician={academician}
                                faculties={faculties}
                                researchOptions={researchOptions}
                                className="max-w-xl"
                            />
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
