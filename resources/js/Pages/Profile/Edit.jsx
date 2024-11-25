import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import MainLayout from '@/Layouts/MainLayout';

export default function Edit({ mustVerifyEmail, status }) {
    const { isPostgraduate } = usePage().props;

    return (
        <MainLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
            isPostgraduate={isPostgraduate}
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Flex container to position Account Info and Update Password side by side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Account Information Section */}
                        <div className="bg-white p-6 shadow sm:rounded-lg">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="w-full"
                            />
                        </div>

                        {/* Update Password Section */}
                        <div className="bg-white p-6 shadow sm:rounded-lg">
                            <UpdatePasswordForm className="w-full" />
                        </div>
                    </div>

                    {/* Delete Account Section */}
                    <div className="mt-6 bg-white p-6 shadow sm:rounded-lg">
                        <DeleteUserForm className="w-full" />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

