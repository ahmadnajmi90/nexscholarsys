import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import FloatingLabelInput from '@/Components/FloatingLabelInput';
import GradientButton from '@/Components/GradientButton';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="w-full max-w-md mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-screen">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl w-full p-8 sm:p-10">
                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                        Create New Password
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-8">
                        Enter your new password to complete the reset
                    </p>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-6">
                        <FloatingLabelInput
                            id="email"
                            type="email"
                            label="Email Address"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={errors.email}
                            autoComplete="username"
                            disabled={true}
                            className="opacity-75"
                        />

                        <FloatingLabelInput
                            id="password"
                            type="password"
                            label="New Password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            isFocused={true}
                            autoComplete="new-password"
                        />

                        <FloatingLabelInput
                            id="password_confirmation"
                            type="password"
                            label="Confirm New Password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            error={errors.password_confirmation}
                            autoComplete="new-password"
                        />

                        <div className="mt-8">
                            <GradientButton
                                type="submit"
                                loading={processing}
                                disabled={processing}
                            >
                                Reset Password
                            </GradientButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
