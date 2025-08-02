import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ResearchAreaFormModal({ isOpen, onClose, area = null, fieldId = null, mode = 'create' }) {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: area?.name || '',
        field_of_research_id: area?.field_of_research_id || fieldId || '',
    });

    useEffect(() => {
        if (isOpen) {
            if (area) {
                setData({
                    name: area.name || '',
                    field_of_research_id: area.field_of_research_id || '',
                });
            } else {
                reset();
                if (fieldId) {
                    setData('field_of_research_id', fieldId);
                }
            }
            
            // Only fetch fields if they're not already loaded
            if (fields.length === 0) {
                fetchFields();
            }
        }
    }, [isOpen, area, fieldId]);

    const fetchFields = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/v1/fields-of-research?per_page=100');
            setFields(response.data.data);
        } catch (error) {
            console.error('Error fetching fields of research:', error);
            toast.error('Failed to load fields of research');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const successMessage = mode === 'create' ? 'Research area created successfully!' : 'Research area updated successfully!';
        
        if (mode === 'create') {
            post('/api/v1/research-areas', {
                onSuccess: () => {
                    toast.success(successMessage);
                    onClose();
                    reset();
                },
                onError: (errors) => {
                    toast.error('Error saving research area');
                    console.error(errors);
                }
            });
        } else {
            put(`/api/v1/research-areas/${area.id}`, {
                onSuccess: () => {
                    toast.success(successMessage);
                    onClose();
                },
                onError: (errors) => {
                    toast.error('Error updating research area');
                    console.error(errors);
                }
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {mode === 'create' ? 'Add Research Area' : 'Edit Research Area'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="field_of_research_id" className="block text-sm font-medium text-gray-700">
                            Field of Research <span className="text-red-600">*</span>
                        </label>
                        <select
                            id="field_of_research_id"
                            value={data.field_of_research_id}
                            onChange={(e) => setData('field_of_research_id', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            disabled={loading || fieldId !== null}
                        >
                            <option value="">Select Field of Research</option>
                            {fields.map((field) => (
                                <option key={field.id} value={field.id}>
                                    {field.name}
                                </option>
                            ))}
                        </select>
                        {errors.field_of_research_id && (
                            <p className="mt-1 text-sm text-red-600">{errors.field_of_research_id}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Research Area Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || loading}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {processing ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}