import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, CheckCircle } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';
import GradientButton from '@/Components/GradientButton';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="w-full max-w-md mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-screen">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl w-full p-8 sm:p-10">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight text-center">
                        Verify Your Email
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-8 text-center">
                        Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you?
                    </p>

                    {/* Success Message */}
                    {status === 'verification-link-sent' && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-900">
                                    Verification Link Sent
                                </p>
                                <p className="text-sm text-green-700 mt-1">
                                    A new verification link has been sent to your email address.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-4">
                        <GradientButton
                            type="submit"
                            loading={processing}
                            disabled={processing}
                        >
                            Resend Verification Email
                        </GradientButton>

                        <div className="text-center pt-2">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-sm text-gray-600 hover:text-gray-900 underline transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-2 py-1"
                            >
                                Log Out
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
