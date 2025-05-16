import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function WhyNexscholar() {
    const { data, setData, post, processing, errors } = useForm({
        main_reason: '',
        features_interested: [],
        additional_info: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('why-nexscholar.store'));
    };

    const handleCheckboxChange = (option) => {
        const updatedFeatures = data.features_interested.includes(option)
            ? data.features_interested.filter(item => item !== option)
            : [...data.features_interested, option];
        
        setData('features_interested', updatedFeatures);
    };

    return (
        <GuestLayout>
            <Head title="Why Nexscholar?" />

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Help Us Understand Your Needs
                </h2>
                <p className="text-gray-600 mb-6">
                    Your answers help us improve the platform and deliver a better experience for all users.
                </p>

                <form onSubmit={submit}>
                    {/* Question 1 - Single Choice */}
                    <div className="mb-6">
                        <InputLabel htmlFor="main_reason" value="What's your main reason for joining Nexscholar today?" className="font-medium mb-3" />
                        
                        <div className="space-y-2">
                            {[
                                { value: 'A', label: 'To find a research supervisor or specific research opportunities.' },
                                { value: 'B', label: 'To find students or collaborators for my research.' },
                                { value: 'C', label: 'To discover and follow research projects, publications, and grants.' },
                                { value: 'D', label: 'To build my academic profile and showcase my work.' },
                                { value: 'E', label: 'To network with other researchers and professionals in my field.' },
                                { value: 'F', label: 'To stay updated on academic events and news.' },
                                { value: 'G', label: 'I\'m just exploring the platform for now.' },
                                { value: 'H', label: 'Other.' },
                            ].map(option => (
                                <div key={option.value} className="flex items-start">
                                    <input
                                        id={`main_reason_${option.value}`}
                                        type="radio"
                                        name="main_reason"
                                        value={option.value}
                                        checked={data.main_reason === option.value}
                                        onChange={() => setData('main_reason', option.value)}
                                        className="mt-1 h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor={`main_reason_${option.value}`} className="ml-3 block text-sm text-gray-700">
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.main_reason} className="mt-2" />
                    </div>

                    {/* Question 2 - Multiple Choice */}
                    <div className="mb-6">
                        <InputLabel htmlFor="features_interested" value="Which Nexscholar features or areas are you most excited to explore?" className="font-medium mb-3" />
                        
                        <div className="space-y-2">
                            {[
                                { value: 'A', label: 'AI-powered matching (for supervisors, students, or collaborators).' },
                                { value: 'B', label: 'Building and managing my detailed academic profile.' },
                                { value: 'C', label: 'Accessing the directory of universities, faculties, and researchers.' },
                                { value: 'D', label: 'Finding and sharing academic content (e.g., research updates, projects, events).' },
                                { value: 'E', label: 'Tools for CV generation or tracking research impact (like Google Scholar integration).' },
                                { value: 'F', label: 'General networking and connection features.' },
                                { value: 'G', label: 'I\'m not sure yet.' },
                            ].map(option => (
                                <div key={option.value} className="flex items-start">
                                    <input
                                        id={`features_interested_${option.value}`}
                                        type="checkbox"
                                        checked={data.features_interested.includes(option.value)}
                                        onChange={() => handleCheckboxChange(option.value)}
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor={`features_interested_${option.value}`} className="ml-3 block text-sm text-gray-700">
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.features_interested} className="mt-2" />
                    </div>

                    {/* Question 3 - Open-ended Text Area */}
                    <div className="mb-6">
                        <InputLabel htmlFor="additional_info" value="Is there anything specific you're hoping to achieve, find, or suggest that wasn't covered above? (Optional)" className="font-medium" />
                        <textarea
                            id="additional_info"
                            rows={4}
                            className="mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.additional_info}
                            onChange={(e) => setData('additional_info', e.target.value)}
                            placeholder="Please share your thoughts..."
                        />
                        <InputError message={errors.additional_info} className="mt-2" />
                    </div>

                    <div className="flex justify-end mt-6">
                        <PrimaryButton disabled={processing}>
                            Continue
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
} 