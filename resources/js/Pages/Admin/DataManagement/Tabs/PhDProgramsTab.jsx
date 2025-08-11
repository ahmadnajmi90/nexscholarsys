import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';
import ConfirmationModal from '../Components/ConfirmationModal';
import PhDProgramFormModal from '../Components/PhDProgramFormModal';

export default function PhDProgramsTab() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ current_page: 1, per_page: 10, total: 0, last_page: 1 });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [formMode, setFormMode] = useState('create');

  useEffect(() => { fetchPrograms(); }, [pagination.current_page, searchQuery]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/phd-programs', {
        params: { page: pagination.current_page, per_page: pagination.per_page, search: searchQuery || undefined }
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
      toast.error('Failed to load PhD programs');
    } finally { setLoading(false); }
  };

  const openAddModal = () => { setCurrentProgram(null); setFormMode('create'); setIsFormModalOpen(true); };
  const openEditModal = (program) => { setCurrentProgram(program); setFormMode('edit'); setIsFormModalOpen(true); };
  const openDeleteModal = (program) => { setCurrentProgram(program); setIsDeleteModalOpen(true); };

  const handleDelete = async () => {
    if (!currentProgram) return;
    try {
      await axios.delete(`/api/v1/phd-programs/${currentProgram.id}`);
      toast.success('PhD Program deleted');
      setIsDeleteModalOpen(false);
      fetchPrograms();
    } catch (e) { console.error(e); toast.error('Delete failed'); }
  };

  const handlePageChange = (page) => setPagination(prev => ({ ...prev, current_page: page }));
  const handleSearch = (e) => { e.preventDefault(); setPagination(prev => ({ ...prev, current_page: 1 })); };

  return (
    <div className="p-6">
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
              <FaPlus className="mr-2" /> Add New PhD Program
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
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">Page {pagination.current_page} of {pagination.last_page}</div>
        <div className="space-x-2">
          <button disabled={pagination.current_page <= 1} onClick={() => handlePageChange(pagination.current_page - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <button disabled={pagination.current_page >= pagination.last_page} onClick={() => handlePageChange(pagination.current_page + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>

      <PhDProgramFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        mode={formMode}
        currentProgram={currentProgram}
        onSuccess={() => { setIsFormModalOpen(false); fetchPrograms(); }}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete PhD Program"
        message="Are you sure you want to delete this PhD Program? This action cannot be undone."
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

