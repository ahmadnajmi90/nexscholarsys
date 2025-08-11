import React, { useState, Fragment, useEffect, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop, Description } from '@headlessui/react';
import { Transition } from '@headlessui/react';
import { X, Calendar, User, Clock, MessageSquare, Send, Trash2, Paperclip, FileText, Download, BookOpen, FileType, Globe, TrendingUp, Archive } from 'lucide-react';
import { isTaskCompleted } from '@/Utils/utils';
import Select from 'react-select';
import ConfirmationModal from '@/Components/ConfirmationModal';
import AttachmentPreviewModal from './AttachmentPreviewModal';
import toast from 'react-hot-toast';
import { parseISO, format } from 'date-fns';
import axios from 'axios';
import { PAPER_PROGRESS_OPTIONS } from './constants';
import { getUserFullName, getUserProfilePicture } from '@/Utils/userHelpers';

export default function TaskDetailsModal({ task, show, onClose, workspaceMembers, researchOptions = [] }) {
    const [isConfirmingDeletion, setIsConfirmingDeletion] = useState(false);
    const [isConfirmingAttachmentDeletion, setIsConfirmingAttachmentDeletion] = useState(false);
    const [attachmentToDelete, setAttachmentToDelete] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    // Local comments state for real-time updates
    const [comments, setComments] = useState([]);
    const isNewTask = task && !task.id; // Check if we're creating a new task
    
    // Maximum size for previewing files (15MB)
    const MAX_PREVIEW_SIZE = 15 * 1024 * 1024;
    
    // Main task form - Enhanced to include paper-specific fields
    const form = useForm({
        title: task?.title || '',
        description: task?.description || '',
        due_date: task?.due_date || '',
        assignees: task?.assignees?.map(user => user.id) || [],
        priority: task?.priority || 'Medium',
        list_id: task?.board_list_id || null, // Add list_id for new tasks
        task_type: 'normal', // Specify that this is a normal task
        // Paper-specific fields with default values
        area_of_study: [],
        paper_type: '',
        publication_type: '',
        scopus_info: '',
        progress: 'Not Started'
    });
    
    // Separate form for comments
    const commentForm = useForm({
        content: ''
    });
    
    // Separate form for attachments
    const attachmentForm = useForm({
        files: []
    });
    
    // Reset the form when the task changes - Enhanced to handle paper writing tasks
    useEffect(() => {
        if (task) {
            // Initialize comments from task when task changes
            setComments(task.comments || []);
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
            
            // Base form data for all tasks
            const baseFormData = {
                title: task.title || '',
                description: task.description || '',
                due_date: formattedDateTime,
                assignees: task.assignees?.map(user => user.id) || [],
                priority: task.priority || 'Medium',
                list_id: task.board_list_id || null,
                task_type: task.paper_writing_task ? 'paper' : 'normal',
            };
            
            // Check if this is a paper writing task and populate paper-specific fields
            if (task.paper_writing_task) {
                form.setData({
                    ...baseFormData,
                    area_of_study: task.paper_writing_task.area_of_study || [],
                    paper_type: task.paper_writing_task.paper_type || '',
                    publication_type: task.paper_writing_task.publication_type || '',
                    scopus_info: task.paper_writing_task.scopus_info || '',
                    progress: task.paper_writing_task.progress || 'Not Started'
                });
            } else {
                // For normal tasks, reset paper-specific fields to defaults
                form.setData({
                    ...baseFormData,
                    area_of_study: [],
                    paper_type: '',
                    publication_type: '',
                    scopus_info: '',
                    progress: 'Not Started'
                });
            }
        }
    }, [task]);
    
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Ensure task_type is properly set based on whether this is a paper writing task
        const taskType = task && task.paper_writing_task ? 'paper' : 'normal';
        form.setData('task_type', taskType);
        
        if (isNewTask) {
            // Get the list_id from the task object
            const list_id = form.data.list_id || task.board_list_id;
            
            if (!list_id) {
                console.error("No list_id available for task creation");
                toast.error('Failed to create task: No list ID provided');
                return;
            }
            
            // Creating a new task - use the correct route with list ID
            form.post(`/project-hub/lists/${list_id}/tasks`, {
                forceFormData: true, // Ensure file uploads work properly
                onSuccess: () => {
                    // Show success toast notification
                    toast.success('Task created successfully!');
                    onClose(); // Close the modal after creating
                },
                onError: (errors) => {
                    // Show error toast notification
                    console.error("Submission Errors:", errors); // Log errors to the console
                    toast.error('Failed to create task. Please check the form for errors.');
                }
            });
        } else {
            // Updating an existing task
            form.put(`/project-hub/tasks/${task.id}`, {
            onSuccess: () => {
                // Show success toast notification
                toast.success('Task updated successfully!');
                // Do not close the modal on success to allow for multiple edits
            },
            onError: (errors) => {
                // Show error toast notification
                    console.error("Update Errors:", errors); // Log errors to the console
                    toast.error('Failed to update task. Please check the form for errors.');
            }
        });
        }
    };
    
    // Handle comment submission
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentForm.data.content.trim()) return;

        // Manually toggle processing to disable button
        commentForm.processing = true;

        axios.post(route('project-hub.tasks.comments.add', task.id), commentForm.data)
            .then(response => {
                const newComment = response.data.comment;
                if (newComment) {
                    // Add newest comment to top
                    setComments(prev => [newComment, ...prev]);
                }
                toast.success('Comment added!');
                commentForm.reset('content');
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'Failed to add comment.');
            })
            .finally(() => {
                commentForm.processing = false;
            });
    };
    
    // Handle task deletion
    const confirmDelete = () => {
        router.delete(route('project-hub.tasks.destroy', task.id), {
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

    const handleArchiveFromModal = () => {
        if (!task?.id) return;
        router.post(route('project-hub.tasks.archive', task.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Task archived!');
                onClose();
                router.reload({ only: ['initialBoardData'] });
            },
            onError: () => toast.error('Failed to archive task.'),
        });
    };
    
    // State for managing attachments in the UI
    const [attachments, setAttachments] = useState(task?.attachments || []);
    
    // Reset state when task or show changes
    useEffect(() => {
        if (show) {
            // Reset attachments to match the current task or empty array for new tasks
            setAttachments(task?.attachments || []);
            
            // Reset attachment form
            attachmentForm.reset('files');
            
            // Reset preview file
            setPreviewFile(null);
            
            // Reset attachment deletion state
            setAttachmentToDelete(null);
            setIsConfirmingAttachmentDeletion(false);
        }
    }, [task, show]);
    
    // Handle attachment submission
    const handleAttachmentSubmit = (e) => {
        e.preventDefault();
    
        if (attachmentForm.data.files.length === 0) {
            toast.error('Please select at least one file to upload.');
            return;
        }
        
        // Manually set processing state to disable the button
        attachmentForm.processing = true;
    
        // We need to construct FormData manually for file uploads with axios
        const formData = new FormData();
        attachmentForm.data.files.forEach(file => {
            formData.append('files[]', file);
        });
    
        axios.post(route('project-hub.tasks.attachments.store', task.id), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            // The data is directly in response.data
            const newAttachments = response.data.attachments || [];
    
            if (newAttachments.length > 0) {
                setAttachments(prev => [...prev, ...newAttachments]);
                toast.success(response.data.message || 'Attachments uploaded!');
            } else {
                toast.error('Upload succeeded but no new attachments were returned.');
            }
        })
        .catch(error => {
            console.error('Upload Error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to upload attachments.';
            toast.error(errorMessage);
        })
        .finally(() => {
            // Reset processing state and the form fields
            attachmentForm.processing = false;
            attachmentForm.reset('files');
        });
    };
    
    // Handle attachment deletion
    const confirmAttachmentDelete = (attachment) => {
        setAttachmentToDelete(attachment);
        setIsConfirmingAttachmentDeletion(true);
    };
    
    const deleteAttachment = () => {
        // Use axios to send a DELETE request to the attachments.destroy route
        axios.delete(`/project-hub/attachments/${attachmentToDelete.id}`, {
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        })
        .then(response => {
            toast.success('Attachment deleted successfully!');
            setIsConfirmingAttachmentDeletion(false);
            
            // Update local state to remove the deleted attachment
            setAttachments(prev => prev.filter(attachment => attachment.id !== attachmentToDelete.id));
        })
        .catch(error => {
            console.error("Delete Error:", error);
            toast.error('Failed to delete attachment. Please try again.');
        });
    };
    
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        return new Date(dateString).toLocaleDateString();
    };
    
        // Get formatted member options for the select - ensure workspaceMembers is used directly
    const memberOptions = useMemo(() => {
        return workspaceMembers?.map(member => ({
            value: member.id,
            label: getUserFullName(member),
            profilePicture: member.profile_picture,
            role: member.academician ? 'Academician' : member.postgraduate ? 'Postgraduate' : member.undergraduate ? 'Undergraduate' : 'User'
        })) || [];
    }, [workspaceMembers]);

    // Get currently selected members - handle both new and existing tasks
    const selectedMembers = useMemo(() => {
        const assigneeIds = form.data.assignees || [];
        return memberOptions.filter(option => assigneeIds.includes(option.value));
    }, [memberOptions, form.data.assignees]);
    
    // Determine if this is a paper writing task
    const isPaperWritingTask = task && task.paper_writing_task;
    
    if (!task || !show) {
        return null;
    }
    
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
                                        {isNewTask ? 'Create Task' : (isPaperWritingTask ? 'Paper Writing Task Details' : 'Task Details')}
                                        {isPaperWritingTask && (
                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <BookOpen className="w-3 h-3 mr-1" />
                                                Paper Task
                                            </span>
                                        )}
                                    </DialogTitle>
                                    <div className="flex items-center space-x-2">
                                        {!isNewTask && isTaskCompleted(task) && !task.archived_at && (
                                            <button
                                                type="button"
                                                onClick={handleArchiveFromModal}
                                                className="text-gray-500 hover:text-gray-700 p-1"
                                                title="Archive task"
                                            >
                                                <Archive className="w-5 h-5" />
                                            </button>
                                        )}
                                        {!isNewTask && (
                                            <button
                                                type="button"
                                                onClick={() => setIsConfirmingDeletion(true)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="Delete task"
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

                                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    {/* Common fields for all tasks */}
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
                                            rows={4}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Task description"
                                        />
                                    </div>

                                    {/* Paper-specific fields - conditionally rendered */}
                                    {isPaperWritingTask && (
                                        <>
                                            <div className="border-t pt-4">
                                                <h4 className="flex items-center text-sm font-medium text-gray-700 mb-4">
                                                    <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                                                    Paper Writing Details
                                                </h4>
                                                
                                                <div className="space-y-4">
                                                    <div>
                                                        <label htmlFor="area_of_study" className="block text-sm font-medium text-gray-700">
                                                            <span className="flex items-center">
                                                                <Globe className="w-4 h-4 mr-1" />
                                                                Area of Study
                                                            </span>
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
                                                        {form.errors.area_of_study && (
                                                            <p className="mt-1 text-sm text-red-600">{form.errors.area_of_study}</p>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label htmlFor="paper_type" className="block text-sm font-medium text-gray-700">
                                                                <span className="flex items-center">
                                                                    <FileType className="w-4 h-4 mr-1" />
                                                                    Paper Type
                                                                </span>
                                                            </label>
                                                            <select
                                                                id="paper_type"
                                                                value={form.data.paper_type}
                                                                onChange={e => form.setData('paper_type', e.target.value)}
                                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            >
                                                                <option value="" disabled>Select a paper type</option>
                                                                <option value="Experimental Paper">Experimental Paper</option>
                                                                <option value="Systematic Literature Review">Systematic Literature Review</option>
                                                                <option value="Conceptual Paper">Conceptual Paper</option>
                                                                <option value="Literature Review">Literature Review</option>
                                                                <option value="Thesis">Thesis</option>
                                                                <option value="Book Chapter">Book Chapter</option>
                                                                <option value="Research Proposal">Research Proposal</option>
                                                                <option value="Conference Paper">Conference Paper</option>
                                                                <option value="Conference Abstract">Conference Abstract</option>
                                                                <option value="Poster Presentation">Poster Presentation</option>
                                                            </select>
                                                            {form.errors.paper_type && (
                                                                <p className="mt-1 text-sm text-red-600">{form.errors.paper_type}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label htmlFor="publication_type" className="block text-sm font-medium text-gray-700">
                                                                <span className="flex items-center">
                                                                    <BookOpen className="w-4 h-4 mr-1" />
                                                                    Publication Type
                                                                </span>
                                                            </label>
                                                            <select
                                                                id="publication_type"
                                                                value={form.data.publication_type}
                                                                onChange={e => form.setData('publication_type', e.target.value)}
                                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            >
                                                                <option value="" disabled>Select a publication type</option>
                                                                <option value="Journal Article">Journal Article</option>
                                                                <option value="Conference">Conference</option>
                                                                <option value="Book">Book</option>
                                                                <option value="Book Chapter">Book Chapter</option>
                                                                <option value="Technical Report">Technical Report</option>
                                                                <option value="Dataset">Dataset</option>
                                                                <option value="Software / Code">Software / Code</option>
                                                            </select>
                                                            {form.errors.publication_type && (
                                                                <p className="mt-1 text-sm text-red-600">{form.errors.publication_type}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="scopus_info" className="block text-sm font-medium text-gray-700">
                                                            Scopus/ WOS Quartile
                                                        </label>
                                                        <select
                                                            id="scopus_info"
                                                            value={form.data.scopus_info}
                                                            onChange={e => form.setData('scopus_info', e.target.value)}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        >
                                                            <option value="" disabled>Select a quartile</option>
                                                            <option value="WOS Q1">WOS Q1</option>
                                                            <option value="WOS Q2">WOS Q2</option>
                                                            <option value="WOS Q3">WOS Q3</option>
                                                            <option value="WOS Q4">WOS Q4</option>
                                                            <option value="Scopus Q1">Scopus Q1</option>
                                                            <option value="Scopus Q2">Scopus Q2</option>
                                                            <option value="Scopus Q3">Scopus Q3</option>
                                                            <option value="Scopus Q4">Scopus Q4</option>
                                                        </select>
                                                        {form.errors.scopus_info && (
                                                            <p className="mt-1 text-sm text-red-600">{form.errors.scopus_info}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
                                                            <span className="flex items-center">
                                                                <TrendingUp className="w-4 h-4 mr-1" />
                                                                Progress
                                                            </span>
                                                        </label>
                                                        <select
                                                            id="progress"
                                                            value={form.data.progress}
                                                            onChange={e => form.setData('progress', e.target.value)}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        >
                                                            {PAPER_PROGRESS_OPTIONS.map(option => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {form.errors.progress && (
                                                            <p className="mt-1 text-sm text-red-600">{form.errors.progress}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                                                Due Date & Time
                                            </label>
                                            <div className="mt-1 flex items-center">
                                                <span className="mr-2 text-gray-500">
                                                    <Calendar className="w-5 h-5" />
                                                </span>
                                                <input
                                                    type="datetime-local"
                                                    id="due_date"
                                                    value={form.data.due_date || ''}
                                                    onChange={e => form.setData('due_date', e.target.value)}
                                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                                                Priority
                                            </label>
                                            <div className="mt-1">
                                                <select
                                                    id="priority"
                                                    value={form.data.priority}
                                                    onChange={e => form.setData('priority', e.target.value)}
                                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                >
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="High">High</option>
                                                    <option value="Urgent">Urgent</option>
                                                </select>
                                            </div>
                                        </div>
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
                                                        form.setData('assignees', selected?.map(option => option.value) || []);
                                                    }}
                                                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    classNamePrefix="select"
                                                    placeholder="Select assignees..."
                                                    menuPortalTarget={document.body}
                                                    formatOptionLabel={option => (
                                                        <div className="flex items-center">
                                                            {option.profilePicture && (
                                                                <img 
                                                                    src={option.profilePicture} 
                                                                    alt={option.label}
                                                                    className="w-6 h-6 rounded-full mr-2 object-cover"
                                                                />
                                                            )}
                                                            <div>
                                                                <div className="text-sm">{option.label}</div>
                                                                <div className="text-xs text-gray-500">{option.role}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    styles={{
                                                        menuPortal: (provided) => ({
                                                            ...provided,
                                                            zIndex: 9999
                                                        }),
                                                        option: (provided, state) => ({
                                                            ...provided,
                                                            padding: '8px 12px'
                                                        })
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {form.errors.assignees && (
                                            <p className="mt-1 text-sm text-red-600">{form.errors.assignees}</p>
                                        )}
                                    </div>

                                    {/* Add Attachment (Create mode only) */}
                                    {isNewTask && (
                                        <div className="mt-6">
                                            <label htmlFor="task-attachment" className="block text-sm font-medium text-gray-700 mb-2">
                                                Add Attachment (optional)
                                            </label>
                                            <input
                                                type="file"
                                                id="task-attachment"
                                                multiple
                                                onChange={(e) => form.setData('files', Array.from(e.target.files))}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                            />
                                            {form.errors.files && (
                                                <p className="mt-1 text-sm text-red-600">{form.errors.files}</p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">
                                                You can attach multiple files when creating the task. Additional files can be added after creation.
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-end mt-6 pt-4 border-t">
                                        <button
                                            type="submit"
                                            disabled={form.processing}
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            {form.processing ? 'Saving...' : (isNewTask ? 'Create Task' : 'Save Changes')}
                                        </button>
                                    </div>
                                </form>

                                {/* Attachments Section - Edit mode only */}
                                {!isNewTask && (
                                <div className="mt-6 border-t pt-4">
                                    <h4 className="flex items-center text-sm font-medium text-gray-700 mb-4">
                                        <Paperclip className="w-5 h-5 mr-2" />
                                        Attachments ({attachments?.length || 0})
                                    </h4>

                                    {/* Attachment list - Only show if task exists and has attachments */}
                                    {attachments && attachments.length > 0 && (
                                    <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                                            {attachments.map((attachment) => (
                                                <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                                    <div className="flex items-center">
                                                        <FileText className="w-5 h-5 mr-2 text-gray-500" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">{attachment.original_name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {attachment.size_formatted} · {new Date(attachment.created_at).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <a 
                                                            href={attachment.url} 
                                                            onClick={(e) => {
                                                                const isPreviewable = 
                                                                    (attachment.mime_type?.startsWith('image/') || 
                                                                    attachment.mime_type === 'application/pdf') && 
                                                                    attachment.size < MAX_PREVIEW_SIZE;
                                                                
                                                                if (isPreviewable) {
                                                                    e.preventDefault();
                                                                    setPreviewFile(attachment);
                                                                }
                                                            }}
                                                            download={attachment.original_name}
                                                            className="p-1 text-blue-500 hover:text-blue-700"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                        <button
                                                            type="button"
                                                            onClick={() => confirmAttachmentDelete(attachment)}
                                                            className="p-1 text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Show "No attachments yet" message only for existing tasks */}
                                    {task && (!attachments || attachments.length === 0) && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-500 italic">No attachments yet</p>
                                        </div>
                                    )}

                                    {/* Attachment upload form - Edit mode */}
                                    <form onSubmit={handleAttachmentSubmit} className="mt-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="min-w-0 flex-1">
                                                <input
                                                    type="file"
                                                    id="attachment"
                                                    multiple
                                                    onChange={(e) => attachmentForm.setData('files', Array.from(e.target.files))}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                />
                                                {attachmentForm.errors.files && (
                                                    <p className="mt-1 text-sm text-red-600">{attachmentForm.errors.files}</p>
                                                )}
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={attachmentForm.processing || !attachmentForm.data.files.length}
                                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                            >
                                                Upload
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                )}

                                {/* Only show comments for existing tasks */}
                                {!isNewTask && (
                                    <>
                                <div className="mt-6 border-t pt-4">
                                    <h4 className="flex items-center text-sm font-medium text-gray-700 mb-4">
                                        <MessageSquare className="w-5 h-5 mr-2" />
                                        Comments ({comments.length || 0})
                                    </h4>

                                    <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
                                        {comments && comments.length > 0 ? (
                                            comments.map((comment) => {
                                                        // Use helper functions for consistent user data access
                                                        const avatarUrl = getUserProfilePicture(comment.user);
                                                        const fullName = getUserFullName(comment.user);
                                                
                                                return (
                                                    <div key={comment.id} className="flex space-x-3">
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                className="h-8 w-8 rounded-full object-cover"
                                                                        src={avatarUrl}
                                                                        alt={fullName}
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm">
                                                                <span className="font-medium text-gray-900">
                                                                            {fullName}
                                                                </span>
                                                            </div>
                                                            <div className="mt-1 text-sm text-gray-700">
                                                                <p>{comment.content}</p>
                                                            </div>
                                                            <div className="mt-1 text-xs text-gray-500">
                                                                <p>{new Date(comment.created_at).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">No comments yet</p>
                                        )}
                                    </div>

                                    <form onSubmit={handleCommentSubmit} className="mt-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="min-w-0 flex-1">
                                                <textarea
                                                    id="comment"
                                                    value={commentForm.data.content}
                                                    onChange={(e) => commentForm.setData('content', e.target.value)}
                                                    placeholder="Add a comment..."
                                                    rows={2}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                                {commentForm.errors.content && (
                                                    <p className="mt-1 text-sm text-red-600">{commentForm.errors.content}</p>
                                                )}
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={commentForm.processing || !commentForm.data.content.trim()}
                                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="mt-4 text-xs text-gray-500">
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span>Created: {new Date(task.created_at).toLocaleString()}</span>
                                    </div>
                                    {task.creator && (
                                        <div className="flex items-center mt-1">
                                            <User className="w-4 h-4 mr-1" />
                                                    <span>Created by: {task.creator.full_name}</span>
                                        </div>
                                    )}
                                </div>
                                    </>
                                )}
                            </DialogPanel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
            
            {/* Confirmation Modal for task deletion */}
            <ConfirmationModal
                show={isConfirmingDeletion}
                onClose={() => setIsConfirmingDeletion(false)}
                onConfirm={confirmDelete}
                title="Delete Task"
                message={`Are you sure you want to delete the task "${task?.title || 'Untitled'}"? This action cannot be undone.`}
            />
            
            {/* Confirmation Modal for attachment deletion */}
            <ConfirmationModal
                show={isConfirmingAttachmentDeletion}
                onClose={() => setIsConfirmingAttachmentDeletion(false)}
                onConfirm={deleteAttachment}
                title="Delete Attachment"
                message={`Are you sure you want to delete the attachment "${attachmentToDelete?.original_name}"? This action cannot be undone.`}
            />

            {/* Attachment Preview Modal */}
            <AttachmentPreviewModal 
                file={previewFile} 
                onClose={() => setPreviewFile(null)} 
            />
        </>
    );
} 