import React from 'react';
import { createPortal } from 'react-dom'; // Import createPortal
import { X, AlertTriangle } from 'lucide-react';

export default function ConfirmationModal({ show, onClose, onConfirm, title, message, confirmButtonText = 'Confirm Delete' }) {
    if (!show) {
        return null;
    }

    // The modal's JSX is now wrapped in createPortal
    return createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto"> {/* You can use a high z-index like z-[100] here */}
            {/* Modal backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
                onClick={onClose}
            ></div>
            
            {/* Modal panel */}
            <div className="flex items-center justify-center min-h-screen p-4">
                <div 
                    className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto z-10"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Modal header */}
                    <div className="flex items-start justify-between p-4 border-b">
                        <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                {title}
                            </h3>
                        </div>
                        <button 
                            type="button" 
                            className="text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    
                    {/* Modal content */}
                    <div className="p-4 text-gray-600">
                        {message}
                    </div>
                    
                    {/* Modal footer */}
                    <div className="px-4 py-3 flex justify-end space-x-3 border-t bg-gray-50 rounded-b-lg">
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={onConfirm}
                        >
                            {confirmButtonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById('modal-portal') // This tells React where to "teleport" the modal
    );
}