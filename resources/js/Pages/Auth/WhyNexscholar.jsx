import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function WhyNexscholar() {
    const { data, setData, post, processing, errors } = useForm({
        reason: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('why-nexscholar.store'));
    };

    return (
        <GuestLayout>
            <Head title="Why Nexscholar?" />

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    What brings you to Nexscholar today?
                </h2>
                <p className="text-gray-600 mb-6">
                    Your answer helps us understand our users' needs better and improve the platform.
                </p>

                <form onSubmit={submit}>
                    <div className="mb-4">
                        <InputLabel htmlFor="reason" value="Your reason (optional)" />
                        <textarea
                            id="reason"
                            rows={5}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            placeholder="I'm here to..."
                        />
                        <InputError message={errors.reason} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <a
                            href={route('profile.complete')}
                            className="text-sm text-gray-600 hover:text-gray-900 underline"
                        >
                            Skip this step
                        </a>
                        <PrimaryButton className="ml-4" disabled={processing}>
                            Continue
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
} 