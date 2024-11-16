import React from 'react';
import { useForm } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('post-grants.store'));
    }

    return (
        <MainLayout title="Add New Grant">
            <div className="p-8">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg max-w-md space-y-6">
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="w-full rounded-lg border-gray-200 p-4 text-sm"
                                placeholder="Enter grant title"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full rounded-lg border-gray-200 p-4 text-sm"
                                placeholder="Enter description"
                            ></textarea>
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="inline-block rounded-lg bg-gray-200 px-5 py-3 text-sm font-medium text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
