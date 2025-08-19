import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function FacultyFormModal({ isOpen, onClose, faculty = null, universityId = null, mode = 'create' }) {
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: faculty?.name || '',
        university_id: faculty?.university_id || universityId || '',
    });

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && faculty) {
                setData({
                    name: faculty.name || '',
                    university_id: faculty.university_id || '',
                });
            } else if (mode === 'create') {
                reset();
                setData({
                    name: '',
                    university_id: universityId || '',
                });
            }
            
            // Only fetch universities if they're not already loaded
            if (universities.length === 0) {
                fetchUniversities();
            }
        }
    }, [isOpen, faculty, universityId, mode]);

    const fetchUniversities = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/v1/app/universities?per_page=100');
            setUniversities(response.data.data);
        } catch (error) {
            console.error('Error fetching universities:', error);
            toast.error('Failed to load universities');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Determine the correct URL for create or update
        const url = mode === 'create' 
            ? '/admin/data-management/faculties' 
            : `/admin/data-management/faculties/${faculty.id}`;
        
        // Always use the 'post' method
        post(url, {
            onSuccess: () => {
                onClose();
                if (mode === 'create') {
                    reset();
                }
            },
            onError: (errors) => {
                console.error(errors);
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
            onClick={(e) => {
                // Close the modal only if the click is on the backdrop itself, not the content
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {mode === 'create' ? 'Add Faculty' : 'Edit Faculty'}
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
                        <label htmlFor="university_id" className="block text-sm font-medium text-gray-700">
                            University <span className="text-red-600">*</span>
                        </label>
                        <select
                            id="university_id"
                            value={data.university_id}
                            onChange={(e) => setData('university_id', e.target.value)}
                            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${(loading || universityId !== null) ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={loading || universityId !== null}
                        >
                            <option value="">Select University</option>
                            {universities.map((university) => (
                                <option key={university.id} value={university.id}>
                                    {university.full_name}
                                </option>
                            ))}
                        </select>
                        {errors.university_id && (
                            <p className="mt-1 text-sm text-red-600">{errors.university_id}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Faculty Name <span className="text-red-600">*</span>
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