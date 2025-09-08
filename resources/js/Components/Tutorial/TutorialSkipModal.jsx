import React from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function TutorialSkipModal({ show, onClose, onConfirmSkip }) {
    return (
        <Modal show={show} maxWidth="md">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">
                            Skip Tutorial?
                        </h3>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-4">
                        <strong>Are you sure you want to skip the tutorial?</strong>
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">This tutorial will help you:</h4>
                        <ul className="text-sm text-blue-700 space-y-1 ml-4">
                            <li className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                                Understand Nexscholar's key features and capabilities
                            </li>
                            <li className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                                Learn how to build a comprehensive academic profile
                            </li>
                            <li className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                                Discover AI-powered matching and networking tools
                            </li>
                            <li className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                                Master project collaboration and task management
                            </li>
                            <li className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                                Navigate funding opportunities and content sharing
                            </li>
                        </ul>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-amber-800">
                                    <strong>You can always access this tutorial later</strong> from the Tutorial Guide in your Settings menu.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <SecondaryButton onClick={onClose}>
                        Continue Tutorial
                    </SecondaryButton>
                    <PrimaryButton onClick={onConfirmSkip} className="bg-amber-600 hover:bg-amber-700">
                        Skip Tutorial
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
