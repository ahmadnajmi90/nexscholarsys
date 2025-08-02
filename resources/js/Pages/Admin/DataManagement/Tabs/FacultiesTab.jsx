import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { router } from '@inertiajs/react';
import FacultyFormModal from '../Components/FacultyFormModal';
import ConfirmationModal from '../Components/ConfirmationModal';
import { FaEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';

export default function FacultiesTab() {
    const [universities, setUniversities] = useState([]);
    const [faculties, setFaculties] = useState({ data: [], meta: {} });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1
    });
    
    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentFaculty, setCurrentFaculty] = useState(null);
    const [formMode, setFormMode] = useState('create');

    useEffect(() => {
        fetchUniversities();
    }, []);

    useEffect(() => {
        if (selectedUniversity) {
            fetchFaculties();
        } else {
            setFaculties({ data: [], meta: { from: 0 } });
        }
    }, [selectedUniversity, pagination.current_page, searchQuery]);

    const fetchUniversities = async () => {
        try {
            const response = await axios.get('/api/v1/universities', {
                params: { per_page: 100 }
            });
            setUniversities(response.data.data);
        } catch (error) {
            console.error('Error fetching universities:', error);
            toast.error('Failed to load universities');
        }
    };

    const fetchFaculties = async () => {
        if (!selectedUniversity) return;
        
        setLoading(true);
        try {
            const response = await axios.get('/api/v1/faculties', {
                params: {
                    university_id: selectedUniversity,
                    page: pagination.current_page,
                    per_page: pagination.per_page,
                    search: searchQuery || undefined,
                    with_university: true
                }
            });
            
            setFaculties({
                data: response.data.data,
                meta: response.data.meta
            });
            setPagination({
                current_page: response.data.meta.current_page,
                per_page: response.data.meta.per_page,
                total: response.data.meta.total,
                last_page: response.data.meta.last_page
            });
        } catch (error) {
            console.error('Error fetching faculties:', error);
            toast.error('Failed to load faculties');
        } finally {
            setLoading(false);
        }
    };

    const handleUniversityChange = (e) => {
        setSelectedUniversity(e.target.value);
        setPagination(prev => ({ ...prev, current_page: 1 }));
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, current_page: page }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, current_page: 1 }));
        // The fetchFaculties effect will trigger
    };

    const openAddModal = () => {
        setCurrentFaculty(null);
        setFormMode('create');
        setIsFormModalOpen(true);
    };

    const openEditModal = (faculty) => {
        setCurrentFaculty(faculty);
        setFormMode('edit');
        setIsFormModalOpen(true);
    };

    const openDeleteModal = (faculty) => {
        setCurrentFaculty(faculty);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!currentFaculty) return;
        
        const deleteAction = async () => {
            try {
                // Step 1: Make the API call with axios
                await axios.delete(`/api/v1/faculties/${currentFaculty.id}`);
                
                // Step 2: On success, show a direct success toast.
                toast.success('Faculty deleted successfully!');
                
                // Step 3: Manually re-fetch the data for that tab.
                fetchFaculties();
                
            } catch (error) {
                // Step 3: Handle errors directly from the axios response.
                if (error.response) {
                    if (error.response.status === 404) {
                        toast.error(`Faculty not found. It may have been already deleted.`);
                        // Refresh the list to update the UI
                        fetchFaculties();
                    } else if (error.response.data?.error) {
                        toast.error(error.response.data.error);
                    } else if (error.response.data?.message) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error(`Error (${error.response.status}): Unable to delete faculty.`);
                    }
                } else {
                    toast.error('Network error or server not responding.');
                }
                console.error('Error deleting faculty:', error);
            } finally {
                // Step 4: Always close the confirmation modal.
                setIsDeleteModalOpen(false);
            }
        };
        
        deleteAction();
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        fetchFaculties();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Faculties</h2>
                <button
                    onClick={() => {
                        // Guard clause to prevent opening the modal if no university is selected
                        if (!selectedUniversity) return;
                        openAddModal();
                    }}
                    disabled={!selectedUniversity}
                    className={`inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest ${!selectedUniversity ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:bg-blue-900'} focus:outline-none focus:border-blue-900 focus:ring ring-blue-300`}
                >
                    <FaPlus className="mr-2" /> Add Faculty
                </button>
            </div>

            {/* University Selector */}
            <div className="mb-6">
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                    Select University
                </label>
                <select
                    id="university"
                    value={selectedUniversity}
                    onChange={handleUniversityChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    <option value="" disabled>Select a university</option>
                    {universities.map((university) => (
                        <option key={university.id} value={university.id}>
                            {university.full_name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedUniversity && (
                <>
                    {/* Search Bar */}
                    <div className="mb-6">
                        <form onSubmit={handleSearch} className="flex">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search faculties..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Faculties Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Academicians
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Postgraduates
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Undergraduates
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : faculties.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center">
                                            No faculties found
                                        </td>
                                    </tr>
                                ) : (
                                    faculties.data.map((faculty, index) => (
                                        <tr key={faculty.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {faculties.meta.from + index}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {faculty.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {faculty.academicians_count || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {faculty.postgraduates_count || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {faculty.undergraduates_count || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => openEditModal(faculty)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    <FaEdit className="inline" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(faculty)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <FaTrash className="inline" /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && faculties.data.length > 0 && (
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1}
                                    className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                                        pagination.current_page === 1
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page}
                                    className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                                        pagination.current_page === pagination.last_page
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{(pagination.current_page - 1) * pagination.per_page + 1}</span> to{' '}
                                        <span className="font-medium">
                                            {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                                        </span>{' '}
                                        of <span className="font-medium">{pagination.total}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <button
                                            onClick={() => handlePageChange(pagination.current_page - 1)}
                                            disabled={pagination.current_page === 1}
                                            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ${
                                                pagination.current_page === 1
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="sr-only">Previous</span>
                                            &larr;
                                        </button>
                                        {/* Page numbers */}
                                        {[...Array(pagination.last_page).keys()].map((page) => {
                                            const pageNumber = page + 1;
                                            // Only show a few pages around the current page
                                            if (
                                                pageNumber === 1 ||
                                                pageNumber === pagination.last_page ||
                                                Math.abs(pageNumber - pagination.current_page) <= 1
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        onClick={() => handlePageChange(pageNumber)}
                                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                            pageNumber === pagination.current_page
                                                                ? 'bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                                                        }`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            } else if (
                                                (pageNumber === 2 && pagination.current_page > 3) ||
                                                (pageNumber === pagination.last_page - 1 && pagination.current_page < pagination.last_page - 2)
                                            ) {
                                                // Show ellipsis
                                                return (
                                                    <span
                                                        key={pageNumber}
                                                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700"
                                                    >
                                                        ...
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })}
                                        <button
                                            onClick={() => handlePageChange(pagination.current_page + 1)}
                                            disabled={pagination.current_page === pagination.last_page}
                                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ${
                                                pagination.current_page === pagination.last_page
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="sr-only">Next</span>
                                            &rarr;
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            <FacultyFormModal
                isOpen={isFormModalOpen}
                onClose={closeFormModal}
                faculty={currentFaculty}
                universityId={selectedUniversity || null}
                mode={formMode}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Delete Faculty"
                message={`Are you sure you want to delete ${currentFaculty?.name}? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
}