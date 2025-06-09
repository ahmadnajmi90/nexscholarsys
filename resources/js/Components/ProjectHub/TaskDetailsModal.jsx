import React, { useState, Fragment, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop, Description } from '@headlessui/react';
import { Transition } from '@headlessui/react';
import { X, Calendar, User, Clock, MessageSquare, Send, Trash2, Paperclip, FileText, Download } from 'lucide-react';
import Select from 'react-select';
import ConfirmationModal from '@/Components/ConfirmationModal';
import toast from 'react-hot-toast';
import { parseISO, format } from 'date-fns';

export default function TaskDetailsModal({ task, show, onClose, workspaceMembers }) {
    const [isConfirmingDeletion, setIsConfirmingDeletion] = useState(false);
    const [isConfirmingAttachmentDeletion, setIsConfirmingAttachmentDeletion] = useState(false);
    const [attachmentToDelete, setAttachmentToDelete] = useState(null);
    
    // Main task form
    const form = useForm({
        title: task?.title || '',
        description: task?.description || '',
        due_date: task?.due_date || '',
        assignees: task?.assignees?.map(user => user.id) || [],
        priority: task?.priority || 'Medium',
    });
    
    // Separate form for comments
    const commentForm = useForm({
        content: ''
    });
    
    // Separate form for attachments
    const attachmentForm = useForm({
        attachment: null
    });
    
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
                title: task.title || '',
                description: task.description || '',
                due_date: formattedDateTime,
                assignees: task.assignees?.map(user => user.id) || [],
                priority: task.priority || 'Medium',
            });
        }
    }, [task]);
    
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        form.put(route('tasks.update', task.id), {
            onSuccess: () => {
                // Show success toast notification
                toast.success('Task updated successfully!');
                // Do not close the modal on success to allow for multiple edits
            },
            onError: (errors) => {
                // Show error toast notification
                toast.error('Failed to update task. Please check the form.');
            }
        });
    };
    
    // Handle comment submission
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        
        commentForm.post(route('tasks.comments.add', task.id), {
            onSuccess: () => {
                // Clear the comment field on success
                commentForm.reset();
                toast.success('Comment added successfully!');
            },
            onError: () => {
                toast.error('Failed to add comment. Please try again.');
            }
        });
    };
    
    // Handle task deletion
    const confirmDelete = () => {
        // Route name should match your actual route for deleting tasks
        window.location = route('tasks.destroy', task.id);
    };
    
    // Handle attachment submission
    const handleAttachmentSubmit = (e) => {
        e.preventDefault();
        
        attachmentForm.post(route('tasks.attachments.store', task.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                attachmentForm.reset();
                toast.success('Attachment uploaded successfully!');
            },
            onError: () => {
                toast.error('Failed to upload attachment. Please try again.');
            }
        });
    };
    
    // Handle attachment deletion
    const confirmAttachmentDelete = (attachment) => {
        setAttachmentToDelete(attachment);
        setIsConfirmingAttachmentDeletion(true);
    };
    
    const deleteAttachment = () => {
        window.location = route('attachments.destroy', attachmentToDelete.id);
    };
    
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        return new Date(dateString).toLocaleDateString();
    };
    
    // Get formatted member options for the select
    const memberOptions = workspaceMembers?.map(member => ({
        value: member.id,
        label: member.name,
    })) || [];
    
    // Get currently selected members
    const selectedMembers = memberOptions.filter(option => 
        form.data.assignees?.includes(option.value)
    );
    
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
                                        Task Details
                                    </DialogTitle>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsConfirmingDeletion(true)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
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
                                        <div className="mt-1 flex items-center">
                                            <span className="mr-2 text-gray-500">
                                                <User className="w-5 h-5" />
                                            </span>
                                            <div className="p-2 bg-gray-50 rounded-md text-sm text-gray-500 w-full">
                                                Assignees feature coming soon.
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={form.processing}
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            {form.processing ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>

                                {/* Attachments Section */}
                                <div className="mt-6 border-t pt-4">
                                    <h4 className="flex items-center text-sm font-medium text-gray-700 mb-4">
                                        <Paperclip className="w-5 h-5 mr-2" />
                                        Attachments ({task.attachments?.length || 0})
                                    </h4>

                                    {/* Attachment list */}
                                    <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                                        {task.attachments && task.attachments.length > 0 ? (
                                            task.attachments.map((attachment) => (
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
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">No attachments yet</p>
                                        )}
                                    </div>

                                    {/* Attachment upload form */}
                                    <form onSubmit={handleAttachmentSubmit} className="mt-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="min-w-0 flex-1">
                                                <input
                                                    type="file"
                                                    id="attachment"
                                                    onChange={(e) => attachmentForm.setData('attachment', e.target.files[0])}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                />
                                                {attachmentForm.errors.attachment && (
                                                    <p className="mt-1 text-sm text-red-600">{attachmentForm.errors.attachment}</p>
                                                )}
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={attachmentForm.processing || !attachmentForm.data.attachment}
                                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                            >
                                                Upload
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="mt-6 border-t pt-4">
                                    <h4 className="flex items-center text-sm font-medium text-gray-700 mb-4">
                                        <MessageSquare className="w-5 h-5 mr-2" />
                                        Comments ({task.comments?.length || 0})
                                    </h4>

                                    <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
                                        {task.comments && task.comments.length > 0 ? (
                                            task.comments.map((comment) => (
                                                <div key={comment.id} className="flex space-x-3">
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            className="h-8 w-8 rounded-full"
                                                            src={comment.user.avatar_url}
                                                            alt={comment.user.name}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm">
                                                            <span className="font-medium text-gray-900">{comment.user.name}</span>
                                                        </div>
                                                        <div className="mt-1 text-sm text-gray-700">
                                                            <p>{comment.content}</p>
                                                        </div>
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            <p>{new Date(comment.created_at).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
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
                                            <span>Created by: {task.creator.name}</span>
                                        </div>
                                    )}
                                </div>
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
                message={`Are you sure you want to delete the task "${task.title}"? This action cannot be undone.`}
            />
            
            {/* Confirmation Modal for attachment deletion */}
            <ConfirmationModal
                show={isConfirmingAttachmentDeletion}
                onClose={() => setIsConfirmingAttachmentDeletion(false)}
                onConfirm={deleteAttachment}
                title="Delete Attachment"
                message={`Are you sure you want to delete the attachment "${attachmentToDelete?.original_name}"? This action cannot be undone.`}
            />
        </>
    );
} 