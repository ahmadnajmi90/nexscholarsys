import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, Trash2, MapPin, DollarSign, Brain } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import useRoles from '@/Hooks/useRoles';

// Helper function for formatting file sizes
const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export default function Index({ existingCv = null, searchHistory = [] }) {
    const { isAcademician } = useRoles();
    const { data, setData, post, processing, errors } = useForm({
        cv_file: null,
        use_existing_cv: !!existingCv,
        research_text: '',
        program_type: 'Any',
        preferred_location: '',
        funding_preference: 'Any',
    });

    // Setup react-dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: acceptedFiles => {
            setData((prev) => ({ ...prev, cv_file: acceptedFiles[0], use_existing_cv: false }));
        },
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        multiple: false,
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.use_existing_cv && !data.cv_file) {
            toast.error("Please upload a CV or use the existing one.");
            return;
        }
        if (!data.research_text) {
            toast.error("Please describe your research interests.");
            return;
        }
        post(route('postgraduate-recommendations.analyze'));
    };
    
    const handleUseDifferentCv = () => {
        setData('use_existing_cv', false);
    };

    const handleCancelUpload = () => {
        if (existingCv) {
            setData((prev) => ({ ...prev, cv_file: null, use_existing_cv: true }));
        }
    };

    return (
        <MainLayout title="Postgraduate Program Recommendations">
            <div className="max-w-7xl mx-auto p-6">
                <Head title={isAcademician ? "Find Postgraduate Programs for Your Student" : "Find Your Perfect Postgraduate Match"} />
                <h1 className="text-3xl font-bold mb-2 text-center text-gray-900">
                    {isAcademician ? 'Find Postgraduate Programs for Your Student' : 'Find Your Perfect Postgraduate Match'}
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    {isAcademician 
                        ? 'Upload your student\'s CV and research interests to get AI-powered Postgraduate Program recommendations.' 
                        : 'Upload your CV and your research interests to get AI-powered Postgraduate Program recommendations.'
                    }
                </p>
                {isAcademician && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    <strong>Note for Academicians:</strong> The CV and research information you provide here will only be used for this recommendation search. Your own academician profile will remain unchanged.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* --- CV Upload Section --- */}
                    {/* --- CV Upload Section --- */}
                    <div className="bg-white border rounded-lg p-6">
                        <h2 className="font-medium text-lg mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5" /> 
                            {isAcademician ? 'Upload Student\'s CV' : 'Upload Your CV'}
                        </h2>

                        {data.use_existing_cv && existingCv ? (
                            // STATE 1: Showing the EXISTING CV
                            <div className="border border-green-300 bg-green-50 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center min-w-0">
                                    <FileText className="w-10 h-10 text-green-700 mr-4 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-800 truncate" title={existingCv.name}>{existingCv.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{formatBytes(existingCv.size)} • Updated: {new Date((existingCv.uploaded_at || 0) * 1000).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button type="button" onClick={handleUseDifferentCv} className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 flex-shrink-0 ml-4">Change File</button>
                            </div>
                        ) : (
                            // STATE 2: Showing the UPLOAD form
                            <div>
                                {data.cv_file ? (
                                    // Sub-state: A new file has been selected
                                    <div className="border border-blue-300 bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                                        <div className="flex items-center min-w-0">
                                            <FileText className="w-10 h-10 text-blue-700 mr-4 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-800 truncate" title={data.cv_file.name}>{data.cv_file.name}</p>
                                                <p className="text-xs text-gray-500 mt-1">{formatBytes(data.cv_file.size)}</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setData('cv_file', null)} className="p-2 text-gray-500 hover:text-red-600 rounded-full" title="Remove file">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    // Sub-state: The empty dropzone
                                    <div {...getRootProps()} className={clsx('border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors', { 'border-indigo-400 bg-indigo-50': isDragActive, 'border-gray-300 bg-gray-50 hover:border-gray-400': !isDragActive })}>
                                        <input {...getInputProps()} />
                                        <div className="flex flex-col items-center">
                                            <UploadCloud className="w-12 h-12 text-gray-400 mb-3" />
                                            <p className="font-semibold text-gray-700">Drag & drop your CV here</p>
                                            <p className="text-gray-500 text-sm">or click to browse files</p>
                                        </div>
                                    </div>
                                )}
                                {existingCv && <div className="mt-3 text-center"><button type="button" onClick={handleCancelUpload} className="text-sm text-gray-600 hover:underline">Cancel Upload</button></div>}
                            </div>
                        )}
                        {errors.cv_file && <p className="text-red-600 text-sm mt-2">{errors.cv_file}</p>}
                    </div>

                    {/* --- Research Interests & Preferences Section --- */}
                    <div className="bg-white border rounded-lg p-6 space-y-4">
                        <h2 className="font-medium text-lg flex items-center gap-2">
                            <Brain className="w-5 h-5" /> 
                            {isAcademician ? 'Student\'s Research Interests & Preferences' : 'Research Interests & Preferences'}
                        </h2>
                        <div>
                            <label htmlFor="research_text" className="block text-sm font-medium text-gray-700 mb-1">
                                {isAcademician ? 'Student\'s Research Interests & Keywords' : 'Research Interests & Keywords'}
                            </label>
                            <textarea
                                id="research_text"
                                value={data.research_text}
                                onChange={(e) => setData('research_text', e.target.value)}
                                rows={6}
                                placeholder={isAcademician 
                                    ? "Describe your student's research interests, methodologies, and areas of expertise (e.g., machine learning, social media analytics, computational linguistics)..."
                                    : "Describe your research interests, methodologies, and areas of expertise (e.g., machine learning, social media analytics, computational linguistics)..."
                                }
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            {errors.research_text && <p className="text-red-600 text-sm mt-1">{errors.research_text}</p>}
                            {Array.isArray(searchHistory) && searchHistory.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-xs font-medium text-gray-500 mb-2">Recent Searches:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {searchHistory.map((h, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setData('research_text', h.search_text)}
                                                className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                                                title={new Date(h.created_at).toLocaleString()}
                                            >
                                                {h.search_text.length > 40 ? h.search_text.slice(0, 40) + '…' : h.search_text}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="program_type" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Brain className="w-5 h-5"/> Program Type</label>
                                <select
                                    id="program_type"
                                    value={data.program_type}
                                    onChange={(e) => setData('program_type', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="Any">Any</option>
                                    <option value="Master">Master</option>
                                    <option value="PhD">PhD</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="preferred_location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><MapPin className="w-5 h-5"/> Preferred Location (optional)</label>
                                <input
                                    id="preferred_location"
                                    type="text"
                                    value={data.preferred_location}
                                    onChange={(e) => setData('preferred_location', e.target.value)}
                                    placeholder="e.g., UK, Europe, or specific universities"
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="funding_preference" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><DollarSign className="w-5 h-5"/> Funding Preference</label>
                                <select
                                    id="funding_preference"
                                    value={data.funding_preference}
                                    onChange={(e) => setData('funding_preference', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="Any">Any</option>
                                    <option value="Full scholarship + stipend available">Full scholarship + stipend available</option>
                                    <option value="Research assistantship with full tuition waiver">Research assistantship with full tuition waiver</option>
                                    <option value="Research training program scholarship">Research training program scholarship</option>
                                    <option value="Self-funded or external scholarships">Self-funded or external scholarships</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* --- Submit Button Section --- */}
                    <div className="text-center pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <Brain className="w-5 h-5 mr-2" />
                            {processing ? 'Analyzing...' : (isAcademician ? 'Get AI Recommendations for Student' : 'Get AI Recommendations')}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}