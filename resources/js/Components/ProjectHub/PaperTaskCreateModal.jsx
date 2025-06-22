import React, { useState, Fragment, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop, Description } from '@headlessui/react';
import { Transition } from '@headlessui/react';
import { X, Calendar, User, FileText, Trash2, Upload } from 'lucide-react';
import Select from 'react-select';
import ConfirmationModal from '@/Components/ConfirmationModal';
import toast from 'react-hot-toast';
import { parseISO, format } from 'date-fns';
import axios from 'axios';
import { PAPER_PROGRESS_OPTIONS } from './constants';
import { getUserFullName } from '@/Utils/userHelpers';

export default function PaperTaskCreateModal({ task = null, show, onClose, listId, workspaceMembers, researchOptions = [] }) {
    const [isConfirmingDeletion, setIsConfirmingDeletion] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const isEditMode = !!task;
    
    // Main task form
    const form = useForm({
        // Common task fields
        title: task?.title || '',
        description: task?.description || '',
        due_date: task?.due_date || '',
        assignees: task?.assignees?.map(user => user.id) || [],
        priority: task?.priority || 'Medium',
        // Paper-specific fields
        area_of_study: task?.paperWritingTask?.area_of_study || [],
        paper_type: task?.paperWritingTask?.paper_type || '',
        publication_type: task?.paperWritingTask?.publication_type || '',
        scopus_info: task?.paperWritingTask?.scopus_info || '',
        progress: task?.paperWritingTask?.progress || 'Not Started',
        attachment: null,
        // Hidden fields
        task_type: 'paper',
        list_id: task?.board_list_id || listId || null, // Use task's list_id or the provided listId prop
    });
    
    // Use shared progress options
    const progressOptions = PAPER_PROGRESS_OPTIONS;
    
    // Reset the form when the task changes
    useEffect(() => {
        if (task) {
            // Format the date for the datetime-local input (YYYY-MM-DDThh:mm)
            let formattedDateTime = '';
            
            if (task.due_date) {
                try {
                    // Parse the date string from the database
                    const date = new Date(task.due_date);
                    
                    if (!isNaN(date)) {
                        // Format to YYYY-MM-DDThh:mm for datetime-local input
                        formattedDateTime = format(date, "yyyy-MM-dd'T'HH:mm");
                    }
                } catch (error) {
                    console.error('Error parsing date:', error);
                }
            }
            
            form.setData({
                // Common task fields
                title: task.title || '',
                description: task.description || '',
                due_date: formattedDateTime,
                assignees: task.assignees?.map(user => user.id) || [],
                priority: task.priority || 'Medium',
                // Paper-specific fields
                area_of_study: task.paperWritingTask?.area_of_study || [],
                paper_type: task.paperWritingTask?.paper_type || '',
                publication_type: task.paperWritingTask?.publication_type || '',
                scopus_info: task.paperWritingTask?.scopus_info || '',
                progress: task.paperWritingTask?.progress || 'Not Started',
                attachment: null,
                // Hidden fields
                task_type: 'paper',
                list_id: task.board_list_id || listId || null, // Use task's list_id or the provided listId prop
            });
        }
    }, [task, listId]);
    
    // Fix stale data in "Create Task" modal
    useEffect(() => {
        if (show && !isEditMode) {
            form.reset();
        }
    }, [show, isEditMode]);
    
    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            form.setData('attachment', file);
        }
    };
    
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Make sure list_id is included in the form data
        if (!isEditMode) {
            form.setData('list_id', listId);
        }
        
        // Ensure task_type is set to 'paper'
        form.setData('task_type', 'paper');
        
        // Log form data for debugging
        console.log("Form data being submitted:", form.data);
        
        if (isEditMode) {
            // Update existing task - use the proper URL
            form.put(`/api/v1/tasks/${task.id}`, {
                forceFormData: true, // Ensure file uploads work properly
                onSuccess: () => {
                    toast.success('Paper task updated successfully!');
                    // Do not close the modal on success to allow for multiple edits
                },
                onError: (errors) => {
                    console.error("Update Errors:", errors); // Log errors to the console
                    toast.error('Failed to update paper task. Please check the form for errors.');
                }
            });
        } else {
            // Create new task - use the correct route with list ID
            form.post(`/api/v1/lists/${listId}/tasks`, {
                forceFormData: true, // Ensure file uploads work properly
                onSuccess: () => {
                    toast.success('Paper task created successfully!');
                    onClose();
                },
                onError: (errors) => {
                    console.error("Submission Errors:", errors); // Log errors to the console
                    toast.error('Failed to create paper task. Please check the form for errors.');
                    
                    // Display specific field errors if available
                    if (Object.keys(errors).length > 0) {
                        const errorMessages = Object.entries(errors)
                            .map(([field, message]) => `${field}: ${message}`)
                            .join('\n');
                        console.error("Field errors:", errorMessages);
                    }
                }
            });
        }
    };
    
    // Handle task deletion
    const confirmDelete = () => {
        router.delete(route('tasks.destroy', task.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Task "${task.title}" deleted successfully.`);
                onClose(); // Close the modal
            },
            onError: (errors) => {
                console.error("Delete Error:", errors);
                toast.error('Failed to delete the task.');
            },
        });
    };
    
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        return new Date(dateString).toLocaleDateString();
    };
    
    // Get formatted member options for the select
    const memberOptions = workspaceMembers?.map(member => ({
        value: member.id,
        label: getUserFullName(member),
    })) || [];
    
    // Get currently selected members
    const selectedMembers = memberOptions.filter(option => 
        form.data.assignees?.includes(option.value)
    );
    
    return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-50 overflow-y-auto"
                    onClose={onClose}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-30" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                                <div className="flex justify-between items-center pb-3 border-b">
                                    <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                                        {isEditMode ? 'Edit Paper Writing Task' : 'Create Paper Writing Task'}
                                    </DialogTitle>
                                    <div className="flex items-center space-x-2">
                                        {isEditMode && (
                                            <button
                                                type="button"
                                                onClick={() => setIsConfirmingDeletion(true)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="text-gray-400 hover:text-gray-500 p-1"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Common Task Fields - Left Column */}
                                        <div className="space-y-4">
                                            <h4 className="font-medium text-gray-900">Basic Task Details</h4>
                                            
                                            <div>
                                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                                    Title
                                                </label>
                                                <input
                                                    type="text"
                                                    id="title"
                                                    value={form.data.title}
                                                    onChange={e => form.setData('title', e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    placeholder="Task title"
                                                    required
                                                />
                                                {form.errors.title && (
                                                    <p className="mt-1 text-sm text-red-600">{form.errors.title}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                                    Description
                                                </label>
                                                <textarea
                                                    id="description"
                                                    value={form.data.description || ''}
                                                    onChange={e => form.setData('description', e.target.value)}
                                                    rows={3}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    placeholder="Task description"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                                                    Due Date & Time
                                                </label>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <div className="relative flex items-stretch flex-grow">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <Calendar className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="datetime-local"
                                                            id="due_date"
                                                            value={form.data.due_date || ''}
                                                            onChange={e => form.setData('due_date', e.target.value)}
                                                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                                                    Priority
                                                </label>
                                                <select
                                                    id="priority"
                                                    value={form.data.priority}
                                                    onChange={e => form.setData('priority', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                >
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="High">High</option>
                                                    <option value="Urgent">Urgent</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="assignees" className="block text-sm font-medium text-gray-700">
                                                    Assignees
                                                </label>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <div className="relative flex items-stretch flex-grow">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <User className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                        <Select
                                                            isMulti
                                                            name="assignees"
                                                            options={memberOptions}
                                                            value={selectedMembers}
                                                            onChange={(selected) => {
                                                                form.setData('assignees', selected.map(option => option.value));
                                                            }}
                                                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            classNamePrefix="select"
                                                            placeholder="Select assignees..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Paper-Specific Fields - Right Column */}
                                        <div className="space-y-4">
                                            <h4 className="font-medium text-gray-900">Paper Details</h4>
                                            
                                            <div>
                                                <label htmlFor="area_of_study" className="block text-sm font-medium text-gray-700">
                                                    Area of Study
                                                </label>
                                                <Select
                                                    id="area_of_study"
                                                    isMulti
                                                    name="area_of_study"
                                                    options={researchOptions.map(option => ({
                                                        value: `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}`,
                                                        label: `${option.field_of_research_name} - ${option.research_area_name} - ${option.niche_domain_name}`
                                                    }))}
                                                    value={form.data.area_of_study?.map((selectedValue) => {
                                                        const matchedOption = researchOptions.find(
                                                            (option) =>
                                                                `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` ===
                                                                selectedValue
                                                        );
                                                        return {
                                                            value: selectedValue,
                                                            label: matchedOption
                                                                ? `${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`
                                                                : selectedValue,
                                                        };
                                                    })}
                                                    onChange={(selectedOptions) => {
                                                        const selectedValues = selectedOptions.map((option) => option.value);
                                                        form.setData('area_of_study', selectedValues);
                                                    }}
                                                    className="mt-1 block w-full"
                                                    classNamePrefix="select"
                                                    placeholder="Select research areas..."
                                                    menuPortalTarget={document.body}
                                                    styles={{
                                                        menuPortal: (provided) => ({
                                                            ...provided,
                                                            zIndex: 9999
                                                        }),
                                                        menu: (provided) => ({
                                                            ...provided,
                                                            maxHeight: '215px',
                                                            overflowY: 'auto'
                                                        })
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="paper_type" className="block text-sm font-medium text-gray-700">
                                                    Paper Type
                                                </label>
                                                <input
                                                    type="text"
                                                    id="paper_type"
                                                    value={form.data.paper_type || ''}
                                                    onChange={e => form.setData('paper_type', e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    placeholder="e.g. Research Paper, Review, Case Study"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="publication_type" className="block text-sm font-medium text-gray-700">
                                                    Publication Type
                                                </label>
                                                <select
                                                    id="publication_type"
                                                    value={form.data.publication_type || ''}
                                                    onChange={e => form.setData('publication_type', e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                >
                                                    <option value="">Select publication type...</option>
                                                    <option value="Journal">Journal</option>
                                                    <option value="Conference">Conference</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="scopus_info" className="block text-sm font-medium text-gray-700">
                                                    Scopus Info
                                                </label>
                                                <input
                                                    type="text"
                                                    id="scopus_info"
                                                    value={form.data.scopus_info || ''}
                                                    onChange={e => form.setData('scopus_info', e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    placeholder="Scopus indexing information"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
                                                    Progress
                                                </label>
                                                <select
                                                    id="progress"
                                                    value={form.data.progress}
                                                    onChange={e => form.setData('progress', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                >
                                                    {progressOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="pdf_attachment" className="block text-sm font-medium text-gray-700">
                                                    PDF Attachment
                                                </label>
                                                <div className="mt-1 flex items-center">
                                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                                        <span className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            {selectedFile ? 'Change File' : 'Upload PDF'}
                                                        </span>
                                                        <input
                                                            id="pdf_attachment"
                                                            name="pdf_attachment"
                                                            type="file"
                                                            accept=".pdf"
                                                            className="sr-only"
                                                            onChange={handleFileChange}
                                                        />
                                                    </label>
                                                    {selectedFile && (
                                                        <span className="ml-3 text-sm text-gray-500">
                                                            {selectedFile.name}
                                                        </span>
                                                    )}
                                                    {task?.paperWritingTask?.pdf_attachment_path && !selectedFile && (
                                                        <span className="ml-3 text-sm text-gray-500 flex items-center">
                                                            <FileText className="h-4 w-4 mr-1" />
                                                            Current file: {task.paperWritingTask.pdf_attachment_path.split('/').pop()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            disabled={form.processing}
                                        >
                                            {form.processing ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>

            {/* Confirmation Modal for Task Deletion */}
            <ConfirmationModal
                show={isConfirmingDeletion}
                onClose={() => setIsConfirmingDeletion(false)}
                onConfirm={confirmDelete}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
            />
        </>
    );
} 