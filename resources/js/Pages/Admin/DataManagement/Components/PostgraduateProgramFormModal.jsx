import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import NationalityForm from '@/Pages/Role/Partials/NationalityForm';
import { Dialog, DialogPanel, DialogBackdrop, Transition } from '@headlessui/react';

export default function PostgraduateProgramFormModal({ isOpen, onClose, mode = 'create', currentProgram = null, onSuccess }) {
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'import'
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [form, setForm] = useState({
    name: '',
    program_type: 'Master',
    university_id: '',
    faculty_id: '',
    description: '',
    duration_years: '',
    funding_info: '',
    application_url: '',
    country: '',
  });
  const [file, setFile] = useState(null);
  const [importStep, setImportStep] = useState('upload'); // 'upload' | 'preview'
  const [previewData, setPreviewData] = useState([]);
  const [isImportLoading, setIsImportLoading] = useState(false);
  const isEdit = mode === 'edit' && currentProgram;
  console.log(currentProgram);

  useEffect(() => {
    if (!isOpen) return;
    // Load universities for dropdowns
    axios.get('/api/v1/app/universities', { params: { per_page: 200 } })
      .then(res => setUniversities(res.data.data))
      .catch(() => toast.error('Failed to load universities'));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      // Reset all states when modal is closed
      setActiveTab('manual');
      setFile(null);
      setPreviewData([]);
      setImportStep('upload');
      return;
    }
    
    if (isEdit) {
      setForm({
        name: currentProgram.name || '',
        program_type: currentProgram.program_type || 'Master',
        university_id: currentProgram.university_id || '',
        faculty_id: currentProgram.faculty_id || '',
        description: currentProgram.description || '',
        duration_years: currentProgram.duration_years || '',
        funding_info: currentProgram.funding_info || '',
        application_url: currentProgram.application_url || '',
        country: currentProgram.country || '',
      });
    } else {
      setForm({ name: '', program_type: 'Master', university_id: '', faculty_id: '', description: '', duration_years: '', funding_info: '', application_url: '', country: '' });
    }
  }, [isOpen, isEdit, currentProgram]);

  useEffect(() => {
    if (!form.university_id) { setFaculties([]); return; }
    axios.get('/api/v1/app/faculties', { params: { university_id: form.university_id, per_page: 200 } })
      .then(res => setFaculties(res.data.data))
      .catch(() => setFaculties([]));
  }, [form.university_id]);

  const submitManual = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.post(`/admin/data-management/postgraduate-programs/${currentProgram.id}`, form);
        toast.success('Program updated');
      } else {
        await axios.post('/admin/data-management/postgraduate-programs', form);
        toast.success('Program created');
      }
      onSuccess?.();
    } catch (e) {
      console.error(e);
      toast.error('Save failed');
    }
  };

  const handlePreviewImport = async (e) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a file to preview.'); return; }
    setIsImportLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('/api/v1/app/postgraduate-programs/import/preview', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setPreviewData(response.data || []);
      setImportStep('preview');
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to parse file.');
    } finally {
      setIsImportLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    setIsImportLoading(true);
    try {
      await axios.post('/api/v1/app/postgraduate-programs/import', { programs: previewData });
      toast.success('Programs imported successfully!');
      
      // Reset import state after successful import
      setFile(null);
      setPreviewData([]);
      setImportStep('upload');
      setActiveTab('manual'); // Switch back to manual entry tab
      
      onSuccess?.();
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to save data.');
    } finally {
      setIsImportLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-0 text-left align-middle shadow-xl transition-all">
                <div className="px-6 py-4 border-b flex items-center justify-between">
                  <h3 className="text-lg font-medium">{isEdit ? 'Edit Postgraduate Program' : 'Add Postgraduate Program'}</h3>
                  <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-4 border-b">
                  <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('manual')} className={`pb-2 border-b-2 ${activeTab==='manual'?'border-blue-600 text-blue-600':'border-transparent text-gray-500'}`}>Manual Entry</button>
                    <button onClick={() => setActiveTab('import')} className={`pb-2 border-b-2 ${activeTab==='import'?'border-blue-600 text-blue-600':'border-transparent text-gray-500'}`}>Import from File</button>
                  </nav>
                </div>

                {/* Content */}
                <div className="p-6">
          {activeTab === 'manual' ? (
            <form onSubmit={submitManual} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name <span className="text-red-600">*</span></label>
                <input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm mb-1">Program Type <span className="text-red-600">*</span></label>
                <select value={form.program_type} onChange={(e)=>setForm({...form, program_type: e.target.value})} className="w-full rounded px-3 py-2" required>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">University <span className="text-red-600">*</span></label>
                  <select value={form.university_id} onChange={(e)=>setForm({...form, university_id: e.target.value, faculty_id: ''})} className="w-full rounded px-3 py-2" required>
                    <option value="" disabled>Select university</option>
                    {universities.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Faculty <span className="text-red-600">*</span></label>
                  <select value={form.faculty_id} onChange={(e)=>setForm({...form, faculty_id: e.target.value})} className="w-full rounded px-3 py-2" required>
                    <option value="" disabled>Select faculty</option>
                    {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Description <span className="text-red-600">*</span></label>
                <textarea value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} className="w-full rounded px-3 py-2" rows={4} required/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Duration (e.g., 3 until 8) <span className="text-red-600">*</span></label>
                  <input value={form.duration_years} onChange={(e)=>setForm({...form, duration_years: e.target.value})} className="w-full rounded px-3 py-2" required/>
                </div>
                <div>
                  <label className="block text-sm mb-1">Funding Info <span className="text-red-600">*</span></label>
                  <select value={form.funding_info} onChange={(e)=>setForm({...form, funding_info: e.target.value})} className="w-full rounded px-3 py-2" required>
                    <option value="" disabled>Select funding type</option>
                    <option value="Full scholarship + stipend available">Full scholarship + stipend available</option>
                    <option value="Research assistantship with full tuition waiver">Research assistantship with full tuition waiver</option>
                    <option value="Research training program scholarship">Research training program scholarship</option>
                    <option value="Self-funded or external scholarships">Self-funded or external scholarships</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Application URL <span className="text-red-600">*</span></label>
                  <input value={form.application_url} onChange={(e)=>setForm({...form, application_url: e.target.value})} className="w-full rounded px-3 py-2" />
                </div>
                <div>
                  <NationalityForm title={"Country"} value={form.country} onChange={(value) => setForm({...form, country: value})} errors={false}/>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{isEdit ? 'Update' : 'Create'}</button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {importStep === 'upload' && (
                <form onSubmit={handlePreviewImport} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm text-blue-900">
                    <p className="font-medium mb-1">Instructions</p>
                    <p>Upload a .xlsx or .csv file with a header row containing these columns: <strong>name, program_type, university_id, faculty_id, description, duration_years, funding_info, application_url, country</strong>.</p>
                    <a href="/storage/templates/postgraduate_programs_template.csv" className="text-blue-700 underline" target="_blank" rel="noreferrer">Download template</a>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Select file (.xlsx or .csv)</label>
                    <input type="file" accept=".xlsx,.csv" onChange={(e)=> setFile(e.target.files?.[0] || null)} />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
                    <button type="submit" disabled={isImportLoading || !file} className="px-4 py-2 bg-blue-600 text-white rounded">{isImportLoading ? 'Processing...' : 'Preview Data'}</button>
                  </div>
                </form>
              )}

              {importStep === 'preview' && (
                <div>
                  <h3 className="font-medium text-gray-800">Preview Data ({previewData.length} records found)</h3>
                  <p className="text-sm text-gray-600 mb-4">Please review the extracted data before saving to the database.</p>
                  <div className="max-h-96 overflow-y-auto border rounded">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {previewData.length > 0 && Object.keys(previewData[0]).map((key) => (
                            <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{key.replace('_',' ')}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {previewData.map((row, idx) => (
                          <tr key={idx}>
                            {Object.values(row).map((val, i) => (
                              <td key={i} className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap truncate max-w-xs">{String(val)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button type="button" onClick={() => setImportStep('upload')} className="px-4 py-2 border rounded">Back</button>
                    <button type="button" onClick={handleConfirmImport} disabled={isImportLoading} className="px-4 py-2 bg-green-600 text-white rounded">{isImportLoading ? 'Saving...' : 'Confirm & Save'}</button>
                  </div>
                </div>
              )}
            </div>
          )}
                </div>
              </DialogPanel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

