import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import UpdateRoleInformationForm from './Partials/UpdateRoleInformationForm';
import MainLayout from '@/Layouts/MainLayout';

export default function Edit({ }) {
    const { isPostgraduate, isAcademician, isUndergraduate, universities, postgraduate, academician, faculties, researchOptions, isFacultyAdmin } = usePage().props;
    return (
        <MainLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Role Profile
                </h2>
            }
            isPostgraduate={isPostgraduate}
            isUndergraduate={isUndergraduate}
            isFacultyAdmin={isFacultyAdmin}
        >
            <Head title="Profile" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateRoleInformationForm
                            isPostgraduate={isPostgraduate}
                            isAcademician={isAcademician}
                            universities={universities}
                            postgraduate={postgraduate}
                            academician={academician}
                            faculties={faculties}
                            researchOptions={researchOptions}
                            className="max-w-xl"
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
