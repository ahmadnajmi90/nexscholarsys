import React, { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';
import { Transition } from '@headlessui/react';
import { X, FileText, CheckSquare } from 'lucide-react';

export default function ChooseTaskTypeModal({ show, onClose, onSelectTaskType }) {
    return (
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
                        <DialogPanel className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                            <div className="flex justify-between items-center pb-3 border-b">
                                <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                                    Choose Task Type
                                </DialogTitle>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-500 p-1"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4">
                                <button
                                    type="button"
                                    onClick={() => onSelectTaskType('normal')}
                                    className="flex flex-col items-center p-6 border-2 border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                                >
                                    <CheckSquare className="w-12 h-12 text-indigo-600 mb-3" />
                                    <span className="text-lg font-medium text-gray-900">Create a Normal Task</span>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Create a standard task with basic details and tracking.
                                    </p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onSelectTaskType('paper')}
                                    className="flex flex-col items-center p-6 border-2 border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                                >
                                    <FileText className="w-12 h-12 text-indigo-600 mb-3" />
                                    <span className="text-lg font-medium text-gray-900">Create a Paper Writing Task</span>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Create a specialized task for academic paper writing with additional fields.
                                    </p>
                                </button>
                            </div>
                        </DialogPanel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
} 