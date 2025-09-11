import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function SkillFormModal({ isOpen, onClose, skill = null, subdomainId, selectedSubdomain, mode = 'create' }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: skill?.name || '',
        description: skill?.description || '',
        skills_subdomain_id: skill?.skills_subdomain_id || subdomainId || '',
    });

    useEffect(() => {
        if (isOpen && mode === 'edit' && skill) {
            setData({
                name: skill.name || '',
                description: skill.description || '',
                skills_subdomain_id: skill.skills_subdomain_id || subdomainId || ''
            });
        } else if (isOpen && mode === 'create') {
            setData({
                name: '',
                description: '',
                skills_subdomain_id: subdomainId || ''
            });
        }
    }, [isOpen, skill, subdomainId, mode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const successMessage = mode === 'create' ? 'Skill created successfully!' : 'Skill updated successfully!';
        
        // Determine the correct URL for create or update
        const url = mode === 'create' 
            ? '/admin/data-management/skills' 
            : `/admin/data-management/skills/${skill.id}`;
        
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
                toast.error(`Error ${mode === 'create' ? 'saving' : 'updating'} skill`);
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
                        {mode === 'edit' ? 'Edit Skill' : 'Add New Skill'}
                    </h3>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-4">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Skill Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g., React.js"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Brief description of this skill"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="subdomain_name" className="block text-sm font-medium text-gray-700 mb-2">
                                Skills Subdomain
                            </label>
                            <input
                                type="text"
                                id="subdomain_name"
                                value={selectedSubdomain?.name || skill?.subdomain?.name || ''}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                readOnly
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                This skill will belong to the selected subdomain.
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
                            disabled={processing || !data.skills_subdomain_id}
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