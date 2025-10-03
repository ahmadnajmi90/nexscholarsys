import React, { Fragment } from 'react';
import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react';
import { Transition } from '@headlessui/react';
import { X, FileText, Download } from 'lucide-react';

export default function DocumentPreviewModal({ file, onClose }) {
    if (!file) return null;

    const isImage = file.mime_type && file.mime_type.startsWith('image/');
    const isPdf = file.mime_type === 'application/pdf';
    const isPreviewable = isImage || isPdf;

    return (
        <Transition appear show={!!file} as={Fragment}>
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
                        <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />
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
                        <DialogPanel className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <FileText className="w-5 h-5 mr-2 text-gray-500" />
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {file.original_name}
                                    </h3>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <a 
                                        href={file.download_url}
                                        download={file.original_name}
                                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Download className="w-5 h-5" />
                                    </a>
                                    <button
                                        type="button"
                                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
                                        onClick={onClose}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 bg-gray-50 rounded-lg overflow-hidden flex justify-center items-center">
                                {isPreviewable ? (
                                    <div className="w-full">
                                        {isImage && (
                                            <img 
                                                src={file.preview_url} 
                                                alt={file.original_name} 
                                                className="max-w-full max-h-[70vh] mx-auto object-contain"
                                            />
                                        )}
                                        {isPdf && (
                                            <iframe 
                                                src={file.preview_url} 
                                                className="w-full h-[70vh]" 
                                                title={file.original_name}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div className="py-16 text-center">
                                        <FileText className="w-16 h-16 mx-auto text-gray-400" />
                                        <p className="mt-4 text-gray-600">
                                            This file type cannot be previewed. Please download to view.
                                        </p>
                                        <a 
                                            href={file.download_url} 
                                            download={file.original_name}
                                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download File
                                        </a>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-4 text-xs text-gray-500">
                                {file.size_formatted && (
                                    <p>Size: {file.size_formatted}</p>
                                )}
                                {file.created_at && (
                                    <p>Uploaded: {new Date(file.created_at).toLocaleString()}</p>
                                )}
                            </div>
                        </DialogPanel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}

