import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function SkillsDomainFormModal({ isOpen, onClose, domain = null, mode = 'create' }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: domain?.name || '',
    });

    useEffect(() => {
        if (isOpen && mode === 'edit' && domain) {
            setData({ name: domain.name || '' });
        } else if (isOpen && mode === 'create') {
            reset();
        }
    }, [isOpen, domain, mode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const successMessage = mode === 'create' ? 'Skills Domain created successfully!' : 'Skills Domain updated successfully!';
        
        // Determine the correct URL for create or update
        const url = mode === 'create' 
            ? '/admin/data-management/skills-domains' 
            : `/admin/data-management/skills-domains/${domain.id}`;
        
        // Always use the 'post' method
        post(url, {
            onSuccess: () => {
                toast.success(successMessage);
                onClose();
                if (mode === 'create') {
                    reset();
                }
            },
            onError: (errors) => {
                toast.error(`Error ${mode === 'create' ? 'saving' : 'updating'} skills domain`);
                console.error(errors);
            }
        });
    };



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        {mode === 'edit' ? 'Edit Skills Domain' : 'Add New Skills Domain'}
                    </h3>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-4">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Domain Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g., Technology & Information Technology"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={processing}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {processing ? 'Saving...' : (mode === 'edit' ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}