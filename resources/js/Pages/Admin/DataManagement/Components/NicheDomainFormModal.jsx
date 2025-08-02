import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function NicheDomainFormModal({ isOpen, onClose, domain = null, areaId = null, mode = 'create' }) {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: domain?.name || '',
        research_area_id: domain?.research_area_id || areaId || '',
    });

    useEffect(() => {
        if (isOpen) {
            if (domain) {
                setData({
                    name: domain.name || '',
                    research_area_id: domain.research_area_id || '',
                });
            } else {
                reset();
                if (areaId) {
                    setData('research_area_id', areaId);
                }
            }
            
            // Only fetch areas if they're not already loaded or if we have a specific area ID
            if (areas.length === 0 || areaId) {
                fetchAreas();
            }
        }
    }, [isOpen, domain, areaId]);

    const fetchAreas = async () => {
        setLoading(true);
        try {
            // If we have a specific area ID, we need to make sure we fetch that area
            const url = areaId 
                ? `/api/v1/research-areas/${areaId}` 
                : '/api/v1/research-areas?per_page=100';
            
            const response = await axios.get(url);
            
            // Handle both single item and collection responses
            if (areaId) {
                setAreas([response.data.data]);
            } else {
                setAreas(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching research areas:', error);
            toast.error('Failed to load research areas');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const successMessage = mode === 'create' ? 'Niche domain created successfully!' : 'Niche domain updated successfully!';
        
        if (mode === 'create') {
            post('/api/v1/niche-domains', {
                onSuccess: () => {
                    toast.success(successMessage);
                    onClose();
                    reset();
                },
                onError: (errors) => {
                    toast.error('Error saving niche domain');
                    console.error(errors);
                }
            });
        } else {
            put(`/api/v1/niche-domains/${domain.id}`, {
                onSuccess: () => {
                    toast.success(successMessage);
                    onClose();
                },
                onError: (errors) => {
                    toast.error('Error updating niche domain');
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
                        {mode === 'create' ? 'Add Niche Domain' : 'Edit Niche Domain'}
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
                        <label htmlFor="research_area_id" className="block text-sm font-medium text-gray-700">
                            Research Area <span className="text-red-600">*</span>
                        </label>
                        <select
                            id="research_area_id"
                            value={data.research_area_id}
                            onChange={(e) => setData('research_area_id', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            disabled={loading || areaId !== null}
                        >
                            <option value="">Select Research Area</option>
                            {areas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.name}
                                </option>
                            ))}
                        </select>
                        {errors.research_area_id && (
                            <p className="mt-1 text-sm text-red-600">{errors.research_area_id}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Niche Domain Name <span className="text-red-600">*</span>
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