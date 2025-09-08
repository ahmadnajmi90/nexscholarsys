import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import MainLayout from '@/Layouts/MainLayout';
import useRoles from '@/Hooks/useRoles';

export default function Edit({ mustVerifyEmail, status }) {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();

    return (
        <MainLayout
            title="General Account Settings"
            TopMenuOpen={true}
        >
            <Head title="General Account Settings" />

            <div className="py-4 md:py-4 lg:py-2">
                <div className="mx-auto max-w-7xl px-6 md:px-4 lg:px-0">
                    {/* Flex container to position Account Info and Update Password side by side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Account Information Section */}
                        <div className="bg-white p-6 shadow rounded-lg">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="w-full"
                            />
                        </div>

                        {/* Update Password Section */}
                        <div className="bg-white p-6 shadow rounded-lg">
                            <UpdatePasswordForm className="w-full" />
                        </div>
                    </div>

                    {/* Delete Account Section */}
                    <div className="mt-6 bg-white p-6 shadow rounded-lg">
                        <DeleteUserForm className="w-full" />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

