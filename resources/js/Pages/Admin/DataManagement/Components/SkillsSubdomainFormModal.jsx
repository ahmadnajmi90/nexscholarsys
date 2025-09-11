import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function SkillsSubdomainFormModal({ isOpen, onClose, subdomain = null, domainId, selectedDomain, mode = 'create' }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: subdomain?.name || '',
        skills_domain_id: subdomain?.skills_domain_id || domainId || '',
    });

    useEffect(() => {
        if (isOpen && mode === 'edit' && subdomain) {
            setData({
                name: subdomain.name || '',
                skills_domain_id: subdomain.skills_domain_id || domainId || ''
            });
        } else if (isOpen && mode === 'create') {
            setData({
                name: '',
                skills_domain_id: domainId || ''
            });
        }
    }, [isOpen, subdomain, domainId, mode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const successMessage = mode === 'create' ? 'Skills Subdomain created successfully!' : 'Skills Subdomain updated successfully!';
        
        // Determine the correct URL for create or update
        const url = mode === 'create' 
            ? '/admin/data-management/skills-subdomains' 
            : `/admin/data-management/skills-subdomains/${subdomain.id}`;
        
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
                toast.error(`Error ${mode === 'create' ? 'saving' : 'updating'} skills subdomain`);
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
                        {mode === 'edit' ? 'Edit Skills Subdomain' : 'Add New Skills Subdomain'}
                    </h3>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-4">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Subdomain Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g., Software Development"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="domain_name" className="block text-sm font-medium text-gray-700 mb-2">
                                Skills Domain
                            </label>
                            <input
                                type="text"
                                id="domain_name"
                                value={selectedDomain?.name || subdomain?.domain?.name || ''}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                readOnly
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                This subdomain will belong to the selected domain.
                            </p>
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
                            disabled={processing || !data.skills_domain_id}
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