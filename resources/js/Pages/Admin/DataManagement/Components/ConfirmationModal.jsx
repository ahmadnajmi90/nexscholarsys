import React from 'react';

export default function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-gray-500">{message}</p>
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-24 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 ml-2"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}