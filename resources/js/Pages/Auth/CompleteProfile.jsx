import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function CompleteProfile() {
    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: '',
        university: '',
        role: '',
        industry: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('profile.complete'), {
            onFinish: () => reset('full_name', 'university', 'role', 'industry'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel htmlFor="role" value="Role" />
                    <select
                        id="role"
                        name="role"
                        className="w-full border rounded-md p-2"
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                        required
                    >
                        <option value="" disabled>Select your Role</option>
                        <option value="Academician">Academician</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Industry">Industry</option>
                    </select>
                    <InputError message={errors.role} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="full_name" value="Full Name" />
                    <TextInput
                        id="full_name"
                        name="full_name"
                        value={data.full_name}
                        className="mt-1 block w-full"
                        autoComplete="full_name"
                        isFocused={true}
                        onChange={(e) => setData('full_name', e.target.value)}
                        required
                    />
                    <InputError message={errors.full_name} className="mt-2" />
                </div>

                {data.role !== 'Industry' ? (
                    <div className="mt-4">
                        <InputLabel htmlFor="university" value="University" />
                        <select
                            id="university"
                            name="university"
                            className="w-full border rounded-md p-2"
                            value={data.university}
                            onChange={(e) => setData('university', e.target.value)}
                            required
                        >
                            <option value="" disabled>Select your University</option>
                            <option value="UTM JOHOR BAHRU">UTM JOHOR BAHRU</option>
                            <option value="UTM KUALA LUMPUR">UTM KUALA LUMPUR</option>
                            <option value="UTM PAGOH">UTM PAGOH</option>
                        </select>
                        <InputError message={errors.university} className="mt-2" />
                    </div>
                ) : (
                    <div className="mt-4">
                        <InputLabel htmlFor="industry" value="Industry" />
                        <TextInput
                            id="industry"
                            type="text"
                            name="industry"
                            value={data.industry}
                            className="mt-1 block w-full"
                            autoComplete="industry"
                            onChange={(e) => setData('industry', e.target.value)}
                            required
                        />
                        <InputError message={errors.industry} className="mt-2" />
                    </div>
                )}

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Complete Profile
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
