import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import UpdateRoleInformationForm from './Partials/UpdateRoleInformationForm';
import MainLayout from '@/Layouts/MainLayout';

export default function Edit({ }) {
    const { isPostgraduate, isAcademician, universities, postgraduate, academician, faculties } = usePage().props;
    return (
        <MainLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Role Profile
                </h2>
            }
            isPostgraduate={isPostgraduate}
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
                            className="max-w-xl"
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
