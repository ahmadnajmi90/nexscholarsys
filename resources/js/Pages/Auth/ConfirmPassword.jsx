import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import FloatingLabelInput from '@/Components/FloatingLabelInput';
import GradientButton from '@/Components/GradientButton';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="w-full max-w-md mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-screen">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl w-full p-8 sm:p-10">
                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                        Confirm Password
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-8">
                        This is a secure area. Please confirm your password before continuing.
                    </p>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-6">
                        <FloatingLabelInput
                            id="password"
                            type="password"
                            label="Password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            isFocused={true}
                            autoComplete="current-password"
                        />

                        <div className="mt-8">
                            <GradientButton
                                type="submit"
                                loading={processing}
                                disabled={processing}
                            >
                                Confirm
                            </GradientButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
