import { Head, useForm } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';
import FloatingLabelInput from '@/Components/FloatingLabelInput';
import GradientButton from '@/Components/GradientButton';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="w-full max-w-md mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-screen">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl w-full p-8 sm:p-10">
                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                        Reset Your Password
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-8">
                        Enter your email to receive a reset link
                    </p>

                    {/* Success Message */}
                    {status && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-900">
                                    Email Sent Successfully
                                </p>
                                <p className="text-sm text-green-700 mt-1">
                                    {status}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-6">
                        <FloatingLabelInput
                            id="email"
                            type="email"
                            label="Email Address"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={errors.email}
                            isFocused={true}
                            autoComplete="username"
                        />

                        <div className="mt-8">
                            <GradientButton
                                type="submit"
                                loading={processing}
                                disabled={processing}
                            >
                                Email Password Reset Link
                            </GradientButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
