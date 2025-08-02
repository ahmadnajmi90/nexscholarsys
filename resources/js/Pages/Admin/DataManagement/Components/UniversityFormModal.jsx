import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import NationalityForm from '@/Pages/Role/Partials/NationalityForm';
import InputLabel from '@/Components/InputLabel';

export default function UniversityFormModal({ isOpen, onClose, university = null, mode = 'create' }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        full_name: university?.full_name || '',
        short_name: university?.short_name || '',
        country: university?.country || '',
        university_category: university?.university_category || '',
        university_type: university?.university_type || '',
        profile_picture: null,
        background_image: null,
    });
    
    const [profilePreview, setProfilePreview] = useState(university?.profile_picture ? `/storage/${university.profile_picture}` : null);
    const [backgroundPreview, setBackgroundPreview] = useState(university?.background_image ? `/storage/${university.background_image}` : null);

    useEffect(() => {
        if (isOpen && mode === 'edit' && university) {
            setData({
                full_name: university.full_name || '',
                short_name: university.short_name || '',
                country: university.country || '',
                university_category: university.university_category || '',
                university_type: university.university_type || '',
                profile_picture: null,
                background_image: null,
            });
            setProfilePreview(university.profile_picture ? `/storage/${university.profile_picture}` : null);
            setBackgroundPreview(university.background_image ? `/storage/${university.background_image}` : null);
        } else if (isOpen && mode === 'create') {
            reset();
            setProfilePreview(null);
            setBackgroundPreview(null);
        }
    }, [isOpen, university, mode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const successMessage = mode === 'create' ? 'University created successfully!' : 'University updated successfully!';
        
        // Determine the correct URL for create or update
        const url = mode === 'create' 
            ? '/api/v1/universities' 
            : `/api/v1/universities/${university.id}`;
        
        // Always use the 'post' method. The useForm hook handles FormData automatically.
        post(url, { 
            data: data, // Pass the entire form data object
            onSuccess: () => {
                toast.success(successMessage);
                onClose();
                if (mode === 'create') {
                    reset();
                    setProfilePreview(null);
                    setBackgroundPreview(null);
                }
            },
            onError: (errors) => {
                toast.error(`Error ${mode === 'create' ? 'saving' : 'updating'} university`);
                console.error(errors);
            }
        });
    };
    
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_picture', file);
            setProfilePreview(URL.createObjectURL(file));
        }
    };
    
    const handleBackgroundImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('background_image', file);
            setBackgroundPreview(URL.createObjectURL(file));
        }
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
            <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {mode === 'create' ? 'Add University' : 'Edit University'}
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
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                            Full Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            id="full_name"
                            value={data.full_name}
                            onChange={(e) => setData('full_name', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.full_name && (
                            <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="short_name" className="block text-sm font-medium text-gray-700">
                            Short Name / Acronym <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            id="short_name"
                            value={data.short_name}
                            onChange={(e) => setData('short_name', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.short_name && (
                            <p className="mt-1 text-sm text-red-600">{errors.short_name}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <NationalityForm
                            value={data.country}
                            onChange={(value) => setData('country', value)}
                            title="Country"
                            errors={errors}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <InputLabel htmlFor="university_category" className="block text-sm font-medium text-gray-700">
                            University Category <span className="text-red-600">*</span>
                        </InputLabel>
                        <select
                            id="university_category"
                            value={data.university_category}
                            onChange={(e) => setData('university_category', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="" disabled>Select Category...</option>
                            <option value="Research">Research</option>
                            <option value="Comprehensive">Comprehensive</option>
                            <option value="N/A">N/A</option>
                        </select>
                        {errors.university_category && (
                            <p className="mt-1 text-sm text-red-600">{errors.university_category}</p>
                        )}
                    </div>
                    
                    <div className="mb-4">
                        <InputLabel htmlFor="university_type" className="block text-sm font-medium text-gray-700">
                            University Type <span className="text-red-600">*</span>
                        </InputLabel>
                        <select
                            id="university_type"
                            value={data.university_type}
                            onChange={(e) => setData('university_type', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="" disabled>Select Type...</option>
                            <option value="Public">Public</option>
                            <option value="Private">Private</option>
                        </select>
                        {errors.university_type && (
                            <p className="mt-1 text-sm text-red-600">{errors.university_type}</p>
                        )}
                    </div>
                    
                    <div className="mb-4">
                        <InputLabel htmlFor="profile_picture" className="block text-sm font-medium text-gray-700">
                            Profile Picture
                        </InputLabel>
                        <input
                            type="file"
                            id="profile_picture"
                            onChange={handleProfilePictureChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            accept="image/jpeg,image/png,image/jpg,image/gif"
                        />
                        {profilePreview && (
                            <div className="mt-2">
                                <img src={profilePreview} alt="Profile Preview" className="h-32 w-32 object-cover rounded-md" />
                            </div>
                        )}
                        {errors.profile_picture && (
                            <p className="mt-1 text-sm text-red-600">{errors.profile_picture}</p>
                        )}
                    </div>
                    
                    <div className="mb-4">
                        <InputLabel htmlFor="background_image" className="block text-sm font-medium text-gray-700">
                            Background Image
                        </InputLabel>
                        <input
                            type="file"
                            id="background_image"
                            onChange={handleBackgroundImageChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            accept="image/jpeg,image/png,image/jpg,image/gif"
                        />
                        {backgroundPreview && (
                            <div className="mt-2">
                                <img src={backgroundPreview} alt="Background Preview" className="h-32 w-full object-cover rounded-md" />
                            </div>
                        )}
                        {errors.background_image && (
                            <p className="mt-1 text-sm text-red-600">{errors.background_image}</p>
                        )}
                    </div>

                    {/* <div className="mb-4">
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                            State / Province
                        </label>
                        <input
                            type="text"
                            id="state"
                            value={data.state}
                            onChange={(e) => setData('state', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.state && (
                            <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                        )}
                    </div> */}

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
                            disabled={processing}
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