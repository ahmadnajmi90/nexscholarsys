import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';
import ConfirmationModal from '../Components/ConfirmationModal';
import PostgraduateProgramFormModal from '../Components/PostgraduateProgramFormModal';
import Pagination from '@/Components/Pagination';
import { router } from '@inertiajs/react';

export default function PostgraduateProgramsTab() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ current_page: 1, per_page: 10, total: 0, last_page: 1 });

  // Filter state
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedProgramType, setSelectedProgramType] = useState('');

  // Data for dropdowns
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [programTypes] = useState([
    'Masters', 'PhD'
  ]);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [formMode, setFormMode] = useState('create');

  // Fetch universities on component mount
  useEffect(() => {
    fetchUniversities();
  }, []);

  // Fetch faculties when university changes
  useEffect(() => {
    if (selectedUniversity) {
      fetchFaculties();
    } else {
      setFaculties([]);
      setSelectedFaculty('');
    }
  }, [selectedUniversity]);

  // Fetch programs when filters or pagination change
  useEffect(() => {
    fetchPrograms();
  }, [pagination.current_page, searchQuery, selectedUniversity, selectedFaculty, selectedProgramType]);

  // Fetch universities for the filter dropdown
  const fetchUniversities = async () => {
    try {
      const response = await axios.get('/api/v1/app/universities', {
        params: { per_page: 1000 } // Get all universities
      });
      setUniversities(response.data.data);
    } catch (error) {
      console.error('Error fetching universities:', error);
      toast.error('Failed to load universities');
    }
  };

  // Fetch faculties for the selected university
  const fetchFaculties = async () => {
    if (!selectedUniversity) return;

    try {
      const response = await axios.get('/api/v1/app/faculties', {
        params: {
          university_id: selectedUniversity,
          per_page: 1000 // Get all faculties for the university
        }
      });
      setFaculties(response.data.data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
      toast.error('Failed to load faculties');
    }
  };

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/app/postgraduate-programs', {
        params: {
          page: pagination.current_page,
          per_page: pagination.per_page,
          search: searchQuery || undefined,
          university_id: selectedUniversity || undefined,
          faculty_id: selectedFaculty || undefined,
          program_type: selectedProgramType || undefined
        }
      });
      setPrograms(response.data.data);
      setPagination({
        current_page: response.data.meta.current_page,
        per_page: response.data.meta.per_page,
        total: response.data.meta.total,
        last_page: response.data.meta.last_page
      });
    } catch (e) {
      console.error(e);
      toast.error('Failed to load Postgraduate Programs');
    } finally { setLoading(false); }
  };

  const openAddModal = () => { setCurrentProgram(null); setFormMode('create'); setIsFormModalOpen(true); };
  const openEditModal = (program) => { setCurrentProgram(program); setFormMode('edit'); setIsFormModalOpen(true); };
  const openDeleteModal = (program) => { setCurrentProgram(program); setIsDeleteModalOpen(true); };

  const handleDelete = async () => {
    if (!currentProgram) return;
    try {
      router.delete(`/admin/data-management/postgraduate-programs/${currentProgram.id}`);
      toast.success('Postgraduate Program deleted');
      setIsDeleteModalOpen(false);
      fetchPrograms();
    } catch (e) { console.error(e); toast.error('Delete failed'); }
  };

  const handlePageChange = (page) => setPagination(prev => ({ ...prev, current_page: page }));

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleUniversityChange = (e) => {
    setSelectedUniversity(e.target.value);
    setSelectedFaculty(''); // Reset faculty when university changes
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleFacultyChange = (e) => {
    setSelectedFaculty(e.target.value);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleProgramTypeChange = (e) => {
    setSelectedProgramType(e.target.value);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  return (
    <div className="p-6">
      {/* Filter Section */}
      <div className="mb-6 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Programs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* University Filter */}
          <div>
            <label htmlFor="university-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by University
            </label>
            <select
              id="university-filter"
              value={selectedUniversity}
              onChange={handleUniversityChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Universities</option>
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Faculty Filter */}
          <div>
            <label htmlFor="faculty-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Faculty
            </label>
            <select
              id="faculty-filter"
              value={selectedFaculty}
              onChange={handleFacultyChange}
              disabled={!selectedUniversity}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {selectedUniversity ? 'All Faculties' : 'Select University First'}
              </option>
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>

          {/* Program Type Filter */}
          <div>
            <label htmlFor="program-type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Program Type
            </label>
            <select
              id="program-type-filter"
              value={selectedProgramType}
              onChange={handleProgramTypeChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Program Types</option>
              {programTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              className="border rounded-md py-2 pl-8 pr-3 w-64"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-2 top-3 text-gray-400" />
          </div>
          <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">Search</button>
        </form>
        <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300"
          >
              <FaPlus className="mr-2" /> Add New Postgraduate Program
        </button>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
              <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  {/* The new "Institution" header */}
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funding</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                  <tr><td className="px-4 py-4" colSpan="6">Loading...</td></tr>
              ) : programs.length === 0 ? (
                  <tr><td className="px-4 py-4" colSpan="6">No programs found.</td></tr>
              ) : (
                  programs.map((p) => (
                      <tr key={p.id}>
                          <td className="px-4 py-2 text-sm text-gray-900 align-top">{p.name}</td>
                          
                          {/* The new consolidated "Institution" cell */}
                          <td className="px-4 py-2 text-sm align-top">
                              <div className="font-medium text-gray-900">{p.university?.full_name || '-'}</div>
                              <div className="text-xs text-gray-500">{p.faculty?.name || 'N/A Faculty'}</div>
                              <div className="text-xs text-gray-500">{p.country || ''}</div>
                          </td>
                          
                          <td className="px-4 py-2 text-sm align-top">{p.duration_years || '-'}</td>
                          <td className="px-4 py-2 text-sm align-top">{p.funding_info || '-'}</td>
                          <td className="px-4 py-2 text-sm align-top">
                              <button onClick={() => openEditModal(p)} className="inline-flex items-center px-2 py-1 text-blue-600"><FaEdit /></button>
                              <button onClick={() => openDeleteModal(p)} className="inline-flex items-center px-2 py-1 text-red-600"><FaTrash /></button>
                          </td>
                      </tr>
                  ))
              )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && programs.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <PostgraduateProgramFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        mode={formMode}
        currentProgram={currentProgram}
        onSuccess={() => { setIsFormModalOpen(false); fetchPrograms(); }}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Postgraduate Program"
        message="Are you sure you want to delete this Postgraduate Program? This action cannot be undone."
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

